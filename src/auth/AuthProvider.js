// src/auth/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken, signOut } from "./authService";
import { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI } from "./config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Handle Cognito redirect with ?code=
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Exchange the code for tokens
      exchangeCodeForToken(code)
        .then((tokens) => {
          localStorage.setItem("id_token", tokens.id_token);
          localStorage.setItem("access_token", tokens.access_token);
          setUser({ name: parseJwt(tokens.id_token)?.name || "User" });
          navigate("/dashboard");
        })
        .catch((err) => console.error("Token exchange failed:", err));
    }
  }, [navigate]);

  // Decode JWT to extract user info
  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

  const signInWithEmail = () => {
    window.location.href = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}`;
  };

  const signInWithGoogle = () => {
    window.location.href = `${COGNITO_DOMAIN}/oauth2/authorize?identity_provider=Google&response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=email+openid+profile`;
  };

  const logout = () => {
    localStorage.clear();
    signOut();
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, signInWithEmail, signInWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};