import React, { useState, useEffect } from "react";
import axios from "axios";

const EmployeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/Employee//notifications");
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Employee Notifications</h2>
      <input
        type="text"
        placeholder="Search notifications..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Appointment Description</th>
              <th style={styles.th}>Appointment Specialization</th>
            </tr>
          </thead>
          <tbody>
            {notifications
              .filter((notification) =>
                notification.user ? notification.user.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
              )
              .map((notification) => (
                <tr key={notification._id}>
                  <td style={styles.td}>{notification.user ? notification.user.name : "-"}</td>
                  <td style={styles.td}>{notification.user ? notification.user.email : "-"}</td>
                  <td style={styles.td}>{notification.user ? notification.user.phone : "-"}</td>
                  <td style={styles.td}>{notification.user ? notification.user.address : "-"}</td>
                  <td style={styles.td}>{notification.message}</td>
                  <td style={styles.td}>{notification.status}</td>
                  <td style={styles.td}>{notification.appointment ? notification.appointment.description : "-"}</td>
                  <td style={styles.td}>{notification.appointment ? notification.appointment.specialization : "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeNotifications;

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f2f2f2",
    color: "#333",
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    fontWeight: "bold",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
};
