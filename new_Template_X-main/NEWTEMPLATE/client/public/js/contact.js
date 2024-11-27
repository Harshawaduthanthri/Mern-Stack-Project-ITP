import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
import axios from 'axios';
import { useAuth } from "../../src/context/auth";
import "../../src/styles/contactUsStyles.css";
import "../../src/styles/contactStyles.css";

const ContactUs = () => {
  const [auth, setAuth] = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    queryType: 'product',
    message: ''
  });

  useEffect(() => {
    if (auth?.user) {
      const { email, name } = auth.user;
      setFormData(prevState => ({
        ...prevState,
        name: name || '',
        email: email || ''
      }));
    }
  }, [auth?.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8085/api/v1/getcontact/contact', formData);
      console.log(response.data); // Assuming your backend returns data
      setFormData({
        name: '',
        email: '',
        queryType: 'product',
        message: ''
      });
      alert('Query submitted successfully!');
      // You may choose to handle the success response as needed
    } catch (error) {
      console.error('Error submitting query:', error);
      alert('Failed to submit query. Please try again.');
    }
  };

  return (
    <div className="contact-form-container">
      <h2>CONTACT US</h2>
      <p>Got a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      <form onSubmit={handleSubmit}>
        <div className="username">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        </div>
        <div className="email">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" />
        </div>
        <div className="service-type">
          <label>Query Type:</label>
          <select name="queryType" value={formData.queryType} onChange={handleChange}>
            <option value="product">Product</option>
            <option value="service">Service</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="textarea">
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..."></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

const Contact = () => {
  // Use the useNavigate hook to get the navigation function
  const navigate = useNavigate();

  // Handle button click
  const handleButtonClick = () => {
    // Navigate to the ContactUs form page
    navigate('/contactUs');
  };

  return (
    <Layout title={"Contact us"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <ContactUs />
        </div>
      </div>
    </Layout>
  );
};

export default Contact;