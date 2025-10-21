import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Create an Account</h1>
        <input placeholder="Full Name" style={styles.input} />
        <input placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <button style={styles.primary}>Sign Up</button>
        <p style={{ marginTop: 20 }}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #00b4d8, #0077b6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    borderRadius: 10,
    padding: "2rem",
    width: 340,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  primary: {
    width: "100%",
    background: "#0077b6",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 0",
    cursor: "pointer",
  },
  link: { color: "#0077b6", cursor: "pointer", fontWeight: "bold" },
};