import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import { toast } from 'react-toastify';
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import { Typography, CardContent, CardMedia, Chip, Rating, Stack, Switch } from '@mui/material';
import '../styles/siteCss/css/style.css'
import '../styles/siteCss/css/custom.css'
import '../styles/siteCss/css/responsive.css'
import '../styles/siteCss/css/font-icons.css'



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

  const 
  handleAddToCart = (product) => {
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
  {/* Utilize Cart Menu Start */}
  <div id="ltn__utilize-cart-menu" className="ltn__utilize ltn__utilize-cart-menu">
    <div className="ltn__utilize-menu-inner ltn__scrollbar">
      <div className="ltn__utilize-menu-head">
        <span className="ltn__utilize-menu-title">Cart</span>
        <button className="ltn__utilize-close">×</button>
      </div>
      <div className="mini-cart-product-area ltn__scrollbar">
        <div className="mini-cart-item clearfix">
          <div className="mini-cart-img">
            <a href="#"><img src="img/product/1.png" alt="Image" /></a>
            <span className="mini-cart-item-delete"><i className="icon-cancel" /></span>
          </div>
          <div className="mini-cart-info">
            <h6><a href="#">Antiseptic Spray</a></h6>
            <span className="mini-cart-quantity">1 x $65.00</span>
          </div>
        </div>
        <div className="mini-cart-item clearfix">
          <div className="mini-cart-img">
            <a href="#"><img src="img/product/2.png" alt="Image" /></a>
            <span className="mini-cart-item-delete"><i className="icon-cancel" /></span>
          </div>
          <div className="mini-cart-info">
            <h6><a href="#">Digital Stethoscope</a></h6>
            <span className="mini-cart-quantity">1 x $85.00</span>
          </div>
        </div>
        <div className="mini-cart-item clearfix">
          <div className="mini-cart-img">
            <a href="#"><img src="img/product/3.png" alt="Image" /></a>
            <span className="mini-cart-item-delete"><i className="icon-cancel" /></span>
          </div>
          <div className="mini-cart-info">
            <h6><a href="#">Cosmetic Containers</a></h6>
            <span className="mini-cart-quantity">1 x $92.00</span>
          </div>
        </div>
        <div className="mini-cart-item clearfix">
          <div className="mini-cart-img">
            <a href="#"><img src="img/product/4.png" alt="Image" /></a>
            <span className="mini-cart-item-delete"><i className="icon-cancel" /></span>
          </div>
          <div className="mini-cart-info">
            <h6><a href="#">Thermometer Gun</a></h6>
            <span className="mini-cart-quantity">1 x $68.00</span>
          </div>
        </div>
      </div>
      <div className="mini-cart-footer">
        <div className="mini-cart-sub-total">
          <h5>Subtotal: <span>$310.00</span></h5>
        </div>
        <div className="btn-wrapper">
          <a href="cart.html" className="theme-btn-1 btn btn-effect-1">View Cart</a>
          <a href="cart.html" className="theme-btn-2 btn btn-effect-2">Checkout</a>
        </div>
        <p>Free Shipping on All Orders Over $100!</p>
      </div>
    </div>
  </div>
  {/* Utilize Cart Menu End */}
  {/* Utilize Mobile Menu Start */}
  <div id="ltn__utilize-mobile-menu" className="ltn__utilize ltn__utilize-mobile-menu">
    <div className="ltn__utilize-menu-inner ltn__scrollbar">
      <div className="ltn__utilize-menu-head">
        <div className="site-logo">
          <a href="index.html"><img src="img/logo.png" alt="Logo" /></a>
        </div>
        <button className="ltn__utilize-close">×</button>
      </div>
      <div className="ltn__utilize-menu-search-form">
        <form action="#">
          <input type="text" placeholder="Search..." />
          <button><i className="fas fa-search" /></button>
        </form>
      </div>
      <div className="ltn__utilize-menu">
        <ul>
          <li><a href="#">Home</a>
            <ul className="sub-menu">
              <li><a href="index.html">Home Style 01</a></li>
              <li><a href="index-2.html">Home Style 02</a></li>
              <li><a href="index-3.html">Home Style 03</a></li>
            </ul>
          </li>
          <li><a href="#">About</a>
            <ul className="sub-menu">
              <li><a href="about.html">About</a></li>
              <li><a href="service.html">Services</a></li>
              <li><a href="service-details.html">Service Details</a></li>
              <li><a href="portfolio.html">Portfolio</a></li>
              <li><a href="portfolio-2.html">Portfolio - 02</a></li>
              <li><a href="portfolio-details.html">Portfolio Details</a></li>
              <li><a href="team.html">Team</a></li>
              <li><a href="team-details.html">Team Details</a></li>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="locations.html">Google Map Locations</a></li>
            </ul>
          </li>
          <li><a href="#">Shop</a>
            <ul className="sub-menu">
              <li><a href="shop.html">Shop</a></li>
              <li><a href="shop-grid.html">Shop Grid</a></li>
              <li><a href="shop-left-sidebar.html">Shop Left sidebar</a></li>
              <li><a href="shop-right-sidebar.html">Shop right sidebar</a></li>
              <li><a href="product-details.html">Shop details </a></li>
              <li><a href="cart.html">Cart</a></li>
              <li><a href="wishlist.html">Wishlist</a></li>
              <li><a href="checkout.html">Checkout</a></li>
              <li><a href="order-tracking.html">Order Tracking</a></li>
              <li><a href="account.html">My Account</a></li>
              <li><a href="login.html">Sign in</a></li>
              <li><a href="register.html">Register</a></li>
            </ul>
          </li>
          <li><a href="#">News</a>
            <ul className="sub-menu">
              <li><a href="blog.html">News</a></li>
              <li><a href="blog-grid.html">News Grid</a></li>
              <li><a href="blog-left-sidebar.html">News Left sidebar</a></li>
              <li><a href="blog-right-sidebar.html">News Right sidebar</a></li>
              <li><a href="blog-details.html">News details</a></li>
            </ul>
          </li>
          <li><a href="#">Pages</a>
            <ul className="sub-menu">
              <li><a href="about.html">About</a></li>
              <li><a href="service.html">Services</a></li>
              <li><a href="service-details.html">Service Details</a></li>
              <li><a href="portfolio.html">Portfolio</a></li>
              <li><a href="portfolio-2.html">Portfolio - 02</a></li>
              <li><a href="portfolio-details.html">Portfolio Details</a></li>
              <li><a href="team.html">Team</a></li>
              <li><a href="team-details.html">Team Details</a></li>
              <li><a href="faq.html">FAQ</a></li>
              <li><a href="history.html">History</a></li>
              <li><a href="add-listing.html">Add Listing</a></li>
              <li><a href="locations.html">Google Map Locations</a></li>
              <li><a href="404.html">404</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="coming-soon.html">Coming Soon</a></li>
            </ul>
          </li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div className="ltn__utilize-buttons ltn__utilize-buttons-2">
        <ul>
          <li>
            <a href="account.html" title="My Account">
              <span className="utilize-btn-icon">
                <i className="far fa-user" />
              </span>
              My Account
            </a>
          </li>
          <li>
            <a href="wishlist.html" title="Wishlist">
              <span className="utilize-btn-icon">
                <i className="far fa-heart" />
                <sup>3</sup>
              </span>
              Wishlist
            </a>
          </li>
          <li>
            <a href="cart.html" title="Shoping Cart">
              <span className="utilize-btn-icon">
                <i className="fas fa-shopping-cart" />
                <sup>5</sup>
              </span>
              Shoping Cart
            </a>
          </li>
        </ul>
      </div>
      <div className="ltn__social-media-2">
        <ul>
          <li><a href="#" title="Facebook"><i className="fab fa-facebook-f" /></a></li>
          <li><a href="#" title="Twitter"><i className="fab fa-twitter" /></a></li>
          <li><a href="#" title="Linkedin"><i className="fab fa-linkedin" /></a></li>
          <li><a href="#" title="Instagram"><i className="fab fa-instagram" /></a></li>
        </ul>
      </div>
    </div>
  </div>
  {/* Utilize Mobile Menu End */}
  <div className="ltn__utilize-overlay" />    
  {/* SLIDER AREA START (slider-3) */}
  <div className="ltn__slider-area ltn__slider-3---  section-bg-1--- mt-30">
    <div className="container">
      <div className="row">
        <div className="col-lg-7">
          <div className="ltn__slide-active-2 slick-slide-arrow-1 slick-slide-dots-1 mb-30">
            {/* ltn__slide-item */}
            <div className="ltn__slide-item ltn__slide-item-10 section-bg-1 bg-image" data-bs-bg="../styles/siteCss/img/banner/1.jpg">
              <div className="ltn__slide-item-inner">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7 col-md-7 col-sm-7 align-self-center">
                      <div className="slide-item-info">
                        <div className="slide-item-info-inner ltn__slide-animation">
                          <h6 className="slide-sub-title ltn__secondary-color animated">Up To 50% Off Today Only!</h6>
                          <h1 className="slide-title  animated">Gold Standard <br />Pre-Workout</h1>
                          <div className="slide-brief animated d-none">
                            <p>Predictive analytics is drastically changing the real estate industry. In the past, providing data for quick</p>
                          </div>
                          <h5 className="color-orange  animated">Starting at &amp;16.99</h5>
                          <div className="btn-wrapper  animated">
                            <a href="shop.html" className="theme-btn-1 btn btn-effect-1">Shop now</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5 align-self-center">
                      <div className="slide-item-img">
                        {/* <a href="shop.html"><img src="img/product/1.png" alt="Image"></a> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ltn__slide-item */}
            <div className="ltn__slide-item ltn__slide-item-10 section-bg-1 bg-image" data-bs-bg="../styles/siteCss/img/banner/1.jpg">
              <div className="ltn__slide-item-inner">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7 col-md-7 col-sm-7 align-self-center">
                      <div className="slide-item-info">
                        <div className="slide-item-info-inner ltn__slide-animation">
                          <h4 className="slide-sub-title ltn__secondary-color animated text-uppercase">Welcome to our shop</h4>
                          <h1 className="slide-title  animated">TGold Standard <br />Pre-Workout</h1>
                          <div className="slide-brief animated d-none">
                            <p>Predictive analytics is drastically changing the real estate industry. In the past, providing data for quick</p>
                          </div>
                          <div className="btn-wrapper  animated">
                            <a href="shop.html" className="theme-btn-1 btn btn-effect-1 text-uppercase">Shop now</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-5 col-sm-5 align-self-center">
                      <div className="slide-item-img">
                        {/* <a href="shop.html"><img src="img/slider/62.jpg" alt="Image"></a> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="ltn__banner-item">
            <div className="ltn__banner-img">
              <a href="shop.html"><img src="../styles/siteCss/img/banner/1.jpg" alt="Banner Image" /></a>
            </div>
          </div>
          <div className="ltn__banner-item">
            <div className="ltn__banner-img">
              <a href="shop.html"><img src="../styles/siteCss/img/banner/banner-1.jpg" alt="Banner Image" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* SLIDER AREA END */}
  {/* CATEGORY AREA START */}
 
    <div class="ltn__category-area section-bg-1-- pt-30 pb-50">
        <div class="container">
            <div class="row ltn__category-slider-active-six slick-arrow-1 border-bottom">
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                        <i class="fas fa-tags"></i>
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Best Deals</a></h6>
                    </div>
                </div>
            </div>
          
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-shipping-fast"></i> 
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Free Shipping</a></h6>
                    </div>
                </div>
            </div>
           
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-credit-card"></i> 
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Secure Payments</a></h6>
                    </div>
                </div>
            </div>
           
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-shopping-cart"></i> 
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Shop Now</a></h6>
                    </div>
                </div>
            </div>
         
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-exchange-alt"></i> 
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Easy Returns</a></h6>
                    </div>
                </div>
            </div>
          
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-box"></i> 
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">New Arrivals</a></h6>
                    </div>
                </div>
            </div>
          
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-user-circle"></i> 
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">My Account</a></h6>
                    </div>
                </div>
            </div>
           
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-gift"></i> {/* Gift Cards */}

                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Gift Cards</a></h6>
                    </div>
                </div>
            </div>
           
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-comments"></i>
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Customer Service</a></h6>
                    </div>
                </div>
            </div>
           
            <div class="col-xl-1 col-lg-2 col-md-3 col-sm-4 col-6 text-center">
                <div class="ltn__category-item ltn__category-item-6">
                    <div class="ltn__category-item-img">
                        <a href="shop.html">
                            <i class="fas fa-heart"></i> 
                        </a>
                    </div>
                    <div class="ltn__category-item-name">
                        <h6><a href="shop.html">Wishlist</a></h6>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

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
                  <a href="shop.html"><img src="img/banner/11.jpg" alt="Banner Image" /></a>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-sm-6">
              <div className="ltn__banner-item">
                <div className="ltn__banner-img">
                  <a href="shop.html"><img src="img/banner/12.jpg" alt="Banner Image" /></a>
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
                <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                  <i className="fas fa-shopping-cart" />
                </a>
              </li>
              <li>
                <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                  <i className="far fa-heart" />
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
  <div className="ltn__call-to-action-area section-bg-1 bg-image pt-120 pb-120" data-bs-bg="img/bg/25.jpg">
    <div className="container">
      <div className="row">
        <div className="col-lg-7">
          <div className="call-to-action-inner text-color-white--- text-center---">
            <div className="section-title-area ltn__section-title-2--- text-center---">
              <h6 className="ltn__secondary-color">Todays Hot Offer</h6>
              <h1 className="section-title">Free Covid-19 Vaccine<br />Campaign Ticket</h1>
              <p>Cur tantas regiones barbarorum obiit, tot maria transmist <br />
                summo bono fruitur id est voluptate barbarorum </p>
            </div>
            <div className="ltn__countdown ltn__countdown-3 bg-white--" data-countdown="2021/12/28" />
            <div className="btn-wrapper animated">
              <a href="contact.html" className="theme-btn-1 btn btn-effect-1 text-uppercase">Book Now</a>
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
  <div className="ltn__banner-area mt-120---">
    <div className="container">
      <div className="row ltn__custom-gutter--- justify-content-center">
        <div className="col-lg-4 col-sm-6">
          <div className="ltn__banner-item">
            <div className="ltn__banner-img">
              <a href="shop.html"><img src="img/banner/23.jpg" alt="Banner Image" /></a>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6">
          <div className="ltn__banner-item">
            <div className="ltn__banner-img">
              <a href="shop.html"><img src="img/banner/21.jpg" alt="Banner Image" /></a>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-sm-6">
          <div className="ltn__banner-item">
            <div className="ltn__banner-img">
              <a href="shop.html"><img src="img/banner/23.jpg" alt="Banner Image" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* BANNER AREA END */}
  {/* SMALL PRODUCT LIST AREA START */}
  <div className="ltn__small-product-list-area section-bg-1 pt-115 pb-90 mt-90">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title-area ltn__section-title-2 text-center">
            <h1 className="section-title">Featured Products</h1>
          </div>
        </div>
      </div>
      <div className="row">
        {/* small-product-item */}
        <div className="col-lg-4 col-md-6 col-12">
          <div className="ltn__small-product-item">
            <div className="small-product-item-img">
              <a href="product-details.html"><img src="img/product/1.png" alt="Image" /></a>
            </div>
            <div className="small-product-item-info">
              <div className="product-ratting">
                <ul>
                  <li><a href="#"><i className="fas fa-star" /></a></li>
                  <li><a href="#"><i className="fas fa-star" /></a></li>
                  <li><a href="#"><i className="fas fa-star" /></a></li>
                  <li><a href="#"><i className="fas fa-star-half-alt" /></a></li>
                  <li><a href="#"><i className="far fa-star" /></a></li>
                </ul>
              </div>
              <h2 className="product-title"><a href="product-details.html">Antiseptic Spray</a></h2>
              <div className="product-price">
                <span>$129.00</span>
                <del>$140.00</del>
              </div>
            </div>
          </div>
        </div>
        
        
        {/*  */}
      </div>
    </div>
  </div>
  {/* SMALL PRODUCT LIST AREA END */}
  {/* PRODUCT AREA START (product-item-3) */}
  <div className="ltn__product-area ltn__product-gutter pt-115 pb-70">
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="section-title-area ltn__section-title-2 text-center">
            <h1 className="section-title">Best Selling Item</h1>
          </div>
        </div>
      </div>
      <div className="row ltn__tab-product-slider-one-active--- slick-arrow-1">
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/1.png" alt="#" /></a>
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
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Antiseptic Spray</a></h2>
              <div className="product-price">
                <span>$32.00</span>
                <del>$46.00</del>
              </div>
            </div>
          </div>
        </div>
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/2.png" alt="#" /></a>
              <div className="product-hover-action">
                <ul>
                  <li>
                    <a href="#" title="Quick View" data-bs-toggle="modal" data-bs-target="#quick_view_modal">
                      <i className="far fa-eye" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Digital Stethoscope</a></h2>
              <div className="product-price">
                <span>$25.00</span>
                <del>$35.00</del>
              </div>
            </div>
          </div>
        </div>
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/3.png" alt="#" /></a>
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
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Cosmetic Containers</a></h2>
              <div className="product-price">
                <span>$75.00</span>
                <del>$92.00</del>
              </div>
            </div>
          </div>
        </div>
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/4.png" alt="#" /></a>
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
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Cosmetic Containers</a></h2>
              <div className="product-price">
                <span>$78.00</span>
                <del>$85.00</del>
              </div>
            </div>
          </div>
        </div>
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/5.png" alt="#" /></a>
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
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Blue Hand Gloves</a></h2>
              <div className="product-price">
                <span>$150.00</span>
                <del>$180.00</del>
              </div>
            </div>
          </div>
        </div>
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/6.png" alt="#" /></a>
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
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Thermometer Gun</a></h2>
              <div className="product-price">
                <span>$150.00</span>
                <del>$180.00</del>
              </div>
            </div>
          </div>
        </div>
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/7.png" alt="#" /></a>
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
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Cosmetic Containers</a></h2>
              <div className="product-price">
                <span>$75.00</span>
                <del>$92.00</del>
              </div>
            </div>
          </div>
        </div>
        {/* ltn__product-item */}
        <div className="col-lg-3 col-md-4 col-sm-6 col-6">
          <div className="ltn__product-item ltn__product-item-3 text-left">
            <div className="product-img">
              <a href="product-details.html"><img src="img/product-2/8.png" alt="#" /></a>
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
                    <a href="#" title="Add to Cart" data-bs-toggle="modal" data-bs-target="#add_to_cart_modal">
                      <i className="fas fa-shopping-cart" />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Wishlist" data-bs-toggle="modal" data-bs-target="#liton_wishlist_modal">
                      <i className="far fa-heart" /></a>
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
              <h2 className="product-title"><a href="product-details.html">Cosmetic Containers</a></h2>
              <div className="product-price">
                <span>$78.00</span>
                <del>$85.00</del>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
      </div>
    </div>
  </div>
  {/* PRODUCT AREA END */}
  {/* ABOUT US AREA START */}
  <div className="ltn__about-us-area bg-image pt-115 pb-110" data-bs-bg="img/bg/26.jpg">
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
              <h6 className="section-subtitle section-subtitle-2--- ltn__secondary-color">N95 Facial Covering Mask</h6>
              <h1 className="section-title">Grade A Safety Masks
                For Sale. Haurry Up!</h1>
              <p>Over 39,000 people work for us in more than 70 countries all over the
                This breadth of global coverage, combined with specialist services</p>
            </div>
            <ul className="ltn__list-item-half clearfix">
              <li>
                <i className="flaticon-home-2" />
                Activated Carbon
              </li>
              <li>
                <i className="flaticon-mountain" />
                Breathing Valve
              </li>
              <li>
                <i className="flaticon-heart" />
                6 Layer Filteration
              </li>
              <li>
                <i className="flaticon-secure" />
                Rewashes &amp; Reusable
              </li>
            </ul>
            <div className="btn-wrapper animated">
              <a href="service.html" className="ltn__secondary-color text-uppercase text-decoration-underline">View Products</a>
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
            <h6 className="section-subtitle section-subtitle-2 ltn__secondary-color d-none">News &amp; Blogs</h6>
            <h1 className="section-title">Leatest Blogs</h1>
          </div>
        </div>
      </div>
      <div className="row  ltn__blog-slider-one-active slick-arrow-1 ltn__blog-item-3-normal">
        {/* Blog Item */}
        <div className="col-lg-12">
          <div className="ltn__blog-item ltn__blog-item-3">
            <div className="ltn__blog-img">
              <a href="blog-details.html"><img src="img/blog/1.jpg" alt="#" /></a>
            </div>
            <div className="ltn__blog-brief">
              <div className="ltn__blog-meta">
                <ul>
                  <li className="ltn__blog-author">
                    <a href="#"><i className="far fa-user" />by: Admin</a>
                  </li>
                  <li className="ltn__blog-tags">
                    <a href="#"><i className="fas fa-tags" />Decorate</a>
                  </li>
                </ul>
              </div>
              <h3 className="ltn__blog-title"><a href="blog-details.html">10 Brilliant Ways To Decorate Your Home</a></h3>
              <div className="ltn__blog-meta-btn">
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-date"><i className="far fa-calendar-alt" />June 24, 2021</li>
                  </ul>
                </div>
                <div className="ltn__blog-btn">
                  <a href="blog-details.html">Read more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Blog Item */}
        <div className="col-lg-12">
          <div className="ltn__blog-item ltn__blog-item-3">
            <div className="ltn__blog-img">
              <a href="blog-details.html"><img src="img/blog/2.jpg" alt="#" /></a>
            </div>
            <div className="ltn__blog-brief">
              <div className="ltn__blog-meta">
                <ul>
                  <li className="ltn__blog-author">
                    <a href="#"><i className="far fa-user" />by: Admin</a>
                  </li>
                  <li className="ltn__blog-tags">
                    <a href="#"><i className="fas fa-tags" />Interior</a>
                  </li>
                </ul>
              </div>
              <h3 className="ltn__blog-title"><a href="blog-details.html">The Most Inspiring Interior Design Of 2021</a></h3>
              <div className="ltn__blog-meta-btn">
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-date"><i className="far fa-calendar-alt" />July 23, 2021</li>
                  </ul>
                </div>
                <div className="ltn__blog-btn">
                  <a href="blog-details.html">Read more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Blog Item */}
        <div className="col-lg-12">
          <div className="ltn__blog-item ltn__blog-item-3">
            <div className="ltn__blog-img">
              <a href="blog-details.html"><img src="img/blog/3.jpg" alt="#" /></a>
            </div>
            <div className="ltn__blog-brief">
              <div className="ltn__blog-meta">
                <ul>
                  <li className="ltn__blog-author">
                    <a href="#"><i className="far fa-user" />by: Admin</a>
                  </li>
                  <li className="ltn__blog-tags">
                    <a href="#"><i className="fas fa-tags" />Estate</a>
                  </li>
                </ul>
              </div>
              <h3 className="ltn__blog-title"><a href="blog-details.html">Recent Commercial Real Estate Transactions</a></h3>
              <div className="ltn__blog-meta-btn">
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-date"><i className="far fa-calendar-alt" />May 22, 2021</li>
                  </ul>
                </div>
                <div className="ltn__blog-btn">
                  <a href="blog-details.html">Read more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Blog Item */}
        <div className="col-lg-12">
          <div className="ltn__blog-item ltn__blog-item-3">
            <div className="ltn__blog-img">
              <a href="blog-details.html"><img src="img/blog/4.jpg" alt="#" /></a>
            </div>
            <div className="ltn__blog-brief">
              <div className="ltn__blog-meta">
                <ul>
                  <li className="ltn__blog-author">
                    <a href="#"><i className="far fa-user" />by: Admin</a>
                  </li>
                  <li className="ltn__blog-tags">
                    <a href="#"><i className="fas fa-tags" />Room</a>
                  </li>
                </ul>
              </div>
              <h3 className="ltn__blog-title"><a href="blog-details.html">Renovating a Living Room? Experts Share Their Secrets</a></h3>
              <div className="ltn__blog-meta-btn">
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-date"><i className="far fa-calendar-alt" />June 24, 2021</li>
                  </ul>
                </div>
                <div className="ltn__blog-btn">
                  <a href="blog-details.html">Read more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Blog Item */}
        <div className="col-lg-12">
          <div className="ltn__blog-item ltn__blog-item-3">
            <div className="ltn__blog-img">
              <a href="blog-details.html"><img src="img/blog/5.jpg" alt="#" /></a>
            </div>
            <div className="ltn__blog-brief">
              <div className="ltn__blog-meta">
                <ul>
                  <li className="ltn__blog-author">
                    <a href="#"><i className="far fa-user" />by: Admin</a>
                  </li>
                  <li className="ltn__blog-tags">
                    <a href="#"><i className="fas fa-tags" />Trends</a>
                  </li>
                </ul>
              </div>
              <h3 className="ltn__blog-title"><a href="blog-details.html">7 home trends that will shape your house in 2021</a></h3>
              <div className="ltn__blog-meta-btn">
                <div className="ltn__blog-meta">
                  <ul>
                    <li className="ltn__blog-date"><i className="far fa-calendar-alt" />June 24, 2021</li>
                  </ul>
                </div>
                <div className="ltn__blog-btn">
                  <a href="blog-details.html">Read more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*  */}
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
                <img src="../styles/siteCss/img/icons/svg/8-trolley.svg"/>
              </div>"
              
              <div className="ltn__feature-info">
                <h4>Free shipping</h4>
                <p>On all orders over $49.00</p>
              </div>
            </div>
            <div className="ltn__feature-item ltn__feature-item-8">
              <div className="ltn__feature-icon">
                <img src="img/icons/svg/9-money.svg" alt="#" />
              </div>
              <div className="ltn__feature-info">
                <h4>15 days returns</h4>
                <p>Moneyback guarantee</p>
              </div>
            </div>
            <div className="ltn__feature-item ltn__feature-item-8">
              <div className="ltn__feature-icon">
                <img src="img/icons/svg/10-credit-card.svg" alt="#" />
              </div>
              <div className="ltn__feature-info">
                <h4>Secure checkout</h4>
                <p>Protected by Paypal</p>
              </div>
            </div>
            <div className="ltn__feature-item ltn__feature-item-8">
              <div className="ltn__feature-icon">
                <img src="img/icons/svg/11-gift-card.svg" alt="#" />
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
                      <img src="img/product/1.png" alt="#" />
                    </div>
                    <div className="modal-product-info">
                      <h5><a href="product-details.html">Digital Stethoscope</a></h5>
                      <p className="added-cart"><i className="fa fa-check-circle" />  Successfully added to your Cart</p>
                      <div className="btn-wrapper">
                        <a href="cart.html" className="theme-btn-1 btn btn-effect-1">View Cart</a>
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