import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Card, Modal } from 'antd';

const TodayAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const formattedDate = moment().format('YYYY-MM-DD');
        const response = await axios.get(`http://localhost:8085/api/v1/appointment/allnotification-appointments?date=${formattedDate}`);
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const showModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Filter appointments to get only the ones for the current date
  const currentAppointments = appointments.filter(appointment => moment(appointment.date).isSame(moment(), 'day'));

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Today's Appointments</h2>
      </div>
      <div className="appointment-cards">
        {currentAppointments.map(appointment => (
          <Card
            key={appointment._id} // Assuming appointment has a unique identifier
            title={`${appointment.firstname} ${appointment.lastname}`}
            style={{ marginBottom: '20px' }}
            onClick={() => showModal(appointment)}
          >
            <p><strong>Date:</strong> {moment(appointment.date).format('YYYY-MM-DD')}</p>
           
            <p><strong>Description:</strong> {appointment.description}</p>
            <p><strong>Time:</strong> {appointment.type}</p>
            <p><strong>Specialization:</strong> {appointment.specialization}</p>
            <p><strong>Address:</strong> {appointment.address}</p>
            <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p>
          </Card>
        ))}
      </div>
      
      <Modal
        title={`${selectedAppointment?.firstname} ${selectedAppointment?.lastname}`}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedAppointment && (
          <div>
            <p><strong>Date:</strong> {moment(selectedAppointment.date).format('YYYY-MM-DD')}</p>
            
            <p><strong>Description:</strong> {selectedAppointment.description}</p>
            <p><strong>Type:</strong> {selectedAppointment.type}</p>
            <p><strong>Specialization:</strong> {selectedAppointment.specialization}</p>
            <p><strong>Address:</strong> {selectedAppointment.address}</p>
            <p><strong>Phone Number:</strong> {selectedAppointment.phoneNumber}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TodayAppointment;
