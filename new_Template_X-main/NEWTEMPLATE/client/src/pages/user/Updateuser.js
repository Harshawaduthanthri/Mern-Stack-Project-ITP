import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Updateuser = () => {
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
        navigate("/dashboard/user/profile");
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
            <UserMenu />
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-lg-6">
                <div className="ltn__form-box contact-form-box box-shadow white-bg">
                  <h4 className="title-2">Update Profile</h4>
                  <form onSubmit={handleSubmit}>
                    <h6>Personal Information</h6>
                    <div className="form-group">
                    <h5 className="title">Change photo:</h5> <input
                        accept="image/*"
                        type="file"
                        onChange={convertToBase64}
                        className="form-control-file"
                      />
                      {photo && (
                        <img
                          width={250}
                          height={250}
                          src={photo}
                          alt="User"
                        />
                      )}
                     
                    </div>
                    <div className="form-group">
                    <h5 className="title">Name</h5>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                    <h5 className="title">Email</h5>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="form-group">
                    <h5 className="title">Phone Number</h5>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-control"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div className="form-group">
                    <h5 className="title">Address:</h5>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-control"
                        placeholder="Enter your address"
                        required
                      />
                    </div>
                    <button
                      className="btn theme-btn-1 btn-effect-1 text-uppercase"
                      type="submit"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="ltn__form-box contact-form-box box-shadow white-bg">
                  <h4 className="title-2">Change Password</h4>
                  <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <h4 className="title">Old Password</h4>
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
                    <div className="form-group">
                      <h4 className="title">New Password</h4>
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
                      className="btn theme-btn-1 btn-effect-1 text-uppercase"
                      type="submit"
                    >
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Updateuser;
