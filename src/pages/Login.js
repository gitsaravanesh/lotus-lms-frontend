// Login.js program
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { determineAndPersistUsername, fetchUserTenant } from "../auth/AuthProvider";
import { CognitoUser, AuthenticationDetails, CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: "ap-south-1_6C5lP9yfm",
  ClientId: "49gusp4sidkggc371vghtdvujb",
};

const userPool = new CognitoUserPool(poolData);

const Login = () => {
  const { user, setUser } = useAuth(); // ✅ Add setUser here
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Redirect only when user is available
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleEmailPasswordSignIn = (e) => {
    e.preventDefault();
    setError("");

    const userData = { Username: identifier, Pool: userPool };
    const authDetails = new AuthenticationDetails({
      Username: identifier,
      Password: password,
    });

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: async (result) => {
        console.log("✅ Login success!", result);
        
        // ✅ Store the ID token in localStorage
        const idToken = result.getIdToken().getJwtToken();
        localStorage.setItem("id_token", idToken);
        
        // ✅ Parse the token payload
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        
        // ✅ Determine and persist canonical username using shared helper
        const username = determineAndPersistUsername(payload, null);
        
        // ✅ Fetch tenant mapping
        const tenantMapping = await fetchUserTenant(username);
        
        if (!tenantMapping) {
          setError("Your account is not assigned to any organization. Please contact support at support@lotuslms.com");
          return;
        }
        
        // ✅ Update the user state in AuthProvider with name, username, email, tenant_id, and role
        setUser({ 
          name: payload.name || payload.email || identifier,
          username: username,
          email: payload.email,
          tenant_id: tenantMapping.tenant_id,
          role: tenantMapping.role
        });
        
        // Navigation will happen automatically via useEffect
      },
      onFailure: (err) => {
        console.error("❌ Login error:", err);
        if (err.code === "UserNotConfirmedException") {
          setError("Please verify your email address first.");
        } else if (err.code === "UserNotFoundException") {
          setError("Account not found. Try signing up first or use Google login.");
        } else if (err.code === "NotAuthorizedException") {
          setError("Incorrect username or password.");
        } else {
          setError(err.message || "Login failed. Please try again.");
        }
      },
    });
  };

  const handleGoogleSignIn = () => {
    const DOMAIN = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
    const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/";
    const CLIENT_ID = "5ppt7ntr3a3ckvc670v71h920r";

    // Use URLSearchParams to properly encode parameters
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      scope: 'email openid profile',  // Space-separated scopes
      redirect_uri: REDIRECT_URI,
      identity_provider: 'Google'
    });

    const url = `https://${DOMAIN}/oauth2/authorize?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Lotus LMS</h1>
        <p>Sign in to continue</p>

        <form onSubmit={handleEmailPasswordSignIn}>
          <input
            type="text"
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
          <img src="https://www.google.com/favicon.ico" alt="Google" />
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
