// components/PostCategoryPieChart.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const PostCategoryPieChart = () => {
  const [categoryCountData, setCategoryCountData] = useState([]);

  useEffect(() => {
    const fetchCategoryCountData = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/post/category-count-data');
        setCategoryCountData(response.data);
      } catch (error) {
        console.error('Error fetching category count data:', error);
      }
    };

    fetchCategoryCountData();
  }, []);

  const data = {
    labels: categoryCountData.map(item => item._id),
    datasets: [
      {
        data: categoryCountData.map(item => item.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#63FF84',
          '#8484FF'
        ]
      }
    ]
  };

  return (
    <div style={{ height: '300px' }}> {/* Adjust the height as needed to match the above chart */}
      <h2>Category Distribution</h2>
      <Pie data={data} />
    </div>
  );
};

export default PostCategoryPieChart;
