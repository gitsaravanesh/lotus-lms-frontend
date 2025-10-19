import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>✅ Logged in successfully!</h2>
        <p>Welcome, {user?.name || "User"} 🎉</p>
        <button onClick={logout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f0f4f8",
  },
  card: {
    textAlign: "center",
    background: "#fff",
    padding: "2rem",
    borderRadius: 10,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  logout: {
    background: "#d00000",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "10px 20px",
    cursor: "pointer",
    marginTop: 20,
  },
};