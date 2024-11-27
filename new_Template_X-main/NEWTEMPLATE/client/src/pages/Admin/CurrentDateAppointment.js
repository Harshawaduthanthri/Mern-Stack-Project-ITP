import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Card as BootstrapCard } from 'react-bootstrap'; // Rename Card from react-bootstrap to BootstrapCard
import { Modal } from 'antd'; // Import Modal from Ant Design

const CurrentDateAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDate, setSearchDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  // Function to fetch appointments based on the selected date
  const fetchAppointments = async () => {
    try {
      // Format the search date as 'YYYY-MM-DD' for the API request
      const formattedDate = moment(searchDate).format('YYYY-MM-DD');
      const response = await axios.get(`http://localhost:8085/api/v1/appointment/allnotification-appointments?date=${formattedDate}`);
      
      // Update the state with the fetched appointments
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Fetch appointments whenever the search date changes
  useEffect(() => {
    fetchAppointments();
  }, [searchDate]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchDateChange = (date) => {
    setSearchDate(date);
  };

  // Function to show the modal
  const showModal = () => {
    setModalVisible(true);
  };

  // Function to handle modal close
  const handleCancel = () => {
    setModalVisible(false);
  };

  // Filter appointments based on search query and selected date
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.firstname.toLowerCase().includes(searchQuery.toLowerCase()) &&
    moment(appointment.date).format('YYYY-MM-DD') === moment(searchDate).format('YYYY-MM-DD')
  );

  // Inline styles for table and cells
  const tableStyle = {
    border: '1px solid #dee2e6',
    width: '100%',
    borderCollapse: 'collapse',
  };

  const headerCellStyle = {
    padding: '8px',
    textAlign: 'center',
    backgroundColor: '#9ad2f4',
    color: 'white',
    borderBottom: '2px solid #dee2e6',
    whiteSpace: 'nowrap',
  };

  const cellStyle = {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #dee2e6',
    backgroundColor: '#f8f9fa',
  };

  return (
    <div>
        <h1 className="text-center">Today Appointments</h1>

            {/* Calendar in a Card */}
            <BootstrapCard className="mb-3">
              <BootstrapCard.Header as="h5">Select Date</BootstrapCard.Header>
              <BootstrapCard.Body>
                <Calendar
                  onChange={handleSearchDateChange}
                  value={searchDate}
                  onClickDay={showModal} // Show modal when a date is clicked
                />
              </BootstrapCard.Body>
            </BootstrapCard>



            {/* Modal to display appointments */}
            <Modal
              title="Appointments"
              visible={modalVisible}
              onCancel={handleCancel}
              footer={null}
              width={1000}
            >
                            {/* Name Search Input */}
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="form-control mb-3"
            />
              <div className="table-responsive">
                <table className="table table-bordered" style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={headerCellStyle}>#</th>
                      <th style={headerCellStyle}>Firstname</th>
                      <th style={headerCellStyle}>Lastname</th>
                      <th style={headerCellStyle}>Description</th>
                      <th style={headerCellStyle}>Type</th>
                      <th style={headerCellStyle}>Specialization</th>
                      <th style={headerCellStyle}>Address</th>
                      <th style={headerCellStyle}>Phone Number</th>
                      <th style={headerCellStyle}>Date</th>
                      <th style={headerCellStyle}>Service Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td style={cellStyle}>{index + 1}</td>
                        <td style={cellStyle}>{appointment.firstname}</td>
                        <td style={cellStyle}>{appointment.lastname}</td>
                        <td style={cellStyle}>{appointment.description}</td>
                        <td style={cellStyle}>{appointment.type}</td>
                        <td style={cellStyle}>{appointment.specialization}</td>
                        <td style={cellStyle}>{appointment.address}</td>
                        <td style={cellStyle}>{appointment.phoneNumber}</td>
                        <td style={cellStyle}>{moment(appointment.date).format('MMMM DD, YYYY')}</td>
                        <td style={cellStyle}>{appointment.notifications[0]?.status || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Modal>
         </div>
  );
};

export default CurrentDateAppointment;
