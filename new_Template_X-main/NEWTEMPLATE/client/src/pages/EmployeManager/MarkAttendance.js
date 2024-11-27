// MarkAttendance.js

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import EmployeeMangerMenu from "../../components/Layout/EmployeeMangerMenu.js";


const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMarkAttendance = async (employeeId, status) => {
    try {
      await axios.post("/api/v1/mark/markAttendance", { employeeId, status });
      console.log("Attendance marked successfully");
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const handleSubmit = async (employeeId) => {
    try {
      // Call the submitAttendance endpoint with the employee ID and status
      await axios.patch("/api/v1/mark/submitAttendance", {
        employeeId,
        status: "present", // Set the status as "present" for the example, you can change it as needed
      });
      console.log("Attendance submitted successfully");
    } catch (error) {
      console.error("Error submitting attendance:", error);
    }
  };
  

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title={"All Employees"}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <EmployeeMangerMenu />
          </div>
          <div className="col-md-9">
            <div className="container-fluid m-3 p-3">
              <h1>Employee Attendance</h1>
              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="form-control mb-3"
              />

              {loading ? (
                <p>Loading...</p>
              ) : (
                <table className="table table-striped table-bordered">
  <thead className="thead-dark">
    <tr style={{ backgroundColor: "#929ba3" }}>
      <th>Name</th>
      <th>Email</th>
      <th>Address</th>
      <th>Profession</th>
      <th>Mark Attendance</th>
      <th>Submit</th>
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
          <select
            className="form-select"
            onChange={(event) =>
              handleMarkAttendance(employee._id, event.target.value)
            }
          >
            <option value="present" className="bg-success text-light">Present</option>
            <option value="absent" className="bg-danger text-light">Absent</option>
            <option value="late" className="bg-warning text-dark">Late</option>
          </select>
        </td>
        <td>
        <button
  onClick={() => handleSubmit(employee._id)}
  className="btn theme-btn-1 btn-effect-1 text-uppercase"
>
  Submit
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

export default MarkAttendance;
