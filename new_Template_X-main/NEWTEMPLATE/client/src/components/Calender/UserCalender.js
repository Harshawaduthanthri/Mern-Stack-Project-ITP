import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Modal, Button } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Import from framer-motion
import AdminMenu from '../Layout/AdminMenu';
import Layout from '../Layout/Layout';
const localizer = momentLocalizer(moment);

const UserCalender = ({ history }) => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', description: '' });
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



  const onSelectSlot = ({ start, end }) => {
    if (history && start && end) {
      history.push('/events/new', { start, end });
    } else {
      console.error('Error in onSelectSlot: history, start, or end is undefined');
    }
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

        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable={true}
          onSelectSlot={onSelectSlot}
          views={{ month: true, week: true, day: true }}
          titleAccessor="title"
          style={{ height: '650px' }}
        />
      </div>
    </Layout>
  );
};

export default UserCalender;
