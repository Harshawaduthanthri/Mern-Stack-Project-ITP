import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import moment from "moment";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAppointments = async () => {
    try {
      const response = await axios.get("/api/v1/appointment/get-appointments");
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <Layout title={"Your Appointments"}>
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Appointments</h1>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>FirstName</th>
                    <th>Type</th>
                    <th>Specialization</th>
                    <th>Adress</th>
                    <th>Number</th>
                    <th>Date</th>

                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appointment, index) => (
                      <tr key={appointment._id}>
                        <td>{index + 1}</td>
                        <td>{appointment.firstname}</td>
                        <td>{appointment.type}</td>
                        <td>{appointment.specialization}</td>
                        <td>{appointment.address}</td>
                        <td>{appointment.phoneNumber}</td>
                        <td>
                          {moment(appointment.date).format("MMMM DD, YYYY")}
                        </td>

                        {/* Add more columns as needed */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;