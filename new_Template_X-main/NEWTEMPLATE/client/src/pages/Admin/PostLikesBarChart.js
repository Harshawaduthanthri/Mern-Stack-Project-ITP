// components/PostLikesBarChart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const PostLikesBarChart = () => {
  const [topPostLikesData, setTopPostLikesData] = useState([]);

  useEffect(() => {
    // Fetch top post likes data from the backend
    const fetchTopPostLikesData = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/post/top-post-likes-data');
        setTopPostLikesData(response.data);
      } catch (error) {
        console.error('Error fetching top post likes data:', error);
      }
    };

    fetchTopPostLikesData();
  }, []);

  // Prepare data for the bar graph
  const data = {
    labels: topPostLikesData.map(post => post.topic),
    datasets: [
      {
        label: 'Likes Count',
        data: topPostLikesData.map(post => post.likes),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Likes Count for Top 5 Posts</h2>
      <Bar data={data} />
    </div>
  );
};

export default PostLikesBarChart;
