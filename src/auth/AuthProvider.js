import React, { createContext, useContext, useEffect, useState } from "react";
import {
  exchangeCodeForTokens,
  refreshTokens,
  getUserFromIdToken,
  clearTokens,
} from "./authService";
import { COGNITO_DOMAIN, CLIENT_ID, REDIRECT_URI, LOGOUT_ENDPOINT, SCOPE } from "./config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUserFromIdToken());
  const [loading, setLoading] = useState(true);

  const buildUrl = (path, extra = "") =>
    `${COGNITO_DOMAIN}/${path}?client_id=${CLIENT_ID}&response_type=code&scope=${encodeURIComponent(
      SCOPE
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}${extra}`;

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          await exchangeCodeForTokens(code);
          setUser(getUserFromIdToken());
          window.history.replaceState({}, "", "/");
        } else {
          const u = getUserFromIdToken();
          if (u && u.exp > Date.now() / 1000) setUser(u);
          else await refreshTokens();
        }
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithEmail: () => (window.location.href = buildUrl("login")),
    signInWithGoogle: () =>
      (window.location.href = buildUrl("oauth2/authorize", "&identity_provider=Google")),
    signUpWithEmail: () => (window.location.href = buildUrl("signup")),
    signUpWithGoogle: () =>
      (window.location.href = buildUrl("oauth2/authorize", "&identity_provider=Google")),
    handleLogout: () => {
      clearTokens();
      const logoutUrl = `${LOGOUT_ENDPOINT}?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
        REDIRECT_URI
      )}`;
      const clearUrl = `${REDIRECT_URI}clear-session.html?logout_url=${encodeURIComponent(
        logoutUrl
      )}`;
      window.location.href = clearUrl;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}