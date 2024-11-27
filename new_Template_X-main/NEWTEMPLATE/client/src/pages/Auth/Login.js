import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuth } from "../../context/auth";
import { CiLogin } from "react-icons/ci";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8085/api/v1/auth/login", {
        email,
        password,
      });

      console.log(res.data); // Log the response data

      if (res && res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        if (res.data.message === "Invalid Password") {
          setErrorMessage("Invalid password. Please try again.");
        } else {
          setErrorMessage(res.data.message);
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Handle case when user account is inactive
        toast.error("Your account is deactivated. Please contact us to reactivate.");
      } else {
        // Handle other errors
        console.error("Login error:", error);
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Layout title="Login">
{/* LOGIN AREA START */}
<div className="ltn__login-area pb-65">
  <div className="container">
    <div className="row">
      <div className="col-lg-12">
        <div className="section-title-area text-center">
          <h1 className="section-title">Sign In <br />To  Your Account</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br />
            Sit aliquid,  Non distinctio vel iste.</p>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-lg-6">
        <div className="account-login-inner">
          <form onSubmit={handleSubmit} className="ltn__form-box contact-form-box">
            <input type="text" name="email" placeholder="Email*" value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="exampleInputEmail1" /> 
            <input type="password" name="password" placeholder="Password*" value={password} onChange={(e) => setPassword(e.target.value)}id="exampleInputPassword1" required/>
            <div className="btn-wrapper mt-0">
              <button className="theme-btn-1 btn btn-block" type="submit">SIGN IN</button>
            </div>
            <div className="go-to-btn mt-20">
              <a href="/forgotpassword"><small>FORGOTTEN YOUR PASSWORD?</small></a>
            </div>
          </form>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="account-create text-center pt-50">
          <h4><a href="/login">DON'T HAVE AN ACCOUNT?</a></h4>
          <p>Add items to your wishlistget personalised recommendations <br />
            check out more quickly track your orders register</p>
          <div className="btn-wrapper">
            <a href="/register" className="theme-btn-1 btn black-btn">CREATE ACCOUNT</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* LOGIN AREA END */}

    </Layout>
  );
};

export default Login;
