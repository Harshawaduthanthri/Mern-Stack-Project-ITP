import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import EmployeeMangerMenu from "../../components/Layout/EmployeeMangerMenu";
import { Button } from "antd";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toast styles

const AttendanceManager = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [date, setDate] = useState(""); // Initialize with empty string

  // Define formatDate function before it's used
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/api/v1/auth/all-employees");
      setEmployees(response.data.employees);
      setLoading(false);
      // Set current date after fetching employees
      setCurrentDate(new Date().toISOString().split("T")[0]);
      setDate(formatDate(new Date())); // Initialize date with formatted current date
    } catch (error) {
      console.error("Error fetching employees:", error);
      setLoading(false);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCheckboxChange = (employeeId) => {
    const isSelected = selectedEmployees.includes(employeeId);
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleSaveAttendance = async () => {
    try {
      const response = await axios.post('/api/v1/attendance/saveAttendance', {
        date,
        employees: selectedEmployees,
      });
      console.log('Attendance saved successfully:', response.data);
      setSelectedEmployees([]);
      setDate(formatDate(new Date())); // Reset date to current date
      // Show toast notification for successful attendance marking
      toast.success("Attendance marked successfully!", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
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
              <h1>Mark Attendance</h1>

              <input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="form-control mb-3"
              />

              <div>
                <label htmlFor="dateInput">Date:</label>
                <input
                  type="date"
                  id="dateInput"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control mb-3"
                  min={currentDate} // Set min date to current date
                />
              </div>

              <table className="table" id="allEmployees">
                <thead>
                  <tr style={{ backgroundColor: "#929ba3" }}>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Profession</th>
                    <th>Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.profession}</td>
                      <td>
                        <input
                          type="checkbox"
                          id={employee._id}
                          checked={selectedEmployees.includes(employee._id)}
                          onChange={() => handleCheckboxChange(employee._id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Button type="primary" onClick={handleSaveAttendance} className="mb-3">
                Save Attendance
              </Button>
              <ToastContainer /> {/* Toast container */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AttendanceManager;
