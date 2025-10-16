import React, { useEffect, useState } from "react";
import Login from "./components/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const domain = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
  const clientId = "1gd98lgt6jqtletgio0e2us33n"; // ✅ your public client ID
  const redirectUri = "https://dodyqytcfhwoe.cloudfront.net/";
  const tokenEndpoint = `${domain}/oauth2/token`;

  // Helper to extract query parameters (like ?code=xxxx)
  const getCodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("code");
  };

  // Exchange authorization code for tokens
  const exchangeCodeForToken = async (code) => {
    try {
      const data = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
      });

      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data.toString(),
      });

      if (!response.ok) {
        console.error("Token exchange failed:", await response.text());
        return;
      }

      const tokens = await response.json();
      console.log("Tokens received:", tokens);

      // Store ID token and Access token
      localStorage.setItem("id_token", tokens.id_token);
      localStorage.setItem("access_token", tokens.access_token);

      // Decode ID token to extract email (optional)
      const userPayload = JSON.parse(atob(tokens.id_token.split(".")[1]));
      setUserEmail(userPayload.email || "User");

      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, "/"); // clean URL
    } catch (error) {
      console.error("Error during token exchange:", error);
    }
  };

  // Logout function
  const handleLogout = () => {
    const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      redirectUri
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

    // Clear local session
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");

    // Redirect to Cognito logout
    window.location.href = logoutUrl;
  };

  // On mount, check for existing code or session
  useEffect(() => {
    const code = getCodeFromUrl();

    if (code) {
      exchangeCodeForToken(code);
    } else {
      const token = localStorage.getItem("id_token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || "User");
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {!isAuthenticated ? (
        <Login />
      ) : (
        <div
          style={{
            background: "#f9f9f9",
            display: "inline-block",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ color: "#1b4332" }}>✅ Logged in successfully!</h2>
          <p>
            Welcome, <strong>{userEmail}</strong> 🎉
          </p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#d62828",
              color: "#fff",
              border: "none",
              padding: "10px 25px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              marginTop: "10px",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;