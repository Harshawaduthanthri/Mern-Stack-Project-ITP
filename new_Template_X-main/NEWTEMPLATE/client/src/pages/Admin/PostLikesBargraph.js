import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const PostLikesBargraph = () => {
  const [postData, setPostData] = useState([]);

  useEffect(() => {
    axios.get('/api/posts/likes')
      .then((response) => {
        setPostData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const topics = postData.map((post) => post.topic);
  const likes = postData.map((post) => post.likes);

  const data = {
    labels: topics,
    datasets: [
      {
        label: 'Likes',
        data: likes,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Post Likes</h2>
      <Bar data={data} />
    </div>
  );
};

export default PostLikesBargraph;
