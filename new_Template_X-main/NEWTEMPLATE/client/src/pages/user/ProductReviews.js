import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProductReviews.css'; // Import the CSS file for styling

const ProductReviews = () => {
  const [productRatings, setProductRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract productId from the URL using useParams
  const { productId } = useParams();

  useEffect(() => {
    const fetchProductRatings = async () => {
      try {
        const response = await axios.get(`/api/v1/product/getAllratings/product/${productId}`);
        setProductRatings(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product ratings:', error);
        setError('Failed to fetch product ratings');
        setLoading(false);
      }
    };

    fetchProductRatings();
  }, [productId]);

  // Helper function to render star ratings based on the rating value
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? 'selected' : ''}`}>
          ⭐️
        </span>
      );
    }
    return stars;
  };

  return (
    <div>
      <h1>Product Review Page</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {productRatings.map((rating) => (
            <li key={rating._id}>
              <strong>User:</strong> {rating.user && rating.user.name ? rating.user.name : 'Unknown User'}
              <br />
              <strong>Rating:</strong> {renderStarRating(rating.rating)} {/* Render star ratings */}
              <br />
              <strong>Review:</strong> {rating.review}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductReviews;
