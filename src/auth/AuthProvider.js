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
  const [errorMessage, setErrorMessage] = useState(null);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

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
        .catch((err) => {
          console.error("Token exchange failed:", err);

          // --- NEW: Detect disabled user error ---
          if (err.response?.data?.error_description?.includes("User is not enabled")) {
            setErrorMessage(
              "Your account has been disabled. Please contact the administrator."
            );
          } else if (err.response?.data?.error_description) {
            setErrorMessage("Login failed: " + err.response.data.error_description);
          } else {
            setErrorMessage("Login failed. Please try again.");
          }
        })
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
    const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&federated=true`;
    localStorage.clear();
    setUser(null);
    window.location.href = logoutUrl;
  };

  // --- UI for error message (toast-style alert box) ---
  const ErrorPopup = () =>
    errorMessage ? (
      <div style={styles.errorBox}>
        ⚠️ {errorMessage}
        <button style={styles.closeButton} onClick={() => setErrorMessage(null)}>
          ✖
        </button>
      </div>
    ) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {errorMessage && <ErrorPopup />}
      {children}
    </AuthContext.Provider>
  );
};

const styles = {
  errorBox: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ffcccc",
    color: "#700",
    border: "1px solid #d00",
    padding: "12px 20px",
    borderRadius: 8,
    fontSize: 14,
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "fit-content",
    maxWidth: "80%",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#700",
    cursor: "pointer",
    fontSize: 16,
    marginLeft: 12,
  },
};