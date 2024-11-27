import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, Tooltip, Legend, BarElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, Tooltip, Legend, BarElement);

const MostBoughtItemsChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMostBoughtItems = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/product/mostboughtitems');
        const data = response.data;

        // Extracting labels and data for the chart
        const labels = data.mostBoughtItems.map(item => item._id);
        const quantities = data.mostBoughtItems.map(item => item.totalQuantity);

        // Generating colors for each bar
        const colors = generateColors(labels.length);

        // Setting chart data
        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Total Quantity',
              data: quantities,
              backgroundColor: colors,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching most bought items:', error);
        setLoading(false);
      }
    };

    fetchMostBoughtItems();
  }, []);

  // Function to generate an array of random colors
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`;
      colors.push(color);
    }
    return colors;
  };

  return (
    <div>
      <h2>Product Stock</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Bar
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'category',
                title: {
                  display: true,
                  text: 'Items',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Total Quantity',
                },
              },
            },
            elements: {
              bar: {
                barThickness: {
                  ratio: 0.5 // Adjust the thickness as needed
                }
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default MostBoughtItemsChart;
