// src/auth/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "./authService";
import { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI } from "./config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode JWT payload safely
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

  // Handle redirect after Cognito login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      exchangeCodeForToken(code)
        .then((tokens) => {
          localStorage.setItem("id_token", tokens.id_token);
          const payload = parseJwt(tokens.id_token);
          setUser({ name: payload.name || payload.email });
          window.history.replaceState({}, document.title, "/dashboard");
        })
        .catch((err) => console.error("Token exchange failed:", err))
        .finally(() => setLoading(false));
    } else {
      const token = localStorage.getItem("id_token");
      if (token) {
        const payload = parseJwt(token);
        setUser({ name: payload.name || payload.email });
      }
      setLoading(false);
    }
  }, [navigate]);

  // Sign in with Email/Password via Hosted UI
  const signInWithEmail = () => {
    window.location.href = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
  };

  // Sign in via Google
  const signInWithGoogle = () => {
    window.location.href = `${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=email+openid+profile`;
  };

  // Fully log out (Cognito + Google federated)
  const logout = () => {
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&federated=true`;

    localStorage.clear();
    setUser(null);
    window.location.href = logoutUrl; // Redirects to hosted logout page
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithEmail, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};