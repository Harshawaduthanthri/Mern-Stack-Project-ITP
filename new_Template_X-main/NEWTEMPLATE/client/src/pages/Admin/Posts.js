import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from './../../components/Layout/Layout';
import PostLikesBarChart from './PostLikesBarChart.js';
import PostCategoryPieChart from './PostCategoryPieChart.js';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const getAllPosts = async () => {
    try {
      const response = await axios.get("/api/v1/post/get-posts");
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const getBackgroundImage = (category) => {
    if (category.toLowerCase() === 'graphic card') {
      return '/images/header.jpg';
    } else {
      return '/images/background.jpg';
    }
  };

  const handleEdit = (postId) => {
    navigate(`/dashboard/admin/update-posts/${postId}`);
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/v1/post/delete-posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
  <div className="container-fluid m-3 p-3">
    <div className="row">
      <div className="col-md-3">
        <AdminMenu />
      </div>
      <div className="col-md-9">
        <h1 className="text-center">All Posts</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by topic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="row">
  <div className="col-md-6">
    <div className="card mb-4 border border-primary rounded animate_animated animate_fadeIn" style={{ backgroundColor: "#e8f5fe" }}>
      <div className="card-body">
        <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Likes Count for Top 5 Posts</h3>
        <div className="col-md-12" style={{ height: "400px" }}> {/* Adjust the height as needed */}
          <PostLikesBarChart />
        </div>
      </div>
    </div>
  </div>
  <div className="col-md-6">
    <div className="card mb-4 border border-primary rounded animate_animated animate_fadeIn" style={{ backgroundColor: "#e8f5fe" }}>
      <div className="card-body">
        <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Category Distribution</h3>
        <div className="col-md-12" style={{ height: "400px" }}> {/* Adjust the height as needed */}
          <PostCategoryPieChart />
        </div>
      </div>
    </div>
  </div>
</div>
        <div className="d-flex flex-wrap">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="row">
              {filteredPosts.map((post) => (
                <div key={post._id} className="col-md-4 mb-4">
                  <div className="card text-white bg-light mb-3">
                    <img
                      src={getBackgroundImage(post.category)}
                      className="card-img"
                      alt="background"
                    />
                    <div className="card-img-overlay d-flex flex-column">
                      <h4 className="card-title" style={{ color: "red" , fontWeight: "bold"}}>{post.topic}</h4>
                      {/*<p className="card-text">{post.description}</p>*/}
                      <p className="card-title" style={{ color: "black", fontWeight: "bold" }}>
  Category: {post.category}
</p>

                      <div className="mt-auto">
                        <button
                          className="btn theme-btn-1 btn-effect-1 text-uppercase"
                          onClick={() => handleEdit(post.slug)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn theme-btn-1 btn-effect-1 text-uppercase"
                          type="submit"
                          style={{ backgroundColor: '#ba2913', color: 'white' }}
                          onClick={() => handleDelete(post._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</Layout>
  );
};

export default Posts;
