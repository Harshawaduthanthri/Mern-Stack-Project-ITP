import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import EmployeeMangerMenu from "../../components/Layout/EmployeeMangerMenu";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "antd";

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/v1/auth/all-employees");
      setEmployees(response.data.employees);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/v1/auth/delete-employees/${employeeId}`);
        fetchEmployees(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById("allEmployees");
    if (input) {
      try {
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 0, 0);
        pdf.save("employees.pdf");
      } catch (error) {
        console.error("Error creating PDF:", error);
      }
    } else {
        console.error("Element with ID 'allEmployees' not found.");
    }
  };

  return (
    <Layout title={"All Employees"}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <EmployeeMangerMenu />
          </div>
          <div className="col-md-9">
            <div className="container-fluid mt-3">
              <h1 className="text-black">All Employees</h1>
              <Button type="primary" onClick={handleDownloadPDF} className="mb-3">
                Download as PDF
              </Button>
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control mb-3"
              />
              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="table table-bordered table-hover" id="allEmployees">
                  <thead className="table-primary">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Profession</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td>{employee.name}</td>
                        <td>{employee.email}</td>
                        <td>{employee.address}</td>
                        <td>{employee.profession}</td>
                        <td>
                          <Link to={`/dashboard/employee/edit/${employee._id}`} className="btn theme-btn-1 btn-effect-1 text-uppercase">
                            Edit
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm btn btn-effect-1 text-uppercase"
                            onClick={() => handleDeleteEmployee(employee._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllEmployees;
