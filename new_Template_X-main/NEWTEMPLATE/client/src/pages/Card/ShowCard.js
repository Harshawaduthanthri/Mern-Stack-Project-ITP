import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const ShowCard = () => {

  const [card,setCards] = useState([])
  const [loading,setLoading] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:3000/cards/${id}`).then((response)=>{

      setCards(response.data)
      setLoading(false)
    
    }).catch((error) => {
    
      console.log(error)
      setLoading(false)
    
    })

  },[])  

  return (
    <div>
      <Layout title={"Card Home"}>
      {/* Page Header Start */}
      <div>
        <div className="page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
      
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ltn__breadcrumb-inner">
                        <h1 class="page-title text-black">Show Card</h1>
                        <div class="ltn__breadcrumb-list">
                            <ul>
                                <li><a href="/" class="text-black"><span class="text-black"><i class="fas fa-home"></i></span> Home</a></li>
                                <li>show card Page</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
  <div
  style={{
    display: "flex",
    justifyContent: "center",
     // Adjust height as needed
    flexDirection: "column",
  }}
>
<div className="ltn__contact-message-area mb-40 mb--500" style={{ width: "100%" }}>
  <div className="container">
    <div className="row">
      <div className="col-lg-12">
        <div className="ltn__form-box contact-form-box box-shadow white-bg">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <h1 style={{ color: "black" }}>Show Card</h1>
          </div>
          <div className="p-4" style={{ display: "flex", justifyContent: "center" }}>
            <div style={cardStyle}>
              <p><strong style={{ color: "green" }}>Name:</strong> {card.name}</p>
              <p><strong style={{ color: "green" }}>Number:</strong> {card.number}</p>
              <p><strong style={{ color: "green" }}>Ex.Date:</strong> {card.exdate}</p>
              <p><strong style={{ color: "green" }}>CVV:</strong> {card.cvv}</p>
              <p><strong style={{ color: "green" }}>Create time:</strong> {new Date(card.createdAt).toString()}</p>
              <p><strong style={{ color: "green" }}>Last Update:</strong> {new Date(card.updatedAt).toString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

    
  </Layout>  
    </div>

    
  )
}

const cardStyle = {
  border: '1px solid #ccc',
  padding: '15px',
  marginBottom: '20px',
  width: '300px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  position: 'relative',
};

const deleteButtonStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'red',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '5px',
};

export default ShowCard