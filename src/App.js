import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const domain = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
  const clientId = "1gd98lgt6jqtletgio0e2us33n";
  const redirectUri = "https://dodyqytcfhwoe.cloudfront.net/";
  const tokenEndpoint = `${domain}/oauth2/token`;

  const getQueryParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  };

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
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data.toString(),
      });

      if (!response.ok) {
        console.error("Token exchange failed:", await response.text());
        return;
      }

      const tokens = await response.json();
      localStorage.setItem("id_token", tokens.id_token);
      localStorage.setItem("access_token", tokens.access_token);

      const payload = JSON.parse(atob(tokens.id_token.split(".")[1]));
      setUserEmail(payload.email || "User");
      setIsAuthenticated(true);
      window.history.replaceState({}, document.title, "/");
    } catch (err) {
      console.error("Error exchanging token:", err);
    }
  };

  const handleLogout = () => {
    // clear local session
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    sessionStorage.clear();
    setIsAuthenticated(false);
    setIsLoggedOut(true);

    const isLocal = window.location.hostname === "localhost";
    const redirectUri = isLocal
      ? "http://localhost:3000/"
      : "https://dodyqytcfhwoe.cloudfront.net/";

    const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      redirectUri
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&state=${Date.now()}`;

    // Redirect via clear-session.html
    const clearSessionUrl = `${redirectUri}clear-session.html?logout_url=${encodeURIComponent(
      logoutUrl
    )}`;

    console.log("Redirecting via:", clearSessionUrl);
    window.location.href = clearSessionUrl;
  };

  useEffect(() => {
    const code = getQueryParam("code");
    if (code) {
      exchangeCodeForToken(code);
    } else {
      const token = localStorage.getItem("id_token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          setUserEmail(payload.email || "User");
          setIsAuthenticated(true);
        } catch {
          localStorage.clear();
        }
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
        window.location.pathname === "/signup" ? (
          <Signup />
        ) : isLoggedOut ? (
          <div>
            <h2>👋 You’ve been logged out!</h2>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                backgroundColor: "#0077b6",
                color: "#fff",
                padding: "10px 25px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <Login />
        )
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