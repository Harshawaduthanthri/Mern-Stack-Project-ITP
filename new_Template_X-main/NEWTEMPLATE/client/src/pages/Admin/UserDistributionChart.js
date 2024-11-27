// UserDistributionChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const UserDistributionChart = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/auth/admin/user-distribution');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user distribution data:', error);
      }
    };

    fetchUserData();
  }, []);

  const chartData = {
    labels: Object.keys(userData),
    datasets: [
      {
        label: 'User Distribution',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: Object.values(userData),
      },
    ],
  };

  const chartOptions = {
    scales: {
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'User Role',
          },
        },
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: 'Number of Users',
          },
        },
      ],
    },
  };

  return (
    <div>
      <h2>User Distribution Chart</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default UserDistributionChart;
