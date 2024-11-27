import React, { useEffect, useState } from "react";
import { Button, Input } from "antd"; // Import Input component from Ant Design
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Modal } from "antd";
import { BsCart4 } from "react-icons/bs";
import { Link } from "react-router-dom";

const Employeemangers = () => {
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for live search term

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8085/api/v1/auth/admin/roles");
      setUsers(response.data.usersRole1.concat(response.data.usersRole2));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleViewMore = (user) => {
    setSelectedUser(user);
    setVisible(true);
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

  const handleLoadMore = () => {
    setShowAllUsers(true);
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-12">
          <h1>Employee Managers</h1>
          <Input
            placeholder="Search by name"
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
            className="mb-3"
          />
          <Button type="primary" onClick={handleDownloadPDF} className="mb-3">
            Download as PDF
          </Button>
          <Link to="/dashboard/admin/email">
            <Button>Send Email</Button>
          </Link>
          <div id="user-table">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {showAllUsers
                  ? filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button onClick={() => handleViewMore(user)}>View More</Button>
                        </td>
                      </tr>
                    ))
                  : filteredUsers.slice(0, 3).map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <Button onClick={() => handleViewMore(user)}>View More</Button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
          {!showAllUsers && (
            <div className="text-center">
              <Button type="primary" onClick={handleLoadMore}>
                Load More
              </Button>
            </div>
          )}
          <Modal
            title="Employee Manager Details"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={[
              <Button key="back" onClick={() => setVisible(false)}>
                Close
              </Button>,
            ]}
          >
            {selectedUser && (
              <div>
                <p>Name: {selectedUser.name}</p>
                <p>Email: {selectedUser.email}</p>
                <p>Role: Employee Manager</p>
                <p>Address: {selectedUser.address}</p>
                <p>Phone: {selectedUser.phone}</p>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Employeemangers;
