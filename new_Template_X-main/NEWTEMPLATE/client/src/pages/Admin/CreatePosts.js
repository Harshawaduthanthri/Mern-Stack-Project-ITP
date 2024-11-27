import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from "./../../components/Layout/Layout";

const CreatePosts = ({ fetchPosts }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const categoryOptions = ["Hardware", "Software", "New Release", "Latest tech", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/post/create-post", {
        topic,
        description,
        category,
      });

      if (data?.success) {
        console.log(`${topic} is created`);
        fetchPosts();
        setTopic('');
        setDescription('');
        setCategory('');

        // Display success toast message
        toast.success('Post submitted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Navigate to All Posts after successful submission
        navigate('/get-posts');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Posts</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="topic" className="form-label">Topic</label>
                <input type="text" id="topic" className="form-control" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" className="form-control" rows="5" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select id="category" className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select category</option>
                  {categoryOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn theme-btn-1 btn-effect-1 text-uppercase">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePosts;
