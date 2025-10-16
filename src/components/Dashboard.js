// src/components/Dashboard.js
import React from "react";

export default function Dashboard({ user, handleLogout }) {
  // user may be passed as prop (decoded ID token) OR read from localStorage
  let displayName = "User";
  if (user?.email) displayName = user.email;
  else {
    const idToken = localStorage.getItem("id_token");
    if (idToken) {
      try {
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        displayName = payload.email || payload.name || "User";
      } catch {}
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>✅ Logged in</h2>
        <p>Welcome, <strong>{displayName}</strong></p>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f7fa" },
  card: { padding: 28, borderRadius: 10, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", textAlign: "center" },
  logoutBtn: { backgroundColor: "#c1121f", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 6, cursor: "pointer" },
};