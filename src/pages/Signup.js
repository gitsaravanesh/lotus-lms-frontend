import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
  const DOMAIN = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
  const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";

  const handleGoogleSignUp = () => {
    const url = `https://${DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}&identity_provider=Google`;
    window.location.href = url;
  };

  const handleEmailSignUp = () => {
    const url = `https://${DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
    window.location.href = url;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Create Account</h1>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <label>Interested topics:</label>
        <select>
          <option>Cloud</option>
          <option>AI</option>
          <option>Full Stack</option>
          <option>Testing</option>
        </select>
        <button onClick={handleEmailSignUp}>Sign up</button>
        <div className="divider">OR</div>
        <button className="google-btn" onClick={handleGoogleSignUp}>
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