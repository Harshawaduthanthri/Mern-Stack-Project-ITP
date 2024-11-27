import React, { useState } from 'react';
import axios from 'axios';
import toast from "react-hot-toast";
import Layout from "./../../components/Layout/Layout";
import email from '../../styles/siteCss/img/icons/10.png'
import address from '../../styles/siteCss/img/icons/12.png'
import Number from '../../styles/siteCss/img/icons/11.png'
import '../../styles/bookingCss/css/style.css';
import '../../styles/siteCss/css/style.css'
import MapContainer from './googlemap';


const BookingPage = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    description: '',
    type: 'Morning',
    specialization: 'Hardware Service',
    address: '',
    date: '',
    phoneNumber: '',
  });
  const [notifications, setNotifications] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for phone number (allow only numbers)
    if (name === 'phoneNumber' && !(/^\d+$/.test(value))) {
      toast.error('Phone number must contain only numbers!');
      return;
    }

    // Validation for first name and last name
    if ((name === 'firstname' || name === 'lastname') && !(/^[a-zA-Z]+$/.test(value))) {
      toast.error(`${name === 'firstname' ? 'First' : 'Last'} name must contain only letters!`);
      return;
    }

    // If validation passes, update the state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const addNotification = (notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = '/api/v1/appointment/create-appointment';
      const response = await axios.post(apiUrl, formData);

      console.log('Form Data submitted successfully!', response.data);
      addNotification({
        id: response.data.id, // Use a unique ID for each notification
        message: `New appointment booked: User - ${formData.firstname} ${formData.lastname}`,
        timestamp: new Date(),
      });

      // Add any further logic after a successful form submission
    } catch (error) {
      console.error('Error submitting form data:', error.message);
      // Handle the error appropriately, such as displaying an error message to the user
    }
  };
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
   
    <div>
      <Layout title={"Dashboard - Booking"}>
      {/* Page Header Start */}
      <div>
        <div className="page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
      
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ltn__breadcrumb-inner">
                        <h1 class="page-title text-black">Service Appointment</h1>
                        <div class="ltn__breadcrumb-list">
                            <ul>
                                <li><a href="/" class="text-black"><span class="text-black"><i class="fas fa-home"></i></span> Home</a></li>
                                <li>Booking Page</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  <div className="ltn__contact-address-area mb-90">
    <div className="container">
      <div className="row">
        <div className="col-lg-4">
          <div className="ltn_contact-address-item ltn_contact-address-item-3 box-shadow">
            <div className="ltn__contact-address-icon">
              <img src={email} />
            </div>
            <h3>Email Address</h3>
            <p>info@webmail.com <br />
              jobs@webexample.com</p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="ltn_contact-address-item ltn_contact-address-item-3 box-shadow">
            <div className="ltn__contact-address-icon">
              <img src={Number} alt="Icon Image" />
            </div>
            <h3>Phone Number</h3>
            <p>+0123-456789 <br /> +987-6543210</p>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="ltn_contact-address-item ltn_contact-address-item-3 box-shadow">
            <div className="ltn__contact-address-icon">
              <img src={address} alt="Icon Image" />
            </div>
            <h3>Office Address</h3>
            <p>18/A, New Born Town Hall <br />
              New York, US</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* CONTACT ADDRESS AREA END */}
  {/* CONTACT MESSAGE AREA START */}
  <div class="ltn__contact-message-area mb-120 mb--100">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ltn__form-box contact-form-box box-shadow white-bg">
                        <h4 class="title-2">Get A Appointment</h4>
              <form onSubmit={handleSubmit}>
                <h6>Personal Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input type="text"  placeholder="First name" name="firstname" value={formData.firstname} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item input-item-name ltn__custom-icon">
                      <input type="text" placeholder="Last name" name="lastname" value={formData.lastname} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-item input-item-phone ltn__custom-icon">
                      <input type="text" placeholder="phone number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <h6>Specialization</h6>
                    <div className="input-item">
                    <select class="nice-select" name="specialization" value={formData.specialization} onChange={handleChange}>
                        <option value="Hardware Service">Hardware Service</option>
                        <option value="Software Service">Software Service</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                  <div className="font-color1">Date</div>
                  <div className="input-item">
                  
                    <input 
                      type="date"  
                      name='date' 
                      className="form-control border-2" 
                      value={formData.date}
                      onChange={handleChange}
                      min={getCurrentDate()}
                      required
                      style={{ position: 'relative', zIndex: '0' }} 
                    />
                  </div>
                  </div>

                  <div className="col-lg-12 col-md-12">
                    <h6>Time</h6>
                    <div className="input-item">
                    <select class="nice-select" name="type" value={formData.type} onChange={handleChange}>
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <h6>Address</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-item">
                          <input type="text" placeholder="House number and street name" name="address" value={formData.address} onChange={handleChange} required />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h6>Problem</h6>
                <div className="input-item input-item-textarea ltn__custom-icon">
                  <textarea name="description" placeholder="Describe Your Problem." value={formData.description} onChange={handleChange} />
                </div>
                <div className="col-lg-6">
        <button className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit">Book Appointment</button>
        
        <a  href='/' className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit" style={{backgroundColor: '#ba2913', color: 'white'}}>Cancel</a>
    


      </div>
              </form>
             
              </div>
                </div>
            </div>
        </div>
    </div>


  {/* GOOGLE MAP AREA START */}
  <div className="">
      <MapContainer/>
    <iframe width="100%" height="100%" frameBorder={0} allowFullScreen aria-hidden="false" tabIndex={0} ></iframe></div>
  </div>
  {/* GOOGLE MAP AREA END */}

  </Layout>  
    </div>
  
  );
};

export default BookingPage;