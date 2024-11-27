import React, { useState, useEffect } from 'react';
import axios from 'axios';


const GivenRatings = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/v1/product/getUserRatings'); // Assuming your backend API endpoint is '/api/user/reviews'
        setReviews(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8085/api/v1/product/deleteratings/${reviewId}`); // Replace the URL with your actual delete endpoint
      setReviews(reviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="ratings-container">
      <h1>User Reviews</h1>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews found for the current user</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review._id}>
                <td>{review.product && review.product.name ? review.product.name : 'Unknown Product'}</td>
                <td>{review.rating}</td>
                <td>{review.review}</td>
                <td>
                  <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GivenRatings;
