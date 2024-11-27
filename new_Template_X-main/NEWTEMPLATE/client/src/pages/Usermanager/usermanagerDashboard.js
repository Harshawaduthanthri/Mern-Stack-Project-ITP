import React, { useEffect, useRef } from "react";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import UserManagerMenu from "../../components/Layout/UserManagerMenu";
import UserRegistrationChart from "./UserRegistrationChart";
import PieChartUsers from "./PieChartUsers";
import "animate.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const UsermanagerDashboard = () => {
  const [auth] = useAuth(); // Use the useAuth hook to access authentication data
  const contentRef = useRef(null);

  const styles = {
    card: {
      // Add your inline styles for the card here
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      marginTop: "20px",
      textAlign: "center",
      maxWidth: "600px",
      margin: "auto",
    },
  };

  const generatePdf = () => {
    const input = contentRef.current;
  
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  
      // Save the generated PDF as a downloadable file
      pdf.save("user_manager_dashboard.pdf");
    });
  };
  
  

  useEffect(() => {
    generatePdf(); // Generate PDF on component mount (you can trigger this on button click instead)
  }, []);

  return (
    <Layout title={"Dashboard - Ecommerce App"}>
      <div className="container-fluid m-3 p-3 dashboard" ref={contentRef}>
        <div className="row">
          <div className="col-md-3">
            <UserManagerMenu />
          </div>
          <div className="col-md-9">
            <div className="welcome-header animate__animated animate__slideInDown">
              <h2>Welcome {auth?.user?.name}!</h2>
            </div>
            <div className="card w-75 p-3 animate__animated animate__fadeIn" style={styles.card}>
              <strong>Name: {auth?.user?.name}</strong>
              <br />
              <strong>Email: {auth?.user?.email}</strong>
              <br />
              <strong>Contact: {auth?.user?.phone}</strong>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-4 border border-primary rounded" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>
                      User Registration data grouped by month
                    </h3>
                    <div className="col-md-12">
                      <UserRegistrationChart />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-4 border border-primary rounded" style={{ backgroundColor: "#e8f5fe" }}>
                  <div className="card-body">
                    <h3 className="card-title" style={{ color: "#007bff", marginBottom: "10px" }}>
                      User active and deactive chart
                    </h3>
                    <div className="col-md-12">
                      <PieChartUsers />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={generatePdf}>Download PDF</button>
    </Layout>
  );
};

export default UsermanagerDashboard;
