import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // add useNavigate
import { useAuth } from "../auth/AuthProvider";
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ap-south-1_6C5lP9yfm",
  ClientId: "49gusp4sidkggc371vghtdvujb",
};

const userPool = new CognitoUserPool(poolData);

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // <- add

  const [identifier, setIdentifier] = useState("");  // Can be username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user) {
    // client-side navigation avoids asking the server for /dashboard
    navigate("/dashboard");
    return null;
  }

  const handleEmailPasswordSignIn = (e) => {
    e.preventDefault();
    setError("");

    const userData = {
      Username: identifier,  // Can be username or email (alias)
      Pool: userPool,
    };

    const authDetails = new AuthenticationDetails({
      Username: identifier,
      Password: password,
    });

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        console.log("Login success!", result);
        // use client-side navigation
        navigate("/dashboard");
      },
      onFailure: (err) => {
        console.error("Login error:", err);
        if (err.code === 'UserNotConfirmedException') {
          setError(
            "Please verify your email address first. Check your inbox for a verification link."
          );
        } else {
          setError(err.message || "Failed to login. Please try again.");
        }
      },
    });
  };

  const handleGoogleSignIn = () => {
    const DOMAIN = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
    const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";
    const CLIENT_ID = "49gusp4sidkggc371vghtdvujb";

    const url = `https://${DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}&identity_provider=Google`;
    window.location.href = url;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Lotus LMS</h1>
        <p>Sign in to continue</p>
        
        <form onSubmit={handleEmailPasswordSignIn}>
          <input 
            type="text"  // Changed to text to accept both email and username
            placeholder="Username or Email" 
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign in</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="divider">OR</div>
        
        <button className="google-btn" onClick={handleGoogleSignIn}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
          />
          Sign in with Google
        </button>
        
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;