import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';


const ResetPassword = () => {
  const [password, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { resetToken } = useParams(); // Assuming you're using React Router to get the resetToken from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Reset token:", resetToken); // Add this line for debugging
      // Check if resetToken exists
      if (!resetToken) {
        // Handle the case where resetToken is not available
        toast.error("Reset token is missing");
        return;
      }

      // Use the retrieved resetToken in the API request
     
      const response = await axios.put(
        `/api/v1/auth/resetpassword/${resetToken}`,
        { password: password }
      );

      if (response.status === 200) {
        // Password reset successfully
        toast.success(response.data.message);
        navigate("/login"); // Redirect to login page after password reset
      } else {
        // Password reset failed
        toast.error(response.data.message);
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error("Error resetting password:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Reset Password - Computer Hardware"}>
      <div className="ltn__login-area pb-65">
  <div className="container">
    <div className="row">
      <div className="col-lg-12">
        <div className="section-title-area text-center">
          <h1 className="section-title">Rest <br />  Your Password</h1>
          <p>Reset your password.</p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-6">
        <div className="account-login-inner">
          <form onSubmit={handleSubmit} className="ltn__form-box contact-form-box">
            
            <input type="password" name="password" placeholder="Password*"  value={password}
             onChange={(e) => setNewPassword(e.target.value)} id="exampleInputPassword1" required/>
            <div className="btn-wrapper mt-0">
              <button className="theme-btn-1 btn btn-block" type="submit">Reset Password</button>
            </div>
            
          </form>
        </div>
      </div>
      </div>
    </div>
  </div>

    </Layout>
  );
};

export default ResetPassword;
