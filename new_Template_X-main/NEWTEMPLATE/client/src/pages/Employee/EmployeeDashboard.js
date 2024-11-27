import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import EmployeeMenu from "../../components/Layout/EmployeeMenu.js";
import { useAuth } from "../../context/auth.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styles for the component
const styles = {
  container: {
    padding: "20px",
  },
  card: {
    marginBottom: "15px",
    padding: "15px",
    borderRadius: "5px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

const EmployeeDashboard = () => {
  const [auth] = useAuth();
  const [employeeNotifications, setEmployeeNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);

  const fetchEmployeeNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/Employee/notifications');
      setEmployeeNotifications(response.data || []);
    } catch (error) {
      console.error('Error fetching employee notifications:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeNotifications();
  }, []);

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedNotification || !statusToUpdate) return;

    try {
      // Update the notification status
      await axios.put(`http://localhost:3000/api/v1/Employee/notifications/update/${selectedNotification._id}`, {
        status: statusToUpdate,
      });

      // Fetch updated notifications after the status update
      fetchEmployeeNotifications();
      setIsModalOpen(false); // Close the modal after updating status

      // Display toast message
      toast.success('Status updated successfully', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error updating notification status:', error);
      toast.error('Error updating status. Please try again.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStatusToUpdate(null); // Reset the status to update
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <EmployeeMenu />
        </div>
        <div className="col-md-9">
          <div className="container mt-3">
            <h1 className="mt-5 mb-4">Employee Dashboard</h1>
            <div className="col-md-9">
              <div className="card mb-4 border border-primary rounded hover-shadow" style={{ backgroundColor: "#e8f5fe" }}>
                <div className="card-body">
                  <h3 className="card-title">Employee Information</h3>
                  <p className="card-text">
                    <strong>Name:</strong> {auth?.user?.name}
                    <br />
                    <strong>Email:</strong> {auth?.user?.email}
                    <br />
                    <strong>Address:</strong> {auth?.user?.address}
                    <br />
                    <strong>Contact:</strong> {auth?.user?.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="employee-notifications">
              <h2>Employee Notifications</h2>
              <ul className="list-group">
                {employeeNotifications.map((notification) => (
                  <li key={notification._id} className="list-group-item">
                    <div>Message: {notification.message}</div>
                    <div>Status: {notification.status}</div>
                    {notification.appointment && (
                      <div>
                        Appointment Description: {notification.appointment.description}
                        <br />
                        Appointment Specialization: {notification.appointment.specialization}
                      </div>
                    )}

                    {notification.user && (
                      <div>
                        User Name: {notification.user.name}
                        <br />
                        Email: {notification.user.email}
                        <br />
                        Phone: {notification.user.phone}
                        <br />
                        Address: {notification.user.address}
                      </div>
                    )}
                    {/* Edit button to open modal */}
                    <button onClick={() => handleEdit(notification)} className="btn btn-primary mt-3">Edit</button>
                  </li>
                ))}
              </ul>
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className="modal-dialog">
              {selectedNotification && (
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Employee Notification</h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body">
                    <div>User Name: {selectedNotification.user.name}</div>
                    <div>Email: {selectedNotification.user.email}</div>
                    {/* Add more fields for editing */}
                    <div>
                      <button onClick={() => setStatusToUpdate('completed')} className="btn btn-success me-2">Completed</button>
                      <button onClick={() => setStatusToUpdate('issue occured')} className="btn btn-danger me-2">Issue Occurred</button>
                      <button onClick={() => setStatusToUpdate('pending')} className="btn btn-warning">Pending</button>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button onClick={handleStatusUpdate} className="btn btn-primary">Update Status</button>
                    <button onClick={handleCloseModal} className="btn btn-secondary">Close</button>
                  </div>
                </div>
              )}
            </Modal>
          </div>
        </div>
      </div>
      {/* Toast container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EmployeeDashboard;