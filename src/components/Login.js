import React, { useState } from "react";
import { Auth } from "aws-amplify";
import EmailLogin from "./EmailLogin";

const Login = () => {
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await Auth.federatedSignIn({ provider: "Google" });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        background: "#fff",
        padding: "40px",
        borderRadius: "15px",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Lotus LMS Platform</h2>

      {!showEmailLogin ? (
        <>
          <button
            onClick={handleGoogleLogin}
            style={{
              margin: "10px",
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              background: "#4285F4",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Sign in with Google
          </button>
          <br />
          <button
            onClick={() => setShowEmailLogin(true)}
            style={{
              margin: "10px",
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              background: "#444",
              color: "white",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Sign in with Email
          </button>
        </>
      ) : (
        <EmailLogin />
      )}
    </div>
  );
};

export default Login;