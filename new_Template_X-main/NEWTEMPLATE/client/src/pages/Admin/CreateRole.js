import React, { useState } from 'react';
import axios from 'axios';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';

const CreateRole = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    answer: '',
    role: 0, // Default role is 0 (for regular users)
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Send registration data to the server
        const response = await axios.post('/api/v1/auth/register', formData);
        console.log(response.data);
        window.alert('Role created successfully!');
        // Optionally, you can handle success or redirect the user to another page
      } catch (error) {
        console.error('Error registering user:', error);
        // Handle error display or logging
      }
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      errors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character';
    }
    if (!isValidAddress(formData.address)) {
      errors.address = 'Address should be longer than 7 characters and include the home number';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhoneNumber(formData.phone)) {
      errors.phone = 'Phone number should be either 10 characters or 12 characters long';
    }
    // Add validation for other fields as needed

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidEmail = (email) => {
    // Email validation logic (e.g., regex or other checks)
    return true; // Placeholder return
  };

  const isValidPassword = (password) => {
    // Password validation logic (e.g., regex or other checks)
    return true; // Placeholder return
  };

  const isValidAddress = (address) => {
    // Address validation logic (e.g., length check, home number presence)
    return address.trim().length > 7 && /\d+/.test(address);
  };

  const isValidPhoneNumber = (phone) => {
    // Phone number validation logic (e.g., length check, format)
    return phone.trim().length === 10 || phone.trim().length === 12;
  };

  return (
    <Layout title={'Create New Role'}>
      <div className="container-fluid p-3 m-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="username">UserName</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputEmail4">Email</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputPassword4">Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">{formErrors.password}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">Address</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                      name="address"
                      placeholder="1234 Main St"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.address && (
                      <div className="invalid-feedback">{formErrors.address}</div>
                    )}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">Phone No:</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                      name="phone"
                      placeholder="+94XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="inputAddress">companyID-No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="answer"
                      placeholder="GLT111222"
                      value={formData.answer}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="roleSelect">Select Role:</label>
                  <select
                    name="role"
                    id="roleSelect"
                    value={formData.role}
                    onChange={handleChange}
                    className={`form-control ${formErrors.role ? 'is-invalid' : ''}`}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Employee Manager</option>
                  </select>
                  {formErrors.role && <div className="invalid-feedback">{formErrors.role}</div>}
                </div>

                <button type="submit" className="btn btn-primary">
                  Create role
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRole;
