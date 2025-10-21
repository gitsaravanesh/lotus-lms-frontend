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

        <input type="text" placeholder="Username" style={styles.input} />
        <input type="password" placeholder="Password" style={styles.input} />

        <button style={styles.primary} onClick={signInWithEmail}>
          Sign in
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerText}>OR</span>
        </div>

        <button style={styles.google} onClick={signInWithGoogle}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={styles.googleIcon}
          />
          Sign in with Google
        </button>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/signup")}>
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
    padding: "2rem",
    borderRadius: 12,
    width: 340,
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: { fontSize: 26, marginBottom: 10, color: "#023e8a" },
  subtitle: { color: "#555", marginBottom: 20 },
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
    padding: "10px 0",
    fontSize: 16,
    cursor: "pointer",
  },
  divider: { margin: "20px 0", borderBottom: "1px solid #ddd", position: "relative" },
  dividerText: {
    background: "#fff",
    padding: "0 10px",
    position: "absolute",
    top: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    color: "#777",
  },
  google: {
    width: "100%",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "10px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
  googleIcon: { width: 20, height: 20 },
  footer: { marginTop: 20, fontSize: 14 },
  link: { color: "#0077b6", fontWeight: "bold", cursor: "pointer" },
};