import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import Layout from '../../components/Layout/Layout';
import '../../styles/Feedback.css';

const Feedback = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    serviceType: 'good',
    ratings: 0
  });

  useEffect(() => {
    if (auth?.user) {
      const { email, name, phone, address } = auth.user;
      setFormData({
        ...formData,
        name: name || '',
        email: email || '',
        phone: phone || '',
        address: address || '',
      });
    }
  }, [auth?.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRatingChange = (e) => {
    const value = parseInt(e.target.id.replace('rate', ''), 10);
    setFormData(prevState => ({
      ...prevState,
      ratings: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/v1/feedback/create-feedback', formData);
      console.log(response.data.data); // Assuming your backend returns feedback data
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        serviceType: 'good',
        ratings: 0
      });
      alert('Feedback submitted successfully!');
      navigate('/dashboard/user/feedbackdashboard'); 
      window.location.reload();
      navigate('/')
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div>
      <Layout title={"FeedBack"}>
        <div className="page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="ltn__breadcrumb-inner">
                  <h1 className="page-title text-black">Feedback</h1>
                  <div className="ltn__breadcrumb-list">
                    <ul>
                      <li>
                        <a href="/" className="text-black">
                          <span className="text-black">
                            <i className="fas fa-home"></i>
                          </span> Home
                        </a>
                      </li>
                      <li>Feedback Page</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ltn__contact-message-area mb-120 mb--400">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="ltn__form-box contact-form-box box-shadow white-bg">
                  <h4 className="title-2">Add Feedback</h4>
                  <form onSubmit={handleSubmit}>
                    <h6>Feedback Information</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-item input-item-number ltn__custom-icon">
                          <input
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-item input-item-name ltn__custom-icon">
                          <input
                            type="text"
                            placeholder="Enter Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-item input-item-date ltn__custom-icon">
                          <input
                            type="text"
                            placeholder="Enter Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <h6>Service Type</h6>
                      <div className="input-item">
                        <select
                          className="nice-select"
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                        >
                          <option value="good">good</option>
                          <option value="bad">bad</option>
                          <option value="neutral">neutral</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <h6>Star Rating</h6>
                      <fieldset class="rating-container" onChange={handleRatingChange}>
                        {[5, 4, 3, 2, 1].map((starValue) => (
                          <React.Fragment key={starValue}>
                            <input type="radio" name="rating" id={`rate${starValue}`} />
                            <label htmlFor={`rate${starValue}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1122 1122">
                                <defs>
                                 
                                </defs>
                                <path class="cls-2" d="m570.497,252.536l93.771,190c1.543,3.126,4.525,5.292,7.974,5.794l209.678,30.468c8.687,1.262,12.156,11.938,5.87,18.065l-151.724,147.895c-2.496,2.433-3.635,5.939-3.046,9.374l35.817,208.831c1.484,8.652-7.597,15.25-15.367,11.165l-187.542-98.596c-3.085-1.622-6.771-1.622-9.857,0l-187.542,98.596c-7.77,4.085-16.851-2.513-15.367-11.165l35.817-208.831c.589-3.436-.55-6.941-3.046-9.374l-151.724-147.895c-6.286-6.127-2.817-16.803,5.87-18.065l209.678-30.468c3.45-.501,6.432-2.668,7.974-5.794l93.771-190c3.885-7.872,15.11-7.872,18.995,0Z"/>
                                <path class="cls-1" d="m561,296.423l-83.563,161.857c-4.383,8.49-12.797,14.155-22.312,15.024l-181.433,16.562,191.688,8.964c12.175.569,23.317-6.81,27.543-18.243l68.077-184.164Z"/>
                                <path class="cls-3" d="m357.284,838.933l-4.121,24.03c-1.484,8.652,7.597,15.25,15.367,11.165l187.541-98.596c3.086-1.622,6.771-1.622,9.857,0l187.541,98.596c7.77,4.085,16.851-2.513,15.367-11.165l-35.817-208.831c-.589-3.435.55-6.941,3.046-9.374l151.724-147.894c6.287-6.127,2.818-16.802-5.87-18.065l-70.23-10.205c-113.59,203.853-287.527,311.181-454.405,370.34Z"/>
                              </svg>
                            </label>
                          </React.Fragment>
                        ))}
                        <div class="rating-value"></div>
                      </fieldset>
                    </div>

                    <div className="col-lg-12 col-md-12">
                      <h6>Message</h6>
                      <div className="input-item input-item-textarea ltn__custom-icon">
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <button className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Feedback;
