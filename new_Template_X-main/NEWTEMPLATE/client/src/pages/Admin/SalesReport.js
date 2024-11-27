import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement);

const SalesReport = () => {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/product/report');
        const data = response.data;

        setReportData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching report data:', error);
        setError('Error fetching report data. Please try again later.');
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const renderSalesChart = () => {
    if (!reportData.productSales) {
      return <p>No sales data available</p>;
    }

    const labels = reportData.productSales.map(item => item[0]); // Product names
    const data = reportData.productSales.map(item => item[1].revenue); // Revenue

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Product Sales Revenue',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      aspectRatio: 0.85, // Adjust the aspect ratio to make the chart taller
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'Product Sales Revenue',
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  };

  const renderCategoryChart = () => {
    if (!reportData.categoryPerformance) {
      return <p>No category data available</p>;
    }

    const labels = Object.keys(reportData.categoryPerformance); // Category names
    const data = Object.values(reportData.categoryPerformance).map(item => item.sales); // Sales

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Category Performance',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      cutout: '50%', // Adjust the cutout to control the size of the center hole
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Category Performance',
        },
      },
    };

    return <Doughnut data={chartData} options={options} />;
  };

  return (
    <div>
      <h2>Sales Report</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="row">
          <div className="col-md-6">
            <h3>Product Sales Revenue</h3>
            {renderSalesChart()}
          </div>
          <div className="col-md-6">
            <h3>Category Performance</h3>
            {renderCategoryChart()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
