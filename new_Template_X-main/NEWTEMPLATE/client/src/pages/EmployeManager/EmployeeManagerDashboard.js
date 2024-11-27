import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { toast } from 'react-toastify';
import EmployeeManagerMenu from "../../components/Layout/EmployeeMangerMenu.js";
import { useAuth } from "../../context/auth";

const EmployeeManagerDashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profession, setProfession] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    } else {
      setPasswordError("");
    }
  
    if (!isValidPhoneNumber(phone)) {
      setPhoneError("Phone number must be a maximum of 10 digits and contain only numbers.");
      return;
    } else {
      setPhoneError("");
    }
  
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid Gmail address.");
      return;
    } else {
      setEmailError("");
    }
  
    try {
      const res = await axios.post("/api/v1/auth/e-register", {
        name,
        email,
        password,
        phone,
        address,
        profession,
      });
  
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  
  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{1,10}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  const isValidEmail = (email) => {
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail.com$/;
    return gmailPattern.test(email);
  };

  const [passwordError, setPasswordError] = useState("");


  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <EmployeeManagerMenu />
          </div>
          <div className="col-md-9">
            <div className="container mt-3">
              <h1 className="text-center mb-4">Employee Manager Dashboard</h1>
              <div className="row justify-content-center">
                <div className="col-md-6">
                <form onSubmit={handleSubmit}>
  <div className="mb-3">
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="form-control"
      placeholder="Enter Employee Name"
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="form-control"
      placeholder="Enter Employee Email"
      pattern="[a-zA-Z0-9._%+-]+@gmail.com"
      required
    />
    {emailError && <p className="text-danger">{emailError}</p>}
  </div>
  <div className="mb-3">
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="form-control"
      placeholder="Enter Employee Password"
      required
    />
  </div>
  <div className="mb-3">
    <input
      type="text"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="form-control"
      placeholder="Enter Employee Phone"
      pattern="\d{10}"
      required
    />
    {phoneError && <p className="text-danger">{phoneError}</p>}
  </div>
  <div className="mb-3">
    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      className="form-control"
      placeholder="Enter Employee Address"
      required
    />
  </div>
  <div className="mb-3">
    <select
      value={profession}
      onChange={(e) => setProfession(e.target.value)}
      className="form-select"
      required
    >
      <option value="" disabled>Select Employee's Profession</option>
      <option value="hardware">Hardware</option>
      <option value="software">Software</option>
    </select>
  </div>
  <button className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit">
    Register Employee
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

export default EmployeeManagerDashboard;