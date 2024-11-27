import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
const ViewUser = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/admin/users/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Error fetching user. Please try again."); // Set an error message
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>; // You can replace this with a loading spinner or any other indicator
  }

  if (error) {
    return <p>{error}</p>; // Display an error message
  }

  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>{user.name}'s Profile</h1>
            <p>Email: {user.email}</p>
            <p>Address: {user.address}</p>
            <p>Phone: {user.phone}</p>
            {/* Display other user details */}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewUser;
