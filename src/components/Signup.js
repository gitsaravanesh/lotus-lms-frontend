// src/components/Signup.js
import React from "react";
import { useNavigate } from "react-router-dom";

/* Update if needed */
const COGNITO_DOMAIN = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";

export default function Signup() {
  const navigate = useNavigate();

  const signupWithEmail = () => {
    const url = `${COGNITO_DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
    window.location.href = url;
  };

  const signupWithGoogle = () => {
    const url = `${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
    window.location.href = url;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create your account</h2>
        <p style={{ color: "#666" }}>Sign up with your email or a Google account</p>

        <button onClick={signupWithEmail} style={styles.buttonPrimary}>
          Sign Up with Email
        </button>

        <button onClick={signupWithGoogle} style={styles.buttonGoogle}>
          Sign Up with Google
        </button>

        <div style={{ marginTop: 18 }}>
          <button onClick={() => navigate("/")} style={styles.linkBtn}>
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f7fa" },
  card: { padding: 28, borderRadius: 10, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.06)", textAlign: "center" },
  buttonPrimary: { display: "block", width: 280, margin: "10px auto", padding: "10px 20px", background: "#0077b6", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  buttonGoogle: { display: "block", width: 280, margin: "10px auto", padding: "10px 20px", background: "#db4437", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" },
  linkBtn: { background: "none", border: "none", color: "#0077b6", textDecoration: "underline", cursor: "pointer" },
};