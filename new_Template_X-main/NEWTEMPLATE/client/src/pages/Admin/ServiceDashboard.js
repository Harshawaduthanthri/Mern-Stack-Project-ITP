import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';
import { BsCart4 } from 'react-icons/bs';
import AppointmentTypePieChart from "./AppointmentTypePieChart";
import StatusChart from './AppointmentStatusPiechart';
import CurrentDateAppointment from './CurrentDateAppointment';
import TodayAppointment from './todayAppointment';


const ServiceDashboard = () => {
  const [auth] = useAuth(); // Use auth context to get the authenticated user
  const [totalAppointments, setTotalAppointments] = useState(0); // State to hold the total appointment count
  const [count, setCount] = useState(0);
  const [error, setError] = useState(null);

  // Fetch total appointment count from the backend
  const fetchTotalAppointmentCount = async () => {
    try {
      // Fetch the total appointment count from the backend API
      const response = await axios.get('/api/v1/appointments/count');
      // Extract the total count from the response data
      const { totalAppointments } = response.data;
      // Set the state with the fetched total appointment count
      setTotalAppointments(totalAppointments);
    } catch (error) {
      console.error('Error fetching total appointment count:', error);
    }
  };

  // Fetch data once when the component mounts
  useEffect(() => {
    fetchTotalAppointmentCount();
  }, []);

  useEffect(() => {
    // Fetch the appointment count from the backend API
    fetch('http://localhost:3000/api/v1/appointment/count')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching appointment count');
            }
            return response.json();
        })
        .then(data => {
            setCount(data.count);
        })
        .catch(err => {
            console.error('Error fetching appointment count:', err);
            setError('Error fetching appointment count');
        });
  }, []);

  return (
    <Layout>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card mb-4 animate__animated animate__fadeInUp">
              <div className="card-body">
                <h3 className="card-title">Service Dashboard</h3>
                <p className="card-text">
                  <strong>Name:</strong> {auth?.user?.name}
                  <br />
                  <strong>Email:</strong> {auth?.user?.email}
                  <br />
                  <strong>Contact:</strong> {auth?.user?.phone}
                </p>
              </div>
            </div>

            {/* Display the total appointment count */}
            <div className="row">
              <div className="col-md-12">
                <div className="card mb-4 border border-primary rounded animate__animated animate__fadeIn" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff" }}>Total Appointments</h3>
                    <div></div>
                    <span className="fw-bold" style={{ fontSize: "2rem" }}><i class="fas fa-calendar-alt"  style={{ size: "30px" }} ></i> {count}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-4 border border-primary rounded animate__animated animate__fadeIn" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Appointments Types</h3>
                    <div className="col-md-12">
                      <AppointmentTypePieChart />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-4 border border-primary rounded animate__animated animate__fadeIn" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Appointments Status</h3>
                    <div className="col-md-12">
                      <StatusChart />
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-md-6">
                <div className="card mb-4 border border-primary rounded animate__animated animate__fadeIn" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Appointments List</h3>
                    <div className="col-md-12">
                      <CurrentDateAppointment />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-4 border border-primary rounded animate__animated animate__fadeIn" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}></h3>
                    <div className="col-md-12">
                      <TodayAppointment />
                    </div>
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

export default ServiceDashboard;
