import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import Layout from '../../components/Layout/Layout';
const CouponForm = () => {
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [expirationDate, setExpirationDate] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get("/api/v1/coupon");
        setCoupons(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!code || !percentage || !expirationDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editing) {
        await axios.put(`/api/v1/coupon/${selectedCoupon._id}`, {
          code,
          percentage,
          expirationDate
        });
        toast.success("Coupon updated successfully");
      } else {
        const res = await axios.post("/api/v1/coupon", {
          code,
          percentage,
          expirationDate
        });
        setCoupons([...coupons, res.data]);
        toast.success("Coupon created successfully");
      }

      setCode("");
      setPercentage(0);
      setExpirationDate("");
      setSelectedCoupon(null);
      setEditing(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (coupon) => {
    setCode(coupon.code);
    setPercentage(coupon.percentage);
    setExpirationDate(coupon.expirationDate);
    setSelectedCoupon(coupon);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/v1/coupon/${id}`);
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
      toast.success("Coupon deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete coupon");
    }
  };

  const handleApplyCoupon = async () => {
    // Implement apply coupon logic here
  };

  return (
    <Layout title={'create coupons'}>
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Coupon Management</h1>
      <div>
        <h2>Create/Update Coupon</h2>
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon Code"
            required
            style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
          />
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            placeholder="Percentage"
            required
            style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
          />
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            placeholder="Expiration Date"
            required
            style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
            {editing ? "Update Coupon" : "Create Coupon"}
          </button>
        </form>
      </div>
      <div>
        <h2>Coupons List</h2>
        <ul>
          {coupons.map((coupon) => (
            <li key={coupon._id}>
              {coupon.code} - {coupon.percentage}% (Expires on {new Date(coupon.expirationDate).toLocaleDateString()})
              <button onClick={() => handleEdit(coupon)} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>Edit</button>
              <button onClick={() => handleDelete(coupon._id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 20px', fontSize: '16px', marginRight: '10px' }}>Delete</button>
              <button onClick={() => handleApplyCoupon(coupon)} style={{ padding: '10px 20px', fontSize: '16px' }}>Apply Coupon</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
        </Layout>
  );
};

export default CouponForm;
