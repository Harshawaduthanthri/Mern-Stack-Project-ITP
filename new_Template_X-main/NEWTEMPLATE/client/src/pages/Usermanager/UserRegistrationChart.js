// components/UserRegistrationChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const UserRegistrationChart = () => {
  const [registrationData, setRegistrationData] = useState([]);

  useEffect(() => {
    // Fetch user registration data from the backend
    const fetchUserRegistrationData = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/auth/user-registration-data');
        setRegistrationData(response.data);
      } catch (error) {
        console.error('Error fetching user registration data:', error);
      }
    };

    fetchUserRegistrationData();
  }, []);

  // Prepare data for the bar graph
  const data = {
    labels: registrationData.map(entry => {
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const monthIndex = entry._id - 1; // Month index starts from 0
      return `${monthNames[monthIndex]} - ${entry.count}`;
    }),
    datasets: [
      {
        label: 'User Registrations',
        data: registrationData.map(entry => entry.count),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h6>x axis-users count<br>
      </br>y axis-month</h6>
      <Bar data={data} />
    </div>
  );
};

export default UserRegistrationChart;
