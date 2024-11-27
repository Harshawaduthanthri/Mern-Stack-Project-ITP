import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Card, Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import '../styles/siteCss/css/style.css'
import '../styles/siteCss/css/custom.css'
import '../styles/siteCss/css/responsive.css'
import '../styles/siteCss/css/font-icons.css'
import giftCard from './11-gift-card.svg';
import creditCardImage from './10-credit-card.svg';
import moneyImage from './9-money.svg';
import trolleyImage from './8-trolley.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { AiOutlineReload } from "react-icons/ai";
import blog1 from '../styles/bookingCss/img/header-page1.jpg'
import Modal from 'react-modal'; // Install react-modal package
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';


const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState({});

  const openModal = (post) => {
    setSelectedPost(post);
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }
  const getAllPosts = async () => {
    try {
      const response = await axios.get("/api/v1/post/get-posts")
      setPosts(response.data.data);//methana posts kiyla ne ghuwe ethkota emnne natha
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
        const postIndex = posts.findIndex(post => post._id === postId);
        if (postIndex === -1) {
            throw new Error("Post not found");
        }

        const post = posts[postIndex];
        const isLiked = post.likedByCurrentUser;

        let updatedLikeCount = post.likes;

        // Toggle like status
        if (isLiked) {
            updatedLikeCount -= 1; // Decrement like count if already liked
        } else {
            updatedLikeCount += 1; // Increment like count if not already liked
        }

        // Update the UI immediately to provide instant feedback to the user
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = { ...post, likes: updatedLikeCount, likedByCurrentUser: !isLiked };
        setPosts(updatedPosts);

        // Send request to the server to update the like count
        const response = await axios.post(`/api/v1/post/react-to-post/${postId}`, {
            reactionType: isLiked ? 'unlike' : 'like', // Send 'unlike' if already liked, otherwise send 'like'
        });

        // If the server request is successful, the UI will already be updated, so no action needed here
    } catch (error) {
        console.error("Error toggling like status:", error);
        toast.error("Failed to like post. Please try again.");
    }
};


  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  
  useEffect(() => {
    getAllPosts();
  }, []);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (product) => {
    // Check if the product is already in the cart
    const existingItem = cart.find((item) => item._id === product._id);

    // If the product is not in the cart, add it with quantity 1
    if (!existingItem) {
      const updatedProduct = { ...product, quantity: 1 };
      setCart([...cart, updatedProduct]);
      localStorage.setItem('cart', JSON.stringify([...cart, updatedProduct]));
      toast.success('Item Added to cart');
    } else {
      // If the product is already in the cart, update its quantity
      const updatedCart = cart.map((item) =>
        item._id === existingItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      toast.success('Quantity Updated in cart');
    }
  };
  return (
    <>

    <Layout title={"ALl Products - Best offers "} className="home-page">
      {/* banner image */}
 
      {/* banner image */}
      
<div className="body-wrapper">
{/* SLIDER AREA START (slider-3) */}
<div>
<section id="billboard" className="position-relative overflow-hidden bg-light-blue">
      <Swiper
        className="main-swiper"
        navigation={{
          nextEl: '.swiper-arrow-next',
          prevEl: '.swiper-arrow-prev',
        }}
      >
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex align-items-center">
              <div className="col-md-6">
                <div className="banner-content">
                  <h1 className="display-2 text-uppercase text-dark pb-5">
                    Your Products Are Great.
                  </h1>
                  <a href="/productlist" className="btn btn-medium btn-dark text-uppercase btn-rounded-none">
                    Shop Product
                  </a>
                </div>
              </div>
              <div className="col-md-5">
                <div className="image-holder">
                  <img src="images/banner-image.png" alt="banner" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container">
            <div className="row d-flex flex-wrap align-items-center">
              <div className="col-md-6">
                <div className="banner-content">
                  <h1 className="display-2 text-uppercase text-dark pb-5">
                    Technology Hack You Won't Get.
                  </h1>
                  <a href="/productlist" className="btn btn-medium btn-dark text-uppercase btn-rounded-none">
                    Shop Product
                  </a>
                </div>
              </div>
              <div class="col-md-5">
                <div class="image-holder">
                  <img src="images/banner-image.png" alt="banner" />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="swiper-icon swiper-arrow swiper-arrow-prev">
        <svg className="chevron-left">
          <use xlinkHref="#chevron-left" />
        </svg>
      </div>
      <div className="swiper-icon swiper-arrow swiper-arrow-next">
        <svg className="chevron-right">
          <use xlinkHref="#chevron-right" />
        </svg>
      </div>
    </section>

        

    <section id="company-services" className="padding-large">
    <div className="container">
        <div className="row">
            <div className="col-lg-3 col-md-6 pb-3">
                <div className="icon-box d-flex">
                    <div className="icon-box-icon pe-3 pb-3">
                        <i class="text-green fas fa-truck fa-2x"></i> 
                    </div>
                    <div className="icon-box-content">
                        <h3 className="card-title text-uppercase text-black">Free delivery</h3>
                        <p>Free delivery on all orders. Shop now for convenient shopping!</p>
                    </div>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 pb-3">
                <div className="icon-box d-flex">
                    <div className="icon-box-icon pe-3 pb-3">
                        <i class="fas fa-medal fa-2x"></i>
                    </div>
                    <div className="icon-box-content">
                        <h3 className="card-title text-uppercase text-black">Quality guarantee</h3>
                        <p>Every product is backed by our guarantee for your peace of mind.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-md-6 pb-3">
                <div class="icon-box d-flex">
                    <div className="icon-box-icon pe-3 pb-3">
                        <i class="fas fa-tags fa-2x"></i> 
                    </div>
                    <div className="icon-box-content">
                        <h3 className="card-title text-uppercase text-black">Daily offers</h3>
                        <p>Exciting offers every day! Don't miss out, shop now for exclusive savings.</p>
                    </div>
                </div>
            </div>
            <div className="col-lg-3 col-md-6 pb-3">
                <div className="icon-box d-flex">
                    <div className="icon-box-icon pe-3 pb-3">
                        <i class="fas fa-shield-alt fa-2x"></i> 
                    </div>
                    <div className="icon-box-content">
                        <h3 className="card-title text-uppercase text-black">100% secure payment</h3>
                        <p>Enjoy 100% secure transactions for every purchase you make.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>



</div>

  
  {/* SLIDER AREA END */}
  {/* CATEGORY AREA START */}
  



  {/* CATEGORY AREA END */}
  {/* PRODUCT AREA START (product-item-3) */}
  <div className="ltn__product-area ltn__product-gutter  no-product-ratting pt-20--- pt-65  pb-70">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title-area ltn__section-title-2 text-center">
            <h1 className="section-title">Featured Products</h1>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3">
          <div className="row">
            <div className="col-lg-12 col-sm-6">
              <div className="ltn__banner-item">
                <div className="ltn__banner-img">
                  <a href="/productlist"><img src={blog1} alt="Banner Image" /></a>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-sm-6">
              <div className="ltn__banner-item">
                <div className="ltn__banner-img">
                  <a href="/productlist"><img src={blog1} alt="Banner Image" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9">
          <div className="row ltn__tab-product-slider-one-active--- slick-arrow-1">
            {/* ltn__product-item */}
            <div className="d-flex flex-wrap">
  {products?.map((p) => (
    <div className="col-lg-3--- col-md-4 col-sm-6 col-6" key={p._id}>
      <div className="ltn__product-item ltn__product-item-2 text-left">
        <div className="product-img">
          <a href={`/product/${p.slug}`}>
            <img src={`/api/v1/product/product-photo/${p._id}`} alt={p.name} />
          </a>
          <div className="product-badge">
            <ul>
              <li className="sale-badge">New</li>
            </ul>
          </div>
          <div className="product-hover-action">
            <ul>
              <li>
                <a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal">
                  <i className="far fa-eye" />
                </a>
              </li>
              <li>
                <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                  <i className="far fa-heart" />
                </a>
              </li>
              <li>
                <a onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        
                      }} title="Wishlist" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                  <i className="fas fa-shopping-cart" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="product-info">
          <div className="product-ratting">
            <ul>
              <li><a href="#"><i className="fas fa-star" /></a></li>
              <li><a href="#"><i className="fas fa-star" /></a></li>
              <li><a href="#"><i className="fas fa-star" /></a></li>
              <li><a href="#"><i className="fas fa-star-half-alt" /></a></li>
              <li><a href="#"><i className="far fa-star" /></a></li>
            </ul>
          </div>
          <h2 className="product-title"><a href={`/product/${p.slug}`}>{p.name}</a></h2>
          <div className="product-price">
            <span>{p.price.toLocaleString("en-US", { style: "currency", currency: "LKR" })}</span>
           
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

            {/*  */}
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* PRODUCT AREA END */}
  {/* COUNTDOWN AREA START */}
  <div className=" page-header1 ltn__call-to-action-area section-bg-1 bg-image pt-120 pb-120">
    <div className="container">
      <div className="row">
        <div className="col-lg-7">
          <div className="call-to-action-inner text-color-white--- text-center---">
            <div className="section-title-area ltn__section-title-2--- text-center---">
              <h6 className="ltn__secondary-color">Service center</h6>
              <h1 className="section-title text-white">Make An Appointment <br /> To Visit Our Shop</h1>
              <p className="text-white">Cur tantas regiones barbarorum obiit, tot maria transmist <br />
                summo bono fruitur id est voluptate barbarorum </p>
            </div>
            <div className="ltn__countdown ltn__countdown-3 bg-white--" data-countdown="2021/12/28" />
            <div className="btn-wrapper animated">
              <a href="/dashboard/user/appointment" className="theme-btn-1 btn btn-effect-1 text-uppercase">Book Now</a>
              <a href="shop.html" className="ltn__secondary-color text-decoration-underline">Deal of The Day</a>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          {/* <img src="img/banner/15.png" alt="#"> */}
        </div>
      </div>
    </div>
  </div>
  {/* COUNTDOWN AREA END */}
  {/* BANNER AREA START */}
 
  {/* BANNER AREA END */}
  {/* SMALL PRODUCT LIST AREA START */}
  <div className="ltn__small-product-list-area section-bg-1 pt-115 pb-90 mt-90">
    <div className="container">
      
      <div className="row">
      <div class="call-to-action-area call-to-action-5 bg-image bg-overlay-theme-90 pt-40 pb-25" >
       
            <div class="row">
                <div class="col-lg-16">
                    <div class="call-to-action-inner call-to-action-inner-5 text-decoration text-center">
                        <h2 class="white-color">24/7 Availability, Make <a href="/dashboard/user/appointment">An Appointment</a></h2>
                    </div>
                </div>
            
        </div>
    </div>
      </div>
    </div>
  </div>
  {/* SMALL PRODUCT LIST AREA END */}
  
  {/* ABOUT US AREA START */}
  <div className="page-header4 ltn__about-us-area bg-image pt-115 pb-110" >
    <div className="container">
      <div className="row">
        <div className="col-lg-6 align-self-center">
          <div className="about-us-img-wrap about-img-left">
            {/* <img src="img/others/7.png" alt="About Us Image"> */}
          </div>
        </div>
        <div className="col-lg-6 align-self-center">
          <div className="about-us-info-wrap">
            <div className="section-title-area ltn__section-title-2--- mb-20">
              <h6 className="stext-whiteection-subtitle section-subtitle-2--- ltn__secondary-color">Employee Service</h6>
              <h1 className="section-title text-white">Our employees
               excel consistently, creating a culture of excellence<br/>
               </h1>
              <p>Our commitment to you is unwavering, regardless of where you are based. If you need assistance or have any questions, our team is here to support you 24/7.</p>
            </div>
            <ul className="ltn__list-item-half clearfix">
              <li>
                <i className="flaticon-home-2" />
                Available 24/7
              </li>
              <li>
                <i className="flaticon-mountain" />
                IT Support
              </li>
              <li>
                <i className="flaticon-heart" />
                Workplace Safety
              </li>
              <li>
                <i className="flaticon-secure" />
                Human Resources
              </li>
            </ul>
            <div className="btn-wrapper animated">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* ABOUT US AREA END */}
  {/* BLOG AREA START (blog-3) */}
  <div className="ltn__blog-area pt-115 pb-70">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area ltn__section-title-2--- text-center">
              <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color d-none">News & Blogs</h6>
              <h1 className="section-title">Latest Blogs</h1>
            </div>
          </div>
        </div>
        <div className="row ltn__blog-slider-one-active slick-arrow-1 ltn__blog-item-3-normal">
          {posts?.map((post) => (
            <div key={post._id} className={`col-md-4 mb-4 ${post.category === 'blue' ? 'blue-card' : ''}`}>
              <div className="ltn__blog-item ltn__blog-item-3">
                <div className="ltn__blog-img">
                  <a href="#"><img src={blog1} alt={post.title} /></a>
                </div>
                <div className="ltn__blog-brief">
                  <div className="ltn__blog-meta">
                    <ul>
                      <li className="ltn__blog-author">
                        <a href="#"><i className="far fa-user" />by: Admin</a>
                      </li>
                      <li className="ltn__blog-tags">
                        <a href="#"><i className="fas fa-tags" />{`Category: ${post.category}`}</a>
                      </li>
                    </ul>
                  </div>
                  <h3 className="ltn__blog-title"><a href="javascript:void(0)" onClick={() => openModal(post)}>{post.topic}</a></h3>
                  <div className="ltn__blog-meta-btn">
                    <div className="ltn__blog-meta">
                  <span>Likes: {post.likes}</span>
                </div>
                <div className="ltn__blog-btn">
                <button onClick={() => handleLike(post._id)}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-heart"
  >
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
    ></path>
  </svg>
  
</button>
                </div>
                    <div className="ltn__blog-meta">
                      {/* Additional meta information if needed */}
                    </div>
                    <div className="ltn__blog-btn">
                    <div className="ltn__blog-btn"></div>
                      <NavLink  onClick={() => openModal(post)}>Read more</NavLink >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Blog Description Modal"
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
      width: '60%', // Adjust the width as needed
      maxWidth: '500px', // Limiting maximum width
      height: 'auto', // You can set a fixed height if needed
      maxHeight: '70vh', // Limiting maximum height
      margin: '0 auto',
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto' // Enable vertical scrolling if content exceeds height
    }
  }}
>
  <button
    onClick={closeModal}
    style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      padding: '5px 10px',
      background: '#f44336',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }}
  >
    Close
  </button>
  <h2>{selectedPost.topic}</h2>
  <p>{selectedPost.description}</p>
</Modal>


    </div>


    <div className="row">
      <div className="col-lg-12">
        <div className="section-title-area ltn__section-title-2 text-center">
          <h6 className="section-subtitle ltn__secondary-color">//  features  //</h6>
          <h1 className="section-title">Why Choose Us<span>.</span></h1>
        </div>
      </div>
    </div>
    
 

  {/* BLOG AREA END */}
  {/* FEATURE AREA START ( Feature - 3) */}
  <div className="ltn__feature-area section-bg-1 mt-90--- pt-30 pb-30 mt--65---">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="ltn__feature-item-box-wrap ltn__feature-item-box-wrap-2 ltn__border--- section-bg-1">
            <div className="ltn__feature-item ltn__feature-item-8">
              <div className="ltn__feature-icon">
              <img src={trolleyImage} alt="Trolley" />
              </div>"
              
              <div className="ltn__feature-info">
                <h4>Free shipping</h4>
                <p>On all orders over $49.00</p>
              </div>
            </div>
            <div className="ltn__feature-item ltn__feature-item-8">
              <div className="ltn__feature-icon">
              <img src={moneyImage} alt="Money" />
              </div>
              <div className="ltn__feature-info">
                <h4>15 days returns</h4>
                <p>Moneyback guarantee</p>
              </div>
            </div>
            <div className="ltn__feature-item ltn__feature-item-8">
              <div className="ltn__feature-icon">
              <img src={creditCardImage} alt="Credit card icon" />
              </div>
              <div className="ltn__feature-info">
                <h4>Secure checkout</h4>
                <p>Protected by Paypal</p>
              </div>
            </div>
            <div className="ltn__feature-item ltn__feature-item-8">
              <div className="ltn__feature-icon">
              <img src={giftCard} alt="Gift card" />;
              </div>
              <div className="ltn__feature-info">
                <h4>Offer &amp; gift here</h4>
                <p>On all orders over</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* FEATURE AREA END */}
  {/* CALL TO ACTION START (call-to-action-6) */}
  <div className="ltn__call-to-action-area call-to-action-6 before-bg-bottom d-none" data-bs-bg="img/1.jpg--">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="call-to-action-inner call-to-action-inner-6 ltn__secondary-bg position-relative text-center---">
            <div className="coll-to-info text-color-white">
              <h1>Buy medical disposable face mask <br /> to protect your loved ones</h1>
            </div>
            <div className="btn-wrapper">
              <a className="btn btn-effect-3 btn-white" href="shop.html">Explore Products <i className="icon-next" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* CALL TO ACTION END */}
  {/* FOOTER AREA END */}
  {/* MODAL AREA START (Quick View Modal) */}
  <div className="ltn__modal-area ltn__quick-view-modal-area">
    <div className="modal fade" id="quick_view_modal" tabIndex={-1}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
              {/* <i class="fas fa-times"></i> */}
            </button>
          </div>
          <div className="modal-body">
            <div className="ltn__quick-view-modal-inner">
              <div className="modal-product-item">
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <div className="modal-product-img">
                      <img src="img/product/4.png" alt="#" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="modal-product-info">
                      <div className="product-ratting">
                        <ul>
                          <li><a href="#"><i className="fas fa-star" /></a></li>
                          <li><a href="#"><i className="fas fa-star" /></a></li>
                          <li><a href="#"><i className="fas fa-star" /></a></li>
                          <li><a href="#"><i className="fas fa-star-half-alt" /></a></li>
                          <li><a href="#"><i className="far fa-star" /></a></li>
                          <li className="review-total"> <a href="#"> ( 95 Reviews )</a></li>
                        </ul>
                      </div>
                      <h3>Digital Stethoscope</h3>
                      <div className="product-price">
                        <span>$149.00</span>
                        <del>$165.00</del>
                      </div>
                      <div className="modal-product-meta ltn__product-details-menu-1">
                        <ul>
                          <li>
                            <strong>Categories:</strong> 
                            <span>
                              <a href="#">Parts</a>
                              <a href="#">Car</a>
                              <a href="#">Seat</a>
                              <a href="#">Cover</a>
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="ltn__product-details-menu-2">
                        <ul>
                          <li>
                            <div className="cart-plus-minus">
                              <input type="text" name="qtybutton" className="cart-plus-minus-box" />
                            </div>
                          </li>
                          <li>
                            <a href="#" className="theme-btn-1 btn btn-effect-1" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                              <i className="fas fa-shopping-cart" />
                              <span>ADD TO CART</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="ltn__product-details-menu-3">
                        <ul>
                          <li>
                            <a href="#" className title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                              <i className="far fa-heart" />
                              <span>Add to Wishlist</span>
                            </a>
                          </li>
                          <li>
                            <a href="#" className title="Compare" data-bs-toggle="modal" data-bs-target="#quick_view_modal">
                              <i className="fas fa-exchange-alt" />
                              <span>Compare</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                      <hr />
                      <div className="ltn__social-media">
                        <ul>
                          <li>Share:</li>
                          <li><a href="#" title="Facebook"><i className="fab fa-facebook-f" /></a></li>
                          <li><a href="#" title="Twitter"><i className="fab fa-twitter" /></a></li>
                          <li><a href="#" title="Linkedin"><i className="fab fa-linkedin" /></a></li>
                          <li><a href="#" title="Instagram"><i className="fab fa-instagram" /></a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* MODAL AREA END */}
  {/* MODAL AREA START (Add To Cart Modal) */}
  <div className="ltn__modal-area ltn__add-to-cart-modal-area">
    <div className="modal fade" id="add_to_cart_modal" tabIndex={-1}>
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="ltn__quick-view-modal-inner">
              <div className="modal-product-item">
                <div className="row">
                  <div className="col-12">
                    <div className="modal-product-img">
                      
                    </div>
                    <div className="modal-product-info">
                      <h5><a href="product-details.html">Digital Stethoscope</a></h5>
                      <p className="added-cart"><i className="fa fa-check-circle" />  Successfully added to your Cart</p>
                      <div className="btn-wrapper">
                        <a href="/cart" className="theme-btn-1 btn btn-effect-1">View Cart</a>
                        <a href="checkout.html" className="theme-btn-2 btn btn-effect-2">Checkout</a>
                      </div>
                    </div>
                    {/* additional-info */}
                    <div className="additional-info d-none">
                      <p>We want to give you <b>10% discount</b> for your first order, <br />  Use discount code at checkout</p>
                      <div className="payment-method">
                        <img src="img/icons/payment.png" alt="#" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* MODAL AREA END */}
  {/* MODAL AREA START (Wishlist Modal) */}
  <div className="ltn__modal-area ltn__add-to-cart-modal-area">
    <div className="modal fade" id="liton_wishlist_modal" tabIndex={-1}>
      <div className="modal-dialog modal-md" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="ltn__quick-view-modal-inner">
              <div className="modal-product-item">
                <div className="row">
                  <div className="col-12">
                    <div className="modal-product-img">
                      <img src="img/product/7.png" alt="#" />
                    </div>
                    <div className="modal-product-info">
                      <h5><a href="product-details.html">Digital Stethoscope</a></h5>
                      <p className="added-cart"><i className="fa fa-check-circle" />  Successfully added to your Wishlist</p>
                      <div className="btn-wrapper">
                        <a href="wishlist.html" className="theme-btn-1 btn btn-effect-1">View Wishlist</a>
                      </div>
                    </div>
                    {/* additional-info */}
                    <div className="additional-info d-none">
                      <p>We want to give you <b>10% discount</b> for your first order, <br />  Use discount code at checkout</p>
                      <div className="payment-method">
                        <img src="img/icons/payment.png" alt="#" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



    </Layout>
    </>
  );
};

export default HomePage;