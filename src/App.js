import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

/*
  CONFIG - update these if they differ
  - COGNITO_DOMAIN: your Cognito hosted domain (no trailing slash)
  - CLIENT_ID: Cognito App Client (public, no secret)
  - REDIRECT_URI: your CloudFront S3 website root WITH trailing slash
*/
const COGNITO_DOMAIN = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
const CLIENT_ID = "1gd98lgt6jqtletgio0e2us33n";
const REDIRECT_URI = "https://dodyqytcfhwoe.cloudfront.net/"; // trailing slash required
const TOKEN_ENDPOINT = `${COGNITO_DOMAIN}/oauth2/token`;

function AppRoutesWrapper() {
  // small wrapper to use navigate if needed later
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppHome() {
  // top-level app state: authenticated + user info
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // helper: get query param
  const getQuery = (key) => new URLSearchParams(window.location.search).get(key);

  // token exchange: authorization code -> tokens
  const exchangeCodeForTokens = async (code) => {
    try {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        code,
      });

      const res = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Token exchange failed:", res.status, text);
        return;
      }

      const tokens = await res.json();
      // persist tokens
      localStorage.setItem("id_token", tokens.id_token);
      localStorage.setItem("access_token", tokens.access_token);
      if (tokens.refresh_token) localStorage.setItem("refresh_token", tokens.refresh_token);

      // decode ID token (base64 payload) to extract user info
      try {
        const payload = JSON.parse(atob(tokens.id_token.split(".")[1]));
        setUser(payload);
      } catch (e) {
        console.warn("Failed to decode ID token", e);
      }

      setIsAuthenticated(true);
      // clean up url
      window.history.replaceState({}, document.title, window.location.pathname);
      // navigate to dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("exchangeCodeForTokens error:", err);
    }
  };

  // check on load: code param or existing tokens
  useEffect(() => {
    const code = getQuery("code");
    if (code) {
      exchangeCodeForTokens(code);
      return;
    }

    // existing token?
    const idToken = localStorage.getItem("id_token");
    if (idToken) {
      try {
        const payload = JSON.parse(atob(idToken.split(".")[1]));
        setUser(payload);
        setIsAuthenticated(true);
      } catch {
        // invalid token — remove it
        localStorage.removeItem("id_token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
  }, []); // run once

  // logout handler: clears local storage and forces staged logout via clear-session.html
  const handleLogout = () => {
    // clear local session
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.clear();

    // build Cognito logout url
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${Date.now()}`;

    // redirect to our clear-session helper which will redirect to Cognito logout
    const clearSessionUrl = `${REDIRECT_URI}clear-session.html?logout_url=${encodeURIComponent(logoutUrl)}`;

    // go there
    window.location.href = clearSessionUrl;
  };

  // if authenticated, show dashboard (router will land on /dashboard too)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace state={{ user, handleLogout }} />;
  }

  // otherwise, show Login component (it will navigate to signup as needed)
  return <Login />;
}

function DashboardPage() {
  // read tokens / id token from localStorage
  const idToken = localStorage.getItem("id_token");
  let user = null;
  try {
    if (idToken) user = JSON.parse(atob(idToken.split(".")[1]));
  } catch (e) {
    // invalid token
    user = null;
  }

  // Provide handleLogout to dashboard component
  const handleLogout = () => {
    // Clear local storage, redirect via clear-session.html
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    sessionStorage.clear();

    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&state=${Date.now()}`;

    const clearSessionUrl = `${REDIRECT_URI}clear-session.html?logout_url=${encodeURIComponent(logoutUrl)}`;
    window.location.href = clearSessionUrl;
  };

  // If not logged in, redirect to home
  if (!user) return <Navigate to="/" replace />;

  return <Dashboard user={user} handleLogout={handleLogout} />;
}

export default function App() {
  return (
    <Router>
      <AppRoutesWrapper />
    </Router>
  );
}