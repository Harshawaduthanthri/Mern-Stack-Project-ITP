import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubmissionPage.css'; // Import CSS file for styling
import Layout from '../../components/Layout/Layout';
import { Modal, Button, Input, Select } from 'antd';
import Dashboard2 from '../Admin/dashboard2';

const FeedbackDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { TextArea } = Input;
const { Option } = Select;
  const [updatedFormData, setUpdatedFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    serviceType: '',
    ratings: 0,
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8085/api/v1/feedback/get-feedback');
      setFeedbackList(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError('An error occurred while fetching feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (feedbackId) => {
    const feedback = feedbackList.find((feedback) => feedback._id === feedbackId);
    setSelectedFeedback(feedback);
    setUpdatedFormData({ ...feedback });
    setIsModalVisible(true); // Show the modal when editing
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:8085/api/v1/feedback/Updatefeedback/${selectedFeedback._id}`, updatedFormData);

      setFeedbackList((prevFeedbackList) =>
        prevFeedbackList.map((feedback) =>
          feedback._id === selectedFeedback._id ? { ...feedback, ...updatedFormData } : feedback
        )
      );

      setSelectedFeedback(null);
      setUpdatedFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        serviceType: '',
        ratings: 0,
      });
      console.log('Feedback updated successfully');
    } catch (error) {
      console.error('Error updating feedback:', error);
      setError('An error occurred while updating feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    setIsLoading(true);
    setError(null);

    try {
      const confirmed = window.confirm('Are you sure you want to delete this feedback?');

      if (confirmed) {
        await axios.delete(`http://localhost:8085/api/v1/feedback/Deletefeedback/${feedbackId}`);
        setFeedbackList((prevFeedbackList) => prevFeedbackList.filter((feedback) => feedback._id !== feedbackId));
        console.log('Feedback deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setError('An error occurred while deleting feedback');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarRating = (value) => {
    setUpdatedFormData((prevState) => ({
      ...prevState,
      ratings: value,
    }));
  };

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 1:
        return 'Very Bad';
      case 2:
        return 'Unsatisfied';
      case 3:
        return 'Neutral';
      case 4:
        return 'Good';
      case 5:
        return 'Perfect';
      default:
        return 'Unknown';
    }
  };

  return (
    <div>
    <Layout title={"Card Home"}>
    {/* Page Header Start */}
    <div>
      <div className="page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
    
      <div class="container">
          <div class="row">
              <div class="col-lg-12">
                  <div class="ltn__breadcrumb-inner">
                      <h1 class="page-title text-black">Feedbacks</h1>
                      <div class="ltn__breadcrumb-list">
                          <ul>
                              <li><a href="/" class="text-black"><span class="text-black"><i class="fas fa-home"></i></span> Home</a></li>
                              <li>Feedbacks Page</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>
<div>
<div class="ltn__contact-message-area mb-40 mb--500">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ltn__form-box contact-form-box box-shadow white-bg">
                    <div className="p-4">
      <h1>Feedback Submissions</h1>
      {isLoading && <p>Loading feedback...</p>}
      {error && <p className="error-message">{error}</p>}
      {!isLoading && !error && (
        <>
          <div className="table-container">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Service Type</th>
                  <th>Ratings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((feedback, index) => (
                  <tr key={index}>
                    <td>{feedback.name}</td>
                    <td>{feedback.email}</td>
                    <td>{feedback.phone}</td>
                    <td>{feedback.message}</td>
                    <td>{feedback.serviceType}</td>
                    <td>{getRatingLabel(feedback.ratings)}</td>
                    <td>
      <div className="ltn__contact-message-area mb-20 mb--500">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
            <button
              className="btn theme-btn-1 btn-effect-1 text-uppercase"
              onClick={() => handleEdit(feedback._id)}
            >
              Update
            </button>
            <button
              className="btn theme-btn-1 btn-effect-1 text-uppercase" style={{backgroundColor: '#ba2913', color: 'white'}}
              onClick={() => handleDelete(feedback._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedFeedback && (
            


            <div className="edit-feedback-modal">
<Modal
  title="Edit Feedback"
  visible={selectedFeedback !== null}
  onCancel={() => setSelectedFeedback(null)}
  footer={[
    <Button key="cancel" onClick={() => setSelectedFeedback(null)}>
      Cancel
    </Button>,
    <Button key="update" type="primary" onClick={handleUpdate}>
      Update Feedback
    </Button>,
  ]}
>
  <form onSubmit={handleUpdate}>
    <label htmlFor="name">Name:</label>
    <Input
      type="text"
      id="name"
      value={updatedFormData.name}
      onChange={(e) => setUpdatedFormData({ ...updatedFormData, name: e.target.value })}
      required
    />
    <label htmlFor="email">Email:</label>
    <Input
      type="email"
      id="email"
      value={updatedFormData.email}
      onChange={(e) => setUpdatedFormData({ ...updatedFormData, email: e.target.value })}
      required
    />
    <label htmlFor="phone">Phone:</label>
    <Input
      type="tel"
      id="phone"
      value={updatedFormData.phone}
      onChange={(e) => setUpdatedFormData({ ...updatedFormData, phone: e.target.value })}
      required
    />
    <label htmlFor="message">Message:</label>
    <TextArea
      id="message"
      value={updatedFormData.message}
      onChange={(e) => setUpdatedFormData({ ...updatedFormData, message: e.target.value })}
      required
    />
    <label htmlFor="serviceType">Service Type:</label>
    <Select
      id="serviceType"
      value={updatedFormData.serviceType}
      onChange={(value) => setUpdatedFormData({ ...updatedFormData, serviceType: value })}
      required
    >
      <Option value="">Select service type</Option>
      <Option value="Good">Good</Option>
      <Option value="Bad">Bad</Option>
      <Option value="Neutral">Neutral</Option>
    </Select>

    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          className={`star ${value <= updatedFormData.ratings ? 'selected' : ''}`}
          onClick={() => handleStarRating(value)}
        >
          ⭐️
        </button>
      ))}
    </div>
  </form>
</Modal>

            </div>
          )}
        </>
      )}
    </div>
    <div className="col-md-12 animate__animated animate__fadeInUp">
                <div className="card mb-4 border border-primary rounded animate__animated animate__fadeInUp" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <Dashboard2/>
                  </div>
                </div>
      </div>
</div>
</div>
</div>
</div>
</div>
</div>
  
</Layout>  
  </div>
  );
};

export default FeedbackDashboard;
