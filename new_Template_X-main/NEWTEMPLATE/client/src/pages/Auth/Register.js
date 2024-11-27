import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Phone number validation
    if (phone.length !== 10) {
      toast.error("Phone number must be 10 characters");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await axios.post("/api/v1/auth/register", {
        name,
        email,
        password,
        phone,
        address,
      });

      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDummyValues = () => {
    setName("Harsha");
    setEmail("harshawaduthanthri@gmail.com");
    setPassword("123456");
    setPhone("1234567890");
    setAddress("Kiribathkumbura");
  };

  return (
    <Layout title="Register ">
      <div>
        <div className="ltn__login-area pb-110">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="section-title-area text-center">
                  <h1 className="section-title">Register <br />Your Account</h1>
                  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br />
                    Sit aliquid, Non distinctio vel iste.</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 offset-lg-3">
                <div className="account-login-inner">
                  <form onSubmit={handleSubmit} className="ltn__form-box contact-form-box">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Name"
                      required
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Email"
                      required
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Password"
                      required
                    />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      placeholder="Enter Your Address"
                      required
                    />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => {
                        const inputPhone = e.target.value;
                        if (inputPhone.length <= 10) {
                          setPhone(inputPhone);
                        }
                      }}
                      className="form-control"
                      placeholder="Enter Your Phone"
                      maxLength={10}
                      required
                    />
                    <div className="btn-wrapper">
                      <button className="theme-btn-1 btn reverse-color btn-block" type="submit">CREATE ACCOUNT</button>
                    </div>
                  </form>
                  <div className="by-agree text-center">
                    <p>By creating an account, you agree to our:</p>
                    <p><a href="#">TERMS OF CONDITIONS &nbsp; &nbsp; | &nbsp; &nbsp; PRIVACY POLICY</a></p>
                    <div className="go-to-btn mt-50">
                      <a href="/login">ALREADY HAVE AN ACCOUNT ?</a>
                    </div>
                  </div>
                  <div className="text-center mt-3">
                    <button className="theme-btn-2 btn reverse-color" onClick={handleDummyValues}>Use Dummy Values</button>
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

export default Register;
