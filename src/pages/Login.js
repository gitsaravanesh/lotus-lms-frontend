import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const Login = () => {
  const { user } = useAuth();

  if (user) {
    window.location.href = "/dashboard";
  }

  const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
  const DOMAIN = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
  const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";

  const handleGoogleSignIn = () => {
    const url = `https://${DOMAIN}/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}&identity_provider=Google`;
    window.location.href = url;
  };

  const handleEmailSignIn = () => {
    const url = `https://${DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${REDIRECT_URI}`;
    window.location.href = url;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Lotus LMS</h1>
        <p>Sign in to continue</p>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button onClick={handleEmailSignIn}>Sign in</button>
        <div className="divider">OR</div>
        <button className="google-btn" onClick={handleGoogleSignIn}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google"
          />
          Sign in with Google
        </button>
        <p>
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;