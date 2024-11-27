import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Layout from "../../components/Layout/Layout";
import whatsappLogo from './../../components/Layout/whatsap.png'


const EditCard = () => {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [exdate, setExdate] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:3000/cards/${id}`)
      .then((response) => {
        setNumber(response.data.number);
        setName(response.data.name);
        setExdate(response.data.exdate);
        setCvv(response.data.cvv);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Validate card number
    if (!/^\d{16}$/.test(number)) {
      newErrors.number = "Card number must be exactly 16 digits long.";
      isValid = false;
    }

    // Validate name
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      newErrors.name = "Name should contain only letters and spaces.";
      isValid = false;
    }

    // Validate CVV
    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = "CVV must be exactly 3 digits long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleEditCard = (e) => {
    e.preventDefault(); // Prevent form submission
    if (validateForm()) {
      const data = {
        number,
        name,
        exdate,
        cvv,
      };
      axios
        .put(`http://localhost:3000/cards/${id}`, data)
        .then(() => {
          navigate("/cards/CardHome");
        })
        .catch((error) => {
          navigate("/cards/CardHome");
          enqueueSnackbar("Card edited successfully", { variant: "success" });
        });
    } else {
      enqueueSnackbar("Please fix the errors and try again", { variant: "error" });
    }
  };

  return (
    <>
        <div>
      <Layout title={"Create Card"}>
        <div className="page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="ltn__breadcrumb-inner">
                  <h1 className="page-title text-black">Edit A Card</h1>
                  <div className="ltn__breadcrumb-list">
                    <ul>
                      <li>
                        <a href="/" className="text-black">
                          <span className="text-black"><i className="fas fa-home"></i></span> Home   
                        </a>
                      </li>
                      <li>Edit card Page</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ltn__contact-message-area mb-120 mb--400">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="ltn__form-box contact-form-box box-shadow white-bg">
                  <h4 className="title-2">Edit A Card</h4>
                  <form onSubmit={handleEditCard}>
                    <h6>Card Information</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-item input-item-number ltn__custom-icon">
                          <input
                            type="text"
                            placeholder="Enter Card Number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="ds5"
                            maxLength={16} // Limit input to 16 characters
                          />
                          {errors.number && (
                            <div style={{ color: 'red', marginTop: '4px' }}>{errors.number}</div>
                        )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-item input-item-name ltn__custom-icon">
                          <input
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="ds5"
                          />
                          {errors.name && (
                            <div style={{ color: 'red', marginTop: '4px' }}>{errors.name}</div>
                        )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-item input-item-date ltn__custom-icon">
                          <input
                            type="text"
                            placeholder="Expire Date"
                            value={exdate}
                            onChange={(e) => setExdate(e.target.value)}
                            className="ds5"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-item input-item-time ltn__custom-icon">
                          <input
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="ds5"
                            maxLength={3} // Limit input to 3 characters
                          />
                          {errors.cvv && (
                            <div style={{ color: 'red', marginTop: '4px' }}>{errors.cvv}</div>
                        )}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <button className="btn theme-btn-1 btn-effect-1 text-uppercase"  type="submit">
                        Edit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
        <div class="fixed-bottom right-100 p-3" style={{ zIndex: "6", left: "initial" }}> <a href="https://wa.me/94755915168?text= Hello can you assist me ?" target="_blank"> <img src={whatsappLogo} width="60" alt="aaaa" />
</a>
</div>

        </>
  );
};

export default EditCard;
