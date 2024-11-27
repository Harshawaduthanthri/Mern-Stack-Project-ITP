import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Button } from "antd";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAdminMenu, setShowAdminMenu] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/v1/auth/admin/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
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
      await axios.put(`/api/v1/auth/admin/users/role/${userId}`, {
        role: newRole,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleDeleteUser = (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      deleteUser(userId);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/v1/auth/admin/users/delete/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu);
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

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <Layout title={"Dashboard - All Users"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <button onClick={toggleAdminMenu} className="btn btn-primary mb-3">
              Toggle Admin Menu
            </button>
            {showAdminMenu && <AdminMenu />}
          </div>
          <div className={`col-md-${showAdminMenu ? '9' : '12'}`}>
            <h1>All Users</h1>
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
            <div id="user-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Admin/Employee</th>
                    <th>View</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
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
                        <Link
                          to={`/dashboard/admin/users/${user._id}`}
                          className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit"
                        >
                          <FaEye />
                        </Link>{" "}
                      </td>
                      <td>
                        <button
                          className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit"
                          onClick={() => handleEditRole(user._id)}
                        >
                          <FaEdit />
                        </button>{" "}
                      </td>
                      <td>
                        <button
                          className="btn theme-btn-1 btn-effect-1 text-uppercase" type="submit" style={{backgroundColor: '#ba2913', color: 'white'}}
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <FaTrash />
                        </button>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
