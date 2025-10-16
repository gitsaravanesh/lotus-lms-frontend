// src/components/Login.js
import React from "react";
import { useNavigate } from "react-router-dom";

const COGNITO_DOMAIN = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
    window.location.href = loginUrl;
  };

  const handleGoogleLogin = () => {
    const googleUrl = `${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&redirect_uri=${REDIRECT_URI}&response_type=CODE&client_id=${CLIENT_ID}&scope=email+openid+profile`;
    window.location.href = googleUrl;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: "1.5rem" }}>LMS Platform Login</h2>

        <button onClick={handleLogin} style={styles.emailBtn}>
          Sign in with Email
        </button>
        <br />

        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          Sign in with Google
        </button>

        <p style={{ marginTop: "1.5rem" }}>
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            style={styles.linkBtn}
          >
            Sign Up
          </button>
        </p>
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
  emailBtn: {
    backgroundColor: "#0077b6",
    color: "white",
    padding: "10px 25px",
    border: "none",
    borderRadius: "5px",
    marginBottom: "15px",
    cursor: "pointer",
  },
  googleBtn: {
    backgroundColor: "#db4437",
    color: "white",
    padding: "10px 25px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#0077b6",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Login;