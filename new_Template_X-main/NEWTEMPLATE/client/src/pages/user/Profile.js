import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import blog1 from "../../styles/bookingCss/img/header-page1.jpg";

import { useNavigate } from "react-router-dom";

const Profile = () => {
  // Context
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  // State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [photo, setPhoto] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Effect to fetch user data and update image preview
  useEffect(() => {
    if (auth && auth.user) {
      if (auth.user.name) {
        setName(auth.user.name);
      }
      if (auth.user.email) {
        setEmail(auth.user.email);
      }
      if (auth.user.phone) {
        setPhone(auth.user.phone);
      }
      if (auth.user.address) {
        setAddress(auth.user.address);
      }
      if (auth.user.photo instanceof Blob) {
        setProfileImage(URL.createObjectURL(auth.user.photo)); // Update profile image
        setImagePreview(auth.user.photo); // Update image preview
      } else if (auth.user.photo) {
        setProfileImage(auth.user.photo); // Update profile image
        setImagePreview(auth.user.photo); // Update image preview
      }
    }
  }, [auth]);

  // Handle navigation to update user page
  const handleEditClick = () => {
    navigate("/dashboard/user/updateuser");
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
        <div className="row justify-content-center">
          {" "}
          {/* Centering the row */}
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            {" "}
            {/* New column for profile details */}
            <div className="ltn__team-details-area mb-120">
              <div className="ltn__form-box contact-form-box box-shadow white-bg">
                <div className="container">
                  <div className="row justify-content-center">
                    {" "}
                    {/* Centering the profile details */}
                    <div className="col-lg-4">
                      <div className="ltn__team-details-member-info text-center mb-40">
                        <div className="team-details-img">
                          {imagePreview && (
                            <img
                              src={imagePreview}
                              alt="Preview"
                              style={{ maxWidth: "200px", marginTop: "10px" }}
                            />
                          )}
                        </div>
                        <h2>{name}</h2>
                        <h6 className="text-uppercase ltn__secondary-color">
                          {email}
                        </h6>
                        <div className="ltn__social-media-3">
                          <ul>
                            <li>
                              <a href="#" title="Facebook">
                                <i className="fab fa-facebook-f" />
                              </a>
                            </li>
                            <li>
                              <a href="#" title="Twitter">
                                <i className="fab fa-twitter" />
                              </a>
                            </li>
                            <li>
                              <a href="#" title="Linkedin">
                                <i className="fab fa-linkedin" />
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="ltn__team-details-member-info-details">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="ltn__team-details-member-about">
                              <ul>
                                <li>
                                  <strong>Name:</strong> {name}
                                </li>
                                <li>
                                  <strong>Email:</strong> {email}
                                </li>
                                <li>
                                  <strong>Address:</strong> {address}
                                </li>
                                <li>
                                  <strong>Phone:</strong> +{phone}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="btn-wrapper">
                        <button
                          onClick={handleEditClick}
                          className="btn btn-transparent btn-border btn-effect-3"
                        >
                          <i className="fas fa-edit"></i>Edit Details
                        </button>
                        <button
                          onClick={handleDelete}
                          className="btn btn-transparent btn-border btn-effect-3"
                        >
                          <i className="fas fa-trash"></i>Delete Profile
                        </button>
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
  );
};

export default Profile;
