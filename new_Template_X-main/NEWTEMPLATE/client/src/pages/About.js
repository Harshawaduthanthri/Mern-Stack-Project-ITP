import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Green line app"}>
     <div>
     <div className="page-header py-5 mb-5 wow fadeIn" data-wow-delay="0.1s">
      <div class="container">
          <div class="row">
              <div class="col-lg-12">
                  <div class="ltn__breadcrumb-inner">
                      <h1 class="page-title text-black">About Us</h1>
                      <div class="ltn__breadcrumb-list">
                          <ul>
                              <li><a href="/" class="text-black"><span class="text-black"><i class="fas fa-home"></i></span> Home</a></li>
                              <li>About us Page</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  {/* BREADCRUMB AREA END */}
  {/* ABOUT US AREA START */}
  <div className="ltn__about-us-area pt-25--- pb-120 ">
    <div className="container">
      <div className="row">
        <div className="col-lg-6 align-self-center">
          <div className="about-us-img-wrap about-img-left">
            <img src="img/others/9.png" alt="About Us Image" />
          </div>
        </div>
        <div className="col-lg-6 align-self-center">
          <div className="about-us-info-wrap">
            <div className="section-title-area ltn__section-title-2--- mb-30">
              <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color d-none">About Us</h6>
              <h1 className="section-title">Your faithful partners Medical Goods</h1>
              <p>Welcome to  Gree line Technology, your ultimate destination for cutting-edge computer hardware solutions! Founded in [Year], we are passionate about technology and committed to providing top-quality products and exceptional customer service to enthusiasts, professionals, and businesses alike.

At Gree line Technology, we understand the importance of reliable and high-performance hardware in today’s digital world. Whether you're building a gaming rig, upgrading your workstation, or optimizing your server infrastructure, we have everything you need to take your computing experience to the next level.</p>
            </div>
            <ul className="ltn__list-item-1 ltn__list-item-1-before--- clearfix">
              <li><i className="fas fa-check-square" /> Better security for patient privacy and information.</li>
              <li><i className="fas fa-check-square" /> More products at lower prices.</li>
              <li><i className="fas fa-check-square" /> connect customers with the power of eCommerce at all.</li>
            </ul>
            <div className="about-author-info-2 border-top mt-30 pt-20">
              <ul>
                <li>
                  <div className="about-author-info-2-brief  d-flex">
                    <div className="author-img">
                      <img src="img/blog/author.jpg" alt="#" />
                    </div>
                    <div className="author-name-designation">
                      <h4 className="mb-0">Jerry Henson</h4>
                      <small>Medical Specialist</small>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="about-author-info-2-contact  d-flex">
                    <div className="about-contact-icon d-flex align-self-center mr-10">
                      <i className="icon-call" />
                    </div>
                    <div className="about-author-info-2-contact-info">
                      <small>Get Support</small>
                      <h6 className="mb-0">123-456-789-10</h6>
                    </div>
                  </div>
                </li>
              </ul>
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

export default About;
