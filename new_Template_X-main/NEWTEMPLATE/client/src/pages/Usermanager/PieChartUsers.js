import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const PieChartUsers = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/auth/generatePieChart');
        const chartData = response.data.data;

        if (!chartData || !chartData.labels || !chartData.datasets) {
          throw new Error('Invalid data format received.');
        }

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data for pie chart:', error);
        setError('Error fetching data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: true,
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
      <h6>Pie Chart (Responsive)</h6>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Pie data={data} options={options} />
      )}
    </div>
  );
};

export default PieChartUsers;
