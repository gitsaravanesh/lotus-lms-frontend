import React, { createContext, useContext, useEffect, useState } from "react";
import { exchangeCodeForToken, parseJwt } from "./authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 🔴 Handle Cognito redirect errors
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      const formattedError = decodeURIComponent(errorDescription || "Login failed.");
      console.error("Cognito returned an error:", formattedError);

      if (formattedError.toLowerCase().includes("not enabled")) {
        setErrorMessage("Your account has not been enabled yet. Please contact support.");
      } else if (formattedError.toLowerCase().includes("disabled")) {
        setErrorMessage("Your account has been disabled. Please contact the administrator.");
      } else {
        setErrorMessage(formattedError);
      }

      window.history.replaceState({}, document.title, "/");
      setLoading(false);
      return;
    }

    // 🟢 Handle Cognito OAuth redirect (code exchange)
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

          let errorText = "Login failed. Please try again.";
          if (err.response?.data?.error_description)
            errorText = err.response.data.error_description;
          else if (typeof err.response?.data === "string")
            errorText = err.response.data;
          else if (err.message)
            errorText = err.message;

          if (errorText.toLowerCase().includes("disabled")) {
            setErrorMessage("Your account has been disabled. Please contact the administrator.");
          } else {
            setErrorMessage("Login failed: " + errorText);
          }

          window.history.replaceState({}, document.title, "/");
        })
        .finally(() => setLoading(false));
    } else {
      // 🟣 Load user from localStorage (if already logged in)
      const token = localStorage.getItem("id_token");
      if (token) {
        const payload = parseJwt(token);
        setUser({ name: payload.name || payload.email });
      }
      setLoading(false);
    }
  }, []);

  // 🚀 Dynamic logout handler (works for both local + CloudFront)
  const logout = () => {
    localStorage.removeItem("id_token");
    setUser(null);

    const domain = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
    const clientId = "1gd98lgt6jqtletgio0e2us33n";

    // Detect environment dynamically
    const redirectUri =
      window.location.origin.includes("localhost")
        ? "http://localhost:3000/"
        : "https://dodyqytcfhwoe.cloudfront.net/";

    const logoutUrl = `https://${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      redirectUri
    )}`;

    console.log("Redirecting to logout URL:", logoutUrl);
    window.location.href = logoutUrl;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, errorMessage, setErrorMessage }}
    >
      {!loading && children}
      {errorMessage && (
        <div className="error-banner">
          ⚠️ {errorMessage}
        </div>
      )}
    </AuthContext.Provider>
  );
};