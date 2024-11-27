import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const UserPieChart = () => {
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    // Fetch data from the backend for the pie chart
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/auth/generatePieChart');
        const { data } = response;
        setPieData(data);
      } catch (error) {
        console.error('Error fetching data for pie chart:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Activity Pie Chart',
      },
    },
  };

  return (
    <div>
      <h6>User Activity Pie Chart</h6>
      {pieData && (
        <Pie data={pieData} options={options} />
      )}
    </div>
  );
};

export default UserPieChart;
