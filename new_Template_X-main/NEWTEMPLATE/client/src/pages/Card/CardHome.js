import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import Card from "../../components/Cd/Card";
import CardTable from "../../components/Cd/CardTable";
import "./Card.css";
import Layout from "./../../components/Layout/Layout";
import whatsappLogo from './../../components/Layout/whatsap.png'

const CardHome = () => {
  const [cards, setCards] = useState([]);
  const [showType, setShowType] = useState("table");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/cards");
        setCards(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <>
    <div>
      <Layout title={"Card Home"}>
      {/* Page Header Start */}
      <div>
        <div className="page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
      
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ltn__breadcrumb-inner">
                        <h1 class="page-title text-black">Card List</h1>
                        <div class="ltn__breadcrumb-list">
                            <ul>
                                <li><a href="/" class="text-black"><span class="text-black"><i class="fas fa-home"></i></span> Home</a></li>
                                <li>Card List Page</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
  <div class="ltn__contact-message-area mb-40 mb--500">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ltn__form-box contact-form-box box-shadow white-bg">
               
        <button
          onClick={() => setShowType("table")}
          className="btn theme-btn-1 btn-effect-1 text-uppercase"
        >
          Table
        </button>
        <button
          onClick={() => setShowType("card")}
          className="btn theme-btn-1 btn-effect-1 text-uppercase"
        >
          Card
        </button>
        <Link to="/cards/create" className="btn theme-btn-1 btn-effect-1 text-uppercase">
         Add Card
        </Link>
      
      
        <h1 className="text-3xl my-8">Card List</h1>
       
     

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : showType === "table" ? (
        <CardTable cards={cards} />
      ) : (
        <Card cards={cards} />
      )}
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

export default CardHome;
