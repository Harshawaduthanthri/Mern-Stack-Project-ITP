import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);

  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (productId) => {
    // Implement your logic to add the product to the cart
    console.log("Product added to cart:", productId);
  };

  return (
    <Layout>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} result found </h6>
        <div className="row">
          {products?.map((p) => (
            <div className="col-md-4 mb-4" key={p._id}>
              <div
                className="card h-100 shadow-sm"
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5
                    className="card-title"
                    style={{ fontSize: "1.2rem", marginBottom: "10px" }}
                  >
                    {p.name}
                  </h5>
                  <p className="card-text" style={{ marginBottom: "15px" }}>
                    {p.description.substring(0, 50)}...
                  </p>
                  <p
                    className="card-text"
                    style={{ fontSize: "1.1rem", fontWeight: "bold" }}
                  >
                    LKR: {p.price}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleAddToCart(p._id)}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
