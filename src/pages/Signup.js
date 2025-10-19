import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1>Sign up for Lotus LMS</h1>
        <input placeholder="Full name" style={styles.input} />
        <input placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />
        <select style={styles.input}>
          <option value="">Interested in...</option>
          <option>Cloud</option>
          <option>AI</option>
          <option>Full Stack</option>
          <option>Testing</option>
        </select>
        <button style={styles.primary}>Create Account</button>
        <p style={styles.footer}>
          Already have an account?{" "}
          <span onClick={() => navigate("/")} style={styles.link}>
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
    width: 360,
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
    fontSize: 15,
    cursor: "pointer",
  },
  footer: { marginTop: 20 },
  link: { color: "#0077b6", cursor: "pointer", fontWeight: "bold" },
};