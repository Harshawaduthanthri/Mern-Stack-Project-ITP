import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, Tooltip, Legend, PieController, ArcElement);

const CategoryProductCountChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProductCount = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/category/chart-data');
        const data = response.data;

        // Extracting labels and data for the chart
        const labels = data.map(item => item.name);
        const counts = data.map(item => item.productCount);

        // Setting chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Product Count',
              data: counts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching category and product count:', error);
        setLoading(false);
      }
    };

    fetchCategoryProductCount();
  }, []);

  return (
    <div>
      <h2>Category Product Count</h2>
      {loading? (
        <p>Loading...</p>
      ) : (
        <Pie
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'right',
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default CategoryProductCountChart;