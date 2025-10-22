import React, { useState } from "react";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { Link } from "react-router-dom";

const poolData = {
  UserPoolId: "ap-south-1_Tslt1HUCC", // 🔁 replace with your Cognito User Pool ID
  ClientId: "1gd98lgt6jqtletgio0e2us33n", // 🔁 your App Client ID
};

const userPool = new CognitoUserPool(poolData);

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Cloud");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailSignup = (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const attributeList = [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "custom:interestedTopic", Value: topic },
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.error("Signup error:", err);
        setError(err.message || "Signup failed. Please try again.");
        return;
      }

      console.log("Signup success:", result);
      setMessage("Signup successful! Please check your email to verify your account.");
    });
  };

  // Existing Google signup (works fine)
  const handleGoogleSignup = () => {
    const DOMAIN = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
    const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";
    const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";

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
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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
            placeholder="Password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Interested Topics</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>Cloud</option>
            <option>AI</option>
            <option>Full Stack</option>
            <option>Testing</option>
          </select>
          <button type="submit">Sign Up</button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogleSignup}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
          />
          Sign up with Google
        </button>

        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <p>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;