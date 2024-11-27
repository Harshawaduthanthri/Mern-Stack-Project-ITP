import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import UserManagerMenu from "../../components/Layout/UserManagerMenu";
import { toast } from 'react-toastify';

const Umroles = () => {
  const [users, setUsers] = useState([]);
  const [showUsermanagerMenu, setShowUsermanagerMenu] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/usermanager/roles"
      );
      setUsers(response.data.users);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users. Please try again later.");
      setLoading(false);
    }
  };
/*
  const handleEditRole = (userId) => {
    const roleOptions = ["User", "Admin", "EmployeeManager"];
    const selectedRole = window.prompt(
      "Select new role:\n\n" +
        roleOptions.map((option, index) => `${index}= ${option}`).join("\n")
    );

    if (selectedRole !== null) {
      const parsedRole = parseInt(selectedRole, 10);
      if (![0, 1, 2].includes(parsedRole)) {
        alert("Invalid role value. Must be 0, 1, or 2.");
      } else {
        updateRole(userId, parsedRole);
      }
    }
  };

  const updateRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/v1/auth/usermanager/roles/${userId}`, {
        role: newRole,
      });
      fetchUsers();
      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role. Please try again later.");
    }
  };
  */
/*
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`/api/v1/auth/usermanager/roles/delete/${userId}`);
        fetchUsers();
        toast.success("User deleted successfully.");
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user. Please try again later.");
      }
    }
  };
*/
  const toggleMenu = () => {
    setShowUsermanagerMenu(!showUsermanagerMenu);
  };

  const handleUserActivation = async (userId, isActive) => {
    try {
      const response = await axios.put(`/api/v1/auth/${isActive ? "activate" : "deactivate"}/${userId}`);
      if (response.status === 200) {
        fetchUsers();
        toast.success(`User ${isActive ? "activated" : "deactivated"} successfully.`);
      } else {
        toast.error("Failed to update user activation status.");
      }
    } catch (error) {
      console.error("Error updating user activation status:", error);
      toast.error("Failed to update user activation status. Please try again later.");
    }
  };
  const handleDownloadPDF = () => {
    const input = document.getElementById("user-table");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save("users.pdf");
    });
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredUsers =
    users &&
    users.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Layout title={"Dashboard - All Roles"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <button onClick={toggleMenu} className="btn btn-primary mb-3">
              Toggle Menu
            </button>
            {showUsermanagerMenu && <UserManagerMenu />}
          </div>
          <div className={`col-md-${showUsermanagerMenu ? "9" : "12"}`}>
            <h1>All Roles</h1>
            <Button type="primary" onClick={handleDownloadPDF} className="mb-3">
              Download as PDF
            </Button>
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={handleSearchInputChange}
              className="form-control mb-3"
            />
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div id="user-table" className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead className="thead-dark">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Admin/Employee</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers &&
                      filteredUsers.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.address}</td>
                          <td>
                            {user.role === 1
                              ? "Admin"
                              : user.role === 2
                              ? "EmployeeManager"
                              : user.role === 3
                              ? "Employee"
                              : "User"}
                          </td>
                          <td>
                            <button
                              className={`btn ${user.isActive ? "btn-success" : "btn-danger"} btn-sm`}
                              onClick={() => handleUserActivation(user._id, !user.isActive)}
                            >
                              {user.isActive ? "Activate" : "Deactivate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Umroles;
