import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";

import { useAuth } from "../../context/auth";
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";

const Updateadminprofile = () => {
  // Context
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photo, setPhoto] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Function to convert image to base64
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  }

  // Effect to fetch user data
  useEffect(() => {
    if (auth && auth.user) {
      const { name, email, phone, address } = auth.user;
      setName(name || "");
      setEmail(email || "");
      setPhone(phone || "");
      setAddress(address || "");
    }
  }, [auth]);

  // Handle form submission for updating user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch("/api/v1/auth/updateuser", {
        name,
        phone,
        address,
        photo,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
        //navigate("/dashboard/user/profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  // Handle form submission for changing password
  const handleChangePassword = async () => {
    try {
      const response = await axios.patch("/api/v1/auth/changepassword", {
        oldPassword: oldPassword,
        password: newPassword,
      });

      if (response.status === 200) {
        toast.success("Password changed successfully");
        // Clear password fields
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("Something went wrong. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error:", error.message);
      }
    }
  };

  return (
    <Layout title={"Update Profile"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-3">
            <div className="form-container">
              <form onSubmit={handleSubmit} style={{ width: "400px" }}>
                <h4 className="title">Update Admin Profile</h4>
                <div className="mb-3" align="center">
                  <label>Change Photo:</label>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={convertToBase64}
                  />
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
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: "360px" }}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <h2 style={{ marginBottom: "20px" }}>Change Password</h2>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ marginRight: "10px" }}>Old Password:</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ marginRight: "10px" }}>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <button
              onClick={handleChangePassword}
              
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Updateadminprofile;