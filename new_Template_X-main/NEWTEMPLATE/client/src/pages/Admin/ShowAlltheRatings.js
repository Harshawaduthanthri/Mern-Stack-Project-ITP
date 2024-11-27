import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './ShowAlltheRatings.css'; // Import the CSS file

const ShowAlltheRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await axios.get('/api/v1/product/getAllratings');
                setRatings(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };

        fetchRatings();
    }, []);

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
        <div className="ratings-container">
            <h1>User Ratings</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Product Name</th>
                            <th>Product ID</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratings.map((rating) => (
                            <tr key={rating._id}>
                                <td>{rating.user && rating.user.name ? rating.user.name : 'Unknown User'}</td>
                                <td>{rating.product && rating.product.name ? rating.product.name : 'Unknown Product'}</td>
                                <td>{rating.product && rating.product._id ? rating.product._id : 'Unknown ID'}</td>
                                <td>{renderStarRating(rating.rating)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ShowAlltheRatings;
