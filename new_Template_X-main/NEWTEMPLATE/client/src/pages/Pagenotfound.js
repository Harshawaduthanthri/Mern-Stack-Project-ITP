import React from "react";
import { Link } from "react-router-dom";
import Layout from "./../components/Layout/Layout";

const Pagenotfound = () => {
  const styles = {
    pnf: {
      textAlign: "center",
      marginTop: "100px",
    },
    pnfTitle: {
      fontSize: "5rem",
      color: "#e74c3c",
      marginBottom: "10px",
    },
    pnfHeading: {
      fontSize: "2rem",
      color: "#333",
      marginBottom: "100px",
    },
    pnfBtn: {
      display: "inline-block",
      padding: "10px 200px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#fff",
      backgroundColor: "#3498db",
      textDecoration: "none",
      borderRadius: "5px",
      transition: "background-color 0.3s",
    },
    pnfBtnHover: {
      backgroundColor: "#2980b9",
    },
  };

  return (
    <Layout title={"Go Back - Page Not Found"}>
      <div style={styles.pnf}>
        <h1 style={styles.pnfTitle}>404</h1>
        <h2 style={styles.pnfHeading}>Oops! Page Not Found</h2>
        <Link to="/" style={{ ...styles.pnfBtn, ...styles.pnfBtnHover }}>
          Go Back
        </Link>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
