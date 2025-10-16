import React from "react";
import { useNavigate } from "react-router-dom";

const COGNITO_DOMAIN = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";

function Signup() {
  const navigate = useNavigate();

  // Signup via Cognito Hosted UI (Email)
  const handleEmailSignup = () => {
    const signupUrl = `${COGNITO_DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}`;
    window.location.href = signupUrl;
  };

  // Signup via Google (through Cognito Identity Provider)
  const handleGoogleSignup = () => {
    const googleUrl = `${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
    window.location.href = googleUrl;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Your Account</h2>
        <p style={{ color: "#555", marginBottom: "1.5rem" }}>
          Choose how you want to sign up
        </p>

        <button onClick={handleEmailSignup} style={styles.emailBtn}>
          Sign Up with Email
        </button>
        <br />
        <button onClick={handleGoogleSignup} style={styles.googleBtn}>
          Sign Up with Google
        </button>

        <p style={{ marginTop: "1.5rem" }}>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            style={styles.linkBtn}
          >
            Back to Login
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
    cursor: "pointer",
    marginBottom: "10px",
    width: "80%",
  },
  googleBtn: {
    backgroundColor: "#db4437",
    color: "white",
    padding: "10px 25px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "80%",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#0077b6",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Signup;