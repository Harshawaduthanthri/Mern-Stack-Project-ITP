import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from "./../../components/Layout/Layout";
import UserMenu from '../../components/Layout/UserMenu';

const CurrentUserAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [cancelMessage, setCancelMessage] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/appointment/getCurrent-appointments');
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleDeleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:8085/api/v1/appointment/delete-appointments/${id}`);
      const updatedAppointments = appointments.filter(appointment => appointment._id !== id);
      setAppointments(updatedAppointments);
      setCancelMessage('Appointment canceled successfully');
      setTimeout(() => {
        setCancelMessage('');
      }, 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div>
      <Layout title={"Dashboard - Booking"}>
        <div className="container-flui p-3 m-3 dashboard">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Appointments</h1>
              {cancelMessage && (
                <p style={{ textAlign: 'center', color: 'green' }}>{cancelMessage}</p>
              )}
              {appointments.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No appointments found.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                  {appointments.map((appointment) => (
                    <div key={appointment._id} style={cardStyle}>
                      <p><strong>User:</strong> {appointment.user.name}</p>
                      <p><strong>First Name:</strong> {appointment.firstname}</p>
                      <p><strong>Last Name:</strong> {appointment.lastname}</p>
                      <p><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                      <p><strong>Type:</strong> {appointment.type}</p>
                      <p><strong>Specialization:</strong> {appointment.specialization}</p>
                      <p><strong>Address:</strong> {appointment.address}</p>
                      <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p>
                      <button
                        type="button"
                        style={deleteButtonStyle}
                        onClick={() => handleDeleteAppointment(appointment._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ccc',
  padding: '15px',
  marginBottom: '20px',
  width: '300px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  position: 'relative',
};

const deleteButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'red',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '5px',
};

export default CurrentUserAppointment;
