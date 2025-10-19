import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Dashboard() {
  const { user, handleLogout } = useAuth();

  return (
    <div style={styles.container}>
      <h1>Welcome, {user?.name || "Learner"} 👋</h1>
      <p>You are now logged in to Lotus LMS!</p>
      <button style={styles.btn} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: { textAlign: "center", paddingTop: "10vh" },
  btn: { padding: "10px 20px", background: "#0077b6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
};