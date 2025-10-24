import React, { useState } from "react";
import { CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { Link } from "react-router-dom";

const poolData = {
  UserPoolId: "ap-south-1_6C5lP9yfm", // 🔁 replace with your Cognito User Pool ID
  ClientId: "49gusp4sidkggc371vghtdvujb", // 🔁 your App Client ID
};

const userPool = new CognitoUserPool(poolData);

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Add confirm password
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignup = (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Password validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const attributeList = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    if (topic && topic !== "") {
      try {
        attributeList.push(
          new CognitoUserAttribute({ 
            Name: "custom:interest",
            Value: topic 
          })
        );
      } catch (err) {
        console.warn("Failed to add custom attribute:", err);
      }
    }

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        console.error("Signup error:", err);
        setError(err.message || "Signup failed. Please try again.");
        return;
      }

      console.log("Signup success:", result);
      setMessage("Signup successful! Please check your email for a verification link.");
    });
  };

  // Existing Google signup (works fine)
  const handleGoogleSignup = () => {
    const DOMAIN = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
    const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";
    const CLIENT_ID = "49gusp4sidkggc371vghtdvujb";

    const url = `https://${DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}&identity_provider=Google`;
    window.location.href = url;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create Account</h1>
        <form onSubmit={handleEmailSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
          <label>Interested Topics (Optional)</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Select a topic</option>
            <option value="Cloud">Cloud</option>
            <option value="AI">AI</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Testing">Testing</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}

        <div className="divider">OR</div>
        
        <button className="google-btn" onClick={handleGoogleSignup}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
          />
          Sign up with Google
        </button>
        
        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;