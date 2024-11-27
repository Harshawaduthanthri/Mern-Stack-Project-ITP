import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ProductDetails.css";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const [cart, setCart] = useCart([]);
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [allRatings, setAllRatings] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Initial details
  useEffect(() => {
    if (params?.slug) {
      getProduct();

    }
  }, [params?.slug]);

  // Get product
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  // Get similar products
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Get all ratings for the current product (including reviews)


// useEffect to log the current ratings state
useEffect(() => {
  console.log("Current Ratings State:", allRatings);
}, [allRatings]); // Dependency array ensures the effect runs after allRatings is updated


  console.log("Current Ratings State:", allRatings); // Log the current ratings state

  const addToCart = (product) => {
    if (product.quantity > 0) {
      const updatedProduct = { ...product, quantity: product.quantity - 1 };
      setCart([...cart, updatedProduct]);
      localStorage.setItem("cart", JSON.stringify([...cart, updatedProduct]));

      toast.success("Product added to cart!");

      if (updatedProduct.quantity === 0) {
        toast.warning("Low storage for this product!");
      }
    } else {
      toast.error("Product is out of stock!");
    }
  };

  const handleReviewSubmit = async () => {
    try {
      // Make API call to submit review and rating
      const response = await axios.post(`/api/v1/product/giveratings/${product._id}`, {
        review,
        rating,
      });

      console.log(response.data); // Log the response if needed

      // Optionally, you can update the UI or show a success message
      toast.success("Review submitted successfully!");

      // Clear review and rating fields after submission
      setReview("");
      setRating(0);

      // Refresh ratings after submission
    
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit review.");
    }
  };

  const handleStarRating = (value) => {
    if (value === 5) {
      setRating(5);
    } else {
      setRating(value);
    }
  };

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name: {product.name}</h6>
          <h6>Description: {product.description}</h6>
          <h6>
            Price:
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "LKR",
            })}
          </h6>
          <h6>Category: {product?.category?.name}</h6>
          <button
            className="btn btn-secondary ms-1"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <div className="col-md-6">
          <h4>Write a Review</h4>
          <textarea
            className="form-control"
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className={`star ${value <= rating ? 'selected' : ''}`}
                onClick={() => handleStarRating(value)}
              >
                ⭐️
              </button>
            ))}
          </div>
          <button className="btn theme-btn-1 btn-effect-1 text-uppercase" onClick={handleReviewSubmit}>
            Submit Review
          </button>
        </div>
        <div className="col-md-6">
        <Link to={`/dashboard/user/productReview/${product._id}`}>
      <button className="btn theme-btn-1 btn-effect-1 text-uppercase">Product Reviews</button>
    </Link>

        </div>
      </div>

      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "LKR",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
    </Layout>
  );
};

export default ProductDetails;
