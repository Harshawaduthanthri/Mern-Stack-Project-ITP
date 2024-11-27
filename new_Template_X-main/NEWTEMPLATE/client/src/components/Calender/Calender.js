import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Modal, Button, Drawer } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Import from framer-motion
import AdminMenu from '../Layout/AdminMenu';
import Layout from '../Layout/Layout';
const localizer = momentLocalizer(moment);

const Calender = ({ history }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
  const [editEvent, setEditEvent] = useState(null);
  const [visible, setVisible] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  useEffect(() => {
    fetchEvents();
  }, []);
  const showDrawer = () => {
    setIsDrawerVisible(true);
  };
  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/calender/events');
      const eventsData = response.data.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };


  
  const handleAddEvent = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/calender/events', newEvent);
      setNewEvent({ title: '', start: '', end: '', description: '' });
      onCloseDrawer();
      fetchEvents();

    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleEditEvent = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/calender/events/${editEvent._id}`, editEvent);
      setEditEvent(null);
      setVisible(false);
      fetchEvents();
    } catch (error) {
      console.error('Error editing event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/v1/calender/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const onSelectSlot = ({ start, end }) => {
    if (history && start && end) {
      history.push('/events/new', { start, end });
    } else {
      console.error('Error in onSelectSlot: history, start, or end is undefined');
    }
  };
  
  const onSelectEvent = (event) => {
    setEditEvent(event);
    setVisible(true);
  };

  const onNavigate = ({ action }) => {
    if (action === 'PREV' || action === 'NEXT') {
      fetchEvents();
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };
  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };
  return (
    <Layout>
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
     <div>
        {/* Icon to toggle the add event form */}
        <div className="flex items-center justify-between mb-4">
          <h1>Add New Event:</h1>
          <FaPlus className="cursor-pointer" onClick={showDrawer} />
        </div>

         {/* Add event drawer */}
         <Drawer
        title="Add Event"
        placement="right"
        closable={true}
        onClose={onCloseDrawer}
        visible={isDrawerVisible}
      >
        <div>
          <input
            type="text"
            placeholder="Title"
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <input
            type="datetime-local"
            placeholder="Start Date"
            value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
          <input
            type="datetime-local"
            placeholder="End Date"
            value={moment(newEvent.end).format('YYYY-MM-DDTHH:mm')}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
          />
        </div>
        <div className="mt-4">
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
        <AdminMenu/>
      </Drawer>


      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        onNavigate={onNavigate}
        views={{ month: true, week: true, day: true }}
        titleAccessor="title"
        style={{ height: '650px' }}
      />
      <AnimatePresence>
        {editEvent && visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Modal
              title="Edit Event"
              visible={visible}
              onCancel={handleCancel}
              footer={[
                <Button key="cancel" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="edit" type="primary" onClick={handleEditEvent}>
                  Save Changes
                </Button>,
              ]}
            >
              <form onSubmit={handleEditEvent}>
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={editEvent.title || ''}
                    onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Start Date:</label>
                  <input
                    type="datetime-local"
                    placeholder="Start Date"
                    value={(editEvent.start && moment(editEvent.start).format('YYYY-MM-DDTHH:mm')) || ''}
                    onChange={(e) => setEditEvent({ ...editEvent, start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>End Date:</label>
                  <input
                    type="datetime-local"
                    placeholder="End Date"
                    value={(editEvent.end && moment(editEvent.end).format('YYYY-MM-DDTHH:mm')) || ''}
                    onChange={(e) => setEditEvent({ ...editEvent, end: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Description:</label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={editEvent.description || ''}
                    onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                    required
                  />
                </div>
                <Button type="danger" onClick={() => handleDeleteEvent(editEvent._id)}>
                  Delete Event
                </Button>
                <button type="submit">Save Changes</button>
              </form>
            </Modal>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add confirmation for deletion */}
      {editEvent && visible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
       
        </motion.div>
      )}
    </div>
    </Layout>
  );
};

export default Calender;
