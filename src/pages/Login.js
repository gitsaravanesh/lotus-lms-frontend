import React from "react";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Lotus LMS</h1>
        <p style={styles.subtitle}>Sign in to continue</p>

        <button onClick={signInWithEmail} style={styles.primary}>
          Sign in with Email
        </button>

        <div style={styles.divider}>or</div>

        <button onClick={signInWithGoogle} style={styles.google}>
          Sign in with Google
        </button>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")} style={styles.link}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #0077b6, #00b4d8)",
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
  title: { color: "#023e8a", marginBottom: 10 },
  subtitle: { color: "#555", marginBottom: 25 },
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
  divider: { margin: "20px 0", color: "#aaa" },
  google: {
    width: "100%",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "12px 0",
    cursor: "pointer",
  },
  footer: { marginTop: 20, color: "#333" },
  link: { color: "#0077b6", cursor: "pointer", fontWeight: "bold" },
};