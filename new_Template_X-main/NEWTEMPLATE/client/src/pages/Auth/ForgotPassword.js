import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
//import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  //const navigate = useNavigate();

  // from function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgotpassword", {
        email,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);

      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error("Something went wrong");
    }
  };
  return (
    <Layout title={"Forgot Password "}>
      <div>
  {/* BREADCRUMB AREA START */}
  <div className="ltn__breadcrumb-area text-left bg-overlay-white-30 bg-image " data-bs-bg="img/bg/14.jpg">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="ltn__breadcrumb-inner">
            <h1 className="page-title">Account</h1>
            <div className="ltn__breadcrumb-list">
              <ul>
                <li><a href="index.html"><span className="ltn__secondary-color"><i className="fas fa-home" /></span> Home</a></li>
                <li>Register</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* BREADCRUMB AREA END */}
  {/* LOGIN AREA START (Register) */}
  <div className="ltn__login-area pb-110">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title-area text-center">
            <h1 className="section-title">Reset <br />Your Passwod</h1>
            <p>Enter the valid email address for reset your password via email</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 offset-lg-3">
          <div className="account-login-inner">
            <form  onSubmit={handleSubmit} className="ltn__form-box contact-form-box">
              
              <input type="email"  value={email}
              onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter Your Email "
                  required />
             

          
                  

                            <div class="btn-wrapper">
                                <button class="theme-btn-1 btn reverse-color btn-block" type="submit">Get Reset Email</button>
                            </div>
                        </form>
                        <div class="by-agree text-center">
                            <p>By creating an account, you agree to our:</p>
                            <p><a href="#">TERMS OF CONDITIONS  &nbsp; &nbsp; | &nbsp; &nbsp;  PRIVACY POLICY</a></p>
                            <div class="go-to-btn mt-50">
                                <a href="login.html">ALREADY HAVE AN ACCOUNT ?</a>
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

export default ForgotPassword;