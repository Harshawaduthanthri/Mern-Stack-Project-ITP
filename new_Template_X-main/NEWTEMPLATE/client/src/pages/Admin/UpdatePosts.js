import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from './../../components/Layout/Layout';

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/v1/post/get-posts/${id}`);
        const { topic, description, category } = data.data;
        setTopic(topic);
        setDescription(description);
        setCategory(category);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/post/update-posts/${id}`, {
        topic,
        description,
        category,
      });

      if (data?.success) {
        toast.success('Post updated successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });
        navigate('/get-posts');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Layout title={"Dashboard - Update Post"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Post</h1>
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
                <input type="text" id="category" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <button type="submit" className="btn theme-btn-1 btn-effect-1 text-uppercase">Update</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdatePost;
