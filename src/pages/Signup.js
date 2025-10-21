import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Signup() {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create your Lotus LMS Account</h1>
        <p style={styles.subtitle}>Join thousands of learners today</p>

        {/* Signup form */}
        <input placeholder="Full Name" style={styles.input} />
        <input placeholder="Email" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />

        {/* Interest dropdown */}
        <select style={styles.input}>
          <option value="">Interested in...</option>
          <option>Cloud</option>
          <option>AI</option>
          <option>Full Stack</option>
          <option>Testing</option>
        </select>

        {/* Signup button */}
        <button style={styles.primary}>Sign Up</button>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        {/* Signup via Google */}
        <button onClick={signInWithGoogle} style={styles.google}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={styles.googleIcon}
          />
          Sign up with Google
        </button>

        {/* Navigation to Sign-in */}
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
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: "2.5rem",
    width: 360,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    color: "#023e8a",
    fontSize: 22,
    marginBottom: 8,
  },
  subtitle: {
    color: "#555",
    fontSize: 14,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
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
  divider: {
    margin: "20px 0",
    borderBottom: "1px solid #ddd",
    position: "relative",
  },
  dividerText: {
    position: "absolute",
    top: "-12px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#fff",
    padding: "0 10px",
    fontSize: 12,
    color: "#777",
  },
  google: {
    width: "100%",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "12px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  googleIcon: { width: 20, height: 20 },
  footer: { marginTop: 20, fontSize: 14 },
  link: { color: "#0077b6", fontWeight: "bold", cursor: "pointer" },
};