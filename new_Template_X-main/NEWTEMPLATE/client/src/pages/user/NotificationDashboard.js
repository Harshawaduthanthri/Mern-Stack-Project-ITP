import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import UserMenu from '../../components/Layout/UserMenu';
import Layout from '../../components/Layout/Layout';


const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState([]);
  const [auth, setAuth] = useAuth();
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get('/api/v1/appointment/notification-appointments');
        setNotifications(response.data.notifications || []);
        setNotificationCount(response.data.notifications.length); // Set notification count
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (auth?.token) {
      getNotifications();
    }
  }, [auth?.token]);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      const detailsPromises = notifications.map(async (notification) => {
        const appointmentId = notification.appointment;
        try {
          const response = await axios.get(`/api/v1/appointment/get-appointments/${appointmentId}`);
          return response.data.appointment;
        } catch (error) {
          console.error(`Error fetching appointment details for ID ${appointmentId}:`, error);
          return null;
        }
      });

      const resolvedDetails = await Promise.all(detailsPromises);
      setAppointmentDetails(resolvedDetails);
    };

    fetchAppointmentDetails();
  }, [notifications]);

  const handleDeleteNotification = async (index) => {
    try {
      const notificationId = notifications[index]._id;
      await axios.delete(`/api/v1/appointment/delete-appointments/${notificationId}`);
      const updatedNotifications = [...notifications];
      updatedNotifications.splice(index, 1);
      setNotifications(updatedNotifications);
      // Optionally, you can also update appointmentDetails accordingly.
      setNotificationCount(updatedNotifications.length); // Update notification count
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await axios.delete('/api/v1/appointment/deleteallnotification-appointments');
      setNotifications([]);
      setAppointmentDetails([]);
      setNotificationCount(0); // Reset notification count
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  return (
    <Layout title={'Appointment Notifications'}>
    <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
            <div className="col-md-3">
                <UserMenu />
            </div>
            <div className="col-md-9">
                <div className="row">
                    <div className="col-lg-11 col-md-12 mx-auto">
                        <div className="card mt-4">
                            <div className="card-header p-3">
                                <h5 className="mb-0">Notifications</h5>
                            </div>
                            <div className="card-body p-3 pb-0">
                                {notifications.map((notification, index) => (
                                    <div key={notification._id} className="alert alert-dark alert-dismissible text-white"  role="alert">
                                        <span className="text-sm">
                                            {appointmentDetails[index] ? (
                                                <>
                                                    <p style={{ marginBottom: '2px', paddingBottom: '0' }}>Firstname: {appointmentDetails[index].firstname}</p>
                                                    <p style={{ marginBottom: '2px', paddingBottom: '0' }}>Lastname: {appointmentDetails[index].lastname}</p>
                                                    {/* Add other appointment details as needed */}
                                                </>
                                            ) : (
                                                <p>No appointment details available.</p>
                                            )}
                                            <p style={{ marginBottom: '2px', paddingBottom: '0' }}>Status: {notification.status}</p>
                                            <p style={{ marginBottom: '2px', paddingBottom: '0' }}>Message: {notification.message}</p>
                                        </span>
                                        <button type="button" onClick={() => handleDeleteNotification(index)} className="btn-close text-lg py-3 opacity-10" aria-label="Close" style={{ color: 'white' }}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                ))}
                                {notifications.length > 0 && (
                                    <button type="button" onClick={handleClearAllNotifications} className="btn btn-dark btn-sm mt-3" style={{ backgroundColor: 'black' }}>Close All</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Layout>

  );
};

export default NotificationDashboard;
