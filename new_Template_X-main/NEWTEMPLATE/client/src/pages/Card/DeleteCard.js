import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Layout from "../../components/Layout/Layout";


function DeleteCard() {

  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();


  const handleDeleteCard = () =>{
    axios
    .delete(`http://localhost:3000/cards/${id}`)
    .then(() => {
        navigate("/cards/CardHome");
      })
    .catch((error) => {
        console.log(error);
        
        enqueueSnackbar("card deleted successfully", { variant: "success" });

        navigate("/cards/CardHome");

      });
  }


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
                    <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <h3 className="text-2xl ">Are you sure You want to delete card?</h3>
          
      </div>
        <button type="button" className="btn btn-danger " onClick={handleDeleteCard}>Yes</button>
        <a href="/cards/cardHome" className="btn btn-success ">No</a>
        
      </div>
      </div>
      </div>
      </div>
      </div>
    
  </Layout>  
    </div>

    
      

     
    
  )
}

export default DeleteCard