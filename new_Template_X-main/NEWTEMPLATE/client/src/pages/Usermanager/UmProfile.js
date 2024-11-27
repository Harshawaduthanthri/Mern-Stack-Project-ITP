import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";

import { useAuth } from "../../context/auth";
import { toast } from 'react-toastify';
import axios from "axios";
import "../../styles/AuthStyles.css";
import { useNavigate } from "react-router-dom";
import UserManagerMenu from "../../components/Layout/UserManagerMenu";
const UmProfile = () => {
  // Context
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("");

  // Effect to fetch user data and update image preview
  useEffect(() => {
    if (auth && auth.user) {
      const { name, email, phone, address, photo } = auth.user;
      setName(name || "");
      setEmail(email || "");
      setPhone(phone || "");
      setAddress(address || "");
      setPhoto(photo || ""); // Assuming photo is returned as base64 string
    }
  }, [auth]);

  // Handle navigation to update user page
  const handleEditClick = () => {
    navigate("/dashboard/usermanager/updateUmprofile");
  };

  // Handle profile deletion
  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your profile?"
    );

    if (confirmation) {
      try {
        const { data } = await axios.delete("/api/v1/auth/delete-profile/:id");

        if (data?.error) {
          toast.error(data?.error);
        } else {
          toast.success("Profile Deleted Successfully");
          // Clear authentication data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setAuth({
            ...auth,
            user: null,
            token: "",
          });
          localStorage.removeItem("auth");
          // Redirect to login page
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserManagerMenu />
          </div>
          <div className="col-md-3">
            <div className="form-container">
              <form style={{ width: "400px" }}>
                <h4 className="title">User Manager Profile</h4>
                <div className="mb-3" align="center">
                  <label>Change Photo:</label>
                  <br />

                  {photo && (
                    <img width={250} height={250} src={photo} alt="User" />
                  )}
                </div>
                <div className="mb-3">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>
                <label>Email:</label>
                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Email"
                    disabled
                  />
                </div>
                <label>Phone:</label>
                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Phone"
                  />
                </div>
                <label>Address:</label>
                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Address"
                  />
                </div>
                <div className="d-flex flex-column align-items-center">
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ width: "360px" }}
                      onClick={handleEditClick}
                    >
                      Edit Details
                    </button>
                  </div>
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ width: "360px" }}
                      onClick={handleDelete}
                    >
                      Delete Profile
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UmProfile;
