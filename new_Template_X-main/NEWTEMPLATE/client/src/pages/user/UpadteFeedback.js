import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router

function UpdateFeedback() {
  const { id } = useParams(); // Extract the feedback ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    serviceType: ''
  });

  useEffect(() => {
    // Fetch the existing feedback data using the feedback ID
    fetch(`/Onefeedback/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Assuming you're using JWT for authentication
      }
    })
    .then(response => response.json())
    .then(data => {
      // Update the formData state with the fetched feedback data
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        serviceType: data.serviceType
      });
    })
    .catch(error => console.error('Error fetching feedback:', error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/Updatefeedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Assuming you're using JWT for authentication
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Feedback updated successfully!');
        // Redirect user to another page or perform any other action as needed
      } else {
        throw new Error('Failed to update feedback');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      alert('An error occurred while updating feedback');
    }
  };

  return (
    <div>
      <h1>Update Feedback</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label><br />
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /><br />

        <label htmlFor="email">Email:</label><br />
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /><br />

        <label htmlFor="phone">Phone:</label><br />
        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} required /><br />

        <label htmlFor="message">Message:</label><br />
        <textarea id="message" name="message" rows="4" cols="50" value={formData.message} onChange={handleChange} required /><br />

        <label htmlFor="serviceType">Service Type:</label><br />
        <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} required>
          <option value="good">Good</option>
          <option value="bad">Bad</option>
          <option value="neutral">Neutral</option>
        </select><br />

        <button type="submit">Update Feedback</button>
      </form>
    </div>
  );
}

export default UpdateFeedback;
