import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import EmployeeMangerMenu from "../../components/Layout/EmployeeMangerMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import EmployeeDistribution from "./EmployeeDistribution.js";
import AttendanceCountChart from "./AttendanceCountChart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


const EmployeeManagerProfileDashboard = () => {
  const [auth] = useAuth();
  const [totalEmployeeCount, setTotalEmployeeCount] = useState(0);
  const [hardwareEmployeeCount, setHardwareEmployeeCount] = useState(0);
  const [softwareEmployeeCount, setSoftwareEmployeeCount] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/auth/employee/totalcount")
      .then((response) => {
        console.log("Total Employee Count Response:", response.data);
        setTotalEmployeeCount(response.data.employeeCount);
      })
      .catch((error) => {
        console.error("Error fetching total employee count:", error);
        setTotalEmployeeCount(0);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/v1/auth/hardware-employee/count")
      .then((response) => {
        console.log("Hardware Employee Count Response:", response.data);
        setHardwareEmployeeCount(response.data.hardwareEmployeeCount);
      })
      .catch((error) => {
        console.error("Error fetching hardware employee count:", error);
        setHardwareEmployeeCount(0);
      });
  }, []);

  useEffect(() => {
    axios
      .get("/api/v1/auth/software-employee/count")
      .then((response) => {
        console.log("Software Employee Count Response:", response.data);
        setSoftwareEmployeeCount(response.data.softwareEmployeeCount);
      })
      .catch((error) => {
        console.error("Error fetching software employee count:", error);
        setSoftwareEmployeeCount(0);
      });
  }, []);

  const handleDownload = () => {
    const pdf = new jsPDF();
    const chart1 = document.getElementById("employeeDistribution");
    const chart2 = document.getElementById("attendanceCountChart");

    // Find the canvas elements inside the chart divs
    const chart1Canvas = chart1.querySelector("canvas");
    const chart2Canvas = chart2.querySelector("canvas");

    // Add header for pie chart
    pdf.text("Employee Distribution", 70, 10, null, null, "center");
    // Convert pie chart to image and add to PDF
    const imgData1 = chart1Canvas.toDataURL("image/png");
    pdf.addImage(imgData1, "PNG", 10, 20, 90, 80); // Adjust position and size as needed

    // Add header for line chart
    pdf.text("Attendance Count", 70, 110, null, null, "center");
    // Convert line chart to image and add to PDF
    const imgData2 = chart2Canvas.toDataURL("image/png");
    pdf.addImage(imgData2, "PNG", 10, 120, 90, 80); // Adjust position and size as needed

    // Add header for employee manager information
    pdf.text("Employee Manager Information", 70, 210, null, null, "center");

    // Add details from the page
    const userDetails = [
      `Name: ${auth?.user?.name}`,
      `Email: ${auth?.user?.email}`,
      `Address: ${auth?.user?.address}`,
      `Contact: ${auth?.user?.phone}`
    ].join("\n");
    const totalEmployees = `Total Employees: ${totalEmployeeCount}`;
    const hardwareEmployees = `Hardware Employees: ${hardwareEmployeeCount}`;
    const softwareEmployees = `Software Employees: ${softwareEmployeeCount}`;

    pdf.text(userDetails, 10, 220);
    pdf.text(totalEmployees, 10, 270);
    pdf.text(hardwareEmployees, 10, 280);
    pdf.text(softwareEmployees, 10, 290);

    pdf.save("report.pdf");
  };

  return (
    <Layout>
      <div className="container-fluid p-3">
        <div className="row">
          <div className="col-md-3">
            <EmployeeMangerMenu />
          </div>
          <div className="col-md-9">
       
              <div className="card mb-4 border border-primary rounded hover-shadow" style={{ backgroundColor: "#d3e0dc" }}>
                <div className="card-body">
                  <h3 className="card-title">Employee Manager Information</h3>
                  <p className="card mb-4 animate__animated">
                    <div style={{ textAlign: 'center', animation: 'bounceInDown 1s ease forwards' }}>
                      <h3 style={{ color: '#007bff', fontSize: '28px', animation: 'pulse 1.5s infinite' }}>Hello, {auth?.user?.name}!</h3>
                    </div>
                    <div><strong style={{ color: "#4f3f3e" }}>Name:</strong> {auth?.user?.name}</div>
                    <div><strong style={{ color: "#4f3f3e" }}>Email:</strong> {auth?.user?.email}</div>
                    <div><strong style={{ color: "#4f3f3e" }}>Address:</strong> {auth?.user?.address}</div>
                    <div><strong style={{ color: "#4f3f3e" }}>Contact:</strong> {auth?.user?.phone}</div>
                  </p>
                </div>
              </div>
        

            <div className="row">
              <div className="col-md-4">
                <div className="card mb-4 border border-primary rounded hover-shadow" style={{ backgroundColor: "#88e8dc" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Total Employees</h3>
                    <div className="d-flex justify-content-between align-items-center">
                      <FaUserAlt size={30} />
                      <span className="fw-bold">{totalEmployeeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4 border border-primary rounded hover-shadow" style={{ backgroundColor: "#fcd1d1" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Hardware Employees</h3>
                    <div className="d-flex justify-content-between align-items-center">
                      <FaUserAlt size={30} />
                      <span className="fw-bold">{hardwareEmployeeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4 border border-primary rounded hover-shadow" style={{ backgroundColor: "#fde780" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>Software Employees</h3>
                    <div className="d-flex justify-content-between align-items-center">
                      <FaUserAlt size={30} />
                      <span className="fw-bold">{softwareEmployeeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 text-center">
                <div id="employeeDistribution">
                  <EmployeeDistribution />
                </div>
              </div>
              <div className="col-md-6 text-center">
                <div id="attendanceCountChart">
                  <AttendanceCountChart />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="btn btn-primary" onClick={handleDownload}>Download Charts as PDF</button>
            </div>
          </div>
        </div>
        </div>
    </Layout>
  );
};

export default EmployeeManagerProfileDashboard;
