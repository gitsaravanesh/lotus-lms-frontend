import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken, signOut } from "./authService";
import { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI } from "./config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle redirect after Cognito login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      exchangeCodeForToken(code)
        .then((tokens) => {
          localStorage.setItem("id_token", tokens.id_token);
          const payload = JSON.parse(atob(tokens.id_token.split(".")[1]));
          setUser({ name: payload.name || "User" });
          navigate("/dashboard");
        })
        .catch((err) => console.error("Token exchange failed", err))
        .finally(() => setLoading(false));
    } else {
      const stored = localStorage.getItem("id_token");
      if (stored) {
        const payload = JSON.parse(atob(stored.split(".")[1]));
        setUser({ name: payload.name || "User" });
      }
      setLoading(false);
    }
  }, [navigate]);

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
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithEmail, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};