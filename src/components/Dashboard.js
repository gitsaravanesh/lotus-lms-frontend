// src/components/Dashboard.js
import React from "react";

const COGNITO_DOMAIN = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net";

function Dashboard() {
  const handleLogout = () => {
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${REDIRECT_URI}&response_type=code&redirect_uri=${REDIRECT_URI}`;
    window.location.href = logoutUrl;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>✅ Logged in successfully!</h2>
        <p>Welcome, user 🎉</p>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",
  },
  card: {
    textAlign: "center",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  logoutBtn: {
    backgroundColor: "#c1121f",
    color: "white",
    padding: "10px 25px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
  },
};

export default Dashboard;