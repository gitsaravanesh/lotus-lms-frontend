import React from "react";
import { Auth } from "aws-amplify";

const Login = () => {
  const signInWithGoogle = () => {
    Auth.federatedSignIn({ provider: "Google" });
  };

  const signInWithEmail = () => {
    Auth.federatedSignIn(); // Opens Cognito hosted login
  };

  return (
    <div style={styles.container}>
      <h2>Login to your LMS Account</h2>
      <button style={styles.buttonGoogle} onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <button style={styles.buttonEmail} onClick={signInWithEmail}>
        Sign in with Email
      </button>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "40px",
  },
  buttonGoogle: {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#DB4437",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonEmail: {
    padding: "10px 20px",
    margin: "10px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Login;