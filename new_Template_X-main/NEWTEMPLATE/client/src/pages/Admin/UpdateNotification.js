import React, { useState, useEffect } from "react";
import axios from "axios";
import UserMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import EmployeeNotifications from "./EmployeeNotifications";

const UpdateNotification = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [employeeNotifications, setEmployeeNotifications] = useState([]);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8085/api/v1/appointment/allnotification-appointments"
        );
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (notificationId, newStatus) => {
    try {
      await axios.put(` http://localhost:8085/api/v1/appointment/appointment-status/${notificationId}`,
        {
          status: newStatus,
        }
      );

      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.notifications[0]?._id === notificationId) {
          return {
            ...appointment,
            notifications: [
              { ...appointment.notifications[0], status: newStatus },
            ],
          };
        }
        return appointment;
      });

      setAppointments(updatedAppointments);

      // Send email if appointment status is approved or rejected
      if (newStatus === "approved" || newStatus === "rejected") {
        const appointment = appointments.find(
          (appointment) => appointment.notifications[0]?._id === notificationId
        );
        const email = appointment.user.email;
        sendEmail(email, newStatus, appointment);
      }
    } catch (error) {
      console.error("Error updating notification status:", error);
    }
  };

  const sendEmail = async (email, status, appointment) => {
    try {
      await axios.post(
        "http://localhost:8085/api/v1/appointment/send-appointment-notification",
        {
          email,
          status,
          appointment,
        }
      );
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  const handleApproveAppointment = async (notificationId) => {
    try {
      const response = await axios.post(`     http://localhost:8085/api/v1/Employee/notifications/approve/${notificationId}`
      );

      // Assuming the backend returns the appointmentNotificationModel ID in the response data
      const { appointmentNotificationId } = response.data;

      console.log(
        "Appointment approved, Appointment Notification ID:",
        appointmentNotificationId
      );
      // Optionally, you can update the state or perform any other action after approval
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.firstname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title={"All Appointments"}>
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">All Appointments</h1>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="form-control mb-3"
            />           
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Email</th> {/* New table header for email */}
                    <th>Description</th>
                    <th>Type</th>
                    <th>Specialization</th>
                    <th>Address</th>
                    <th>Phone Number</th>
                    <th>Date</th>
                    <th>Notification Status</th>
                    <th>Update Status</th>
                    <th>Approve</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={appointment._id}>
                      <td>{index + 1}</td>
                      <td>{appointment.firstname}</td>
                      <td>{appointment.lastname}</td>
                      <td>
                        {appointment.user ? appointment.user.email : "N/A"}
                      </td>{" "}
                      {/* Display the email or 'N/A' if user is null */}
                      <td>{appointment.description}</td>
                      <td>{appointment.type}</td>
                      <td>{appointment.specialization}</td>
                      <td>{appointment.address}</td>
                      <td>{appointment.phoneNumber}</td>
                      <td>
                        {moment(appointment.date).format("MMMM DD, YYYY")}
                      </td>
                      <td>{appointment.notifications[0]?.status || "N/A"}</td>
                      <td>
                        <select
                          value={appointment.status}
                          onChange={(e) =>
                            handleStatusUpdate(
                              appointment.notifications[0]?._id,
                              e.target.value
                            )
                          }
                          className="form-control"
                        >
                          <option value="unread">Unread</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="pending">Pending</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleApproveAppointment(
                              appointment.notifications[0]?._id
                            )
                          }
                          className="btn btn-success"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-body">
            <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}> </h3>
            <div className="col-md-12 animate__animated animate__fadeInLeft">
              <EmployeeNotifications />
            </div>
          </div>
          </div>
        </div>
      </div>
 
    </Layout>
  );
};

export default UpdateNotification;