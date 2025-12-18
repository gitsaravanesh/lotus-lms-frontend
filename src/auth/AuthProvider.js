import React, { createContext, useContext, useEffect, useState } from "react";
import { exchangeCodeForToken, parseJwt } from "./authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/**
 * Helper function to determine and persist canonical username
 * Priority: localStorage → pendingUsername → cognito:username → preferred_username → email
 * 
 * Note: localStorage username takes priority to maintain consistency across sessions.
 * This ensures the tenant_id remains stable for API calls even if token claims change.
 */
export const determineAndPersistUsername = (payload, pendingUsername = null) => {
  // Guard clause: ensure payload exists
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  // 1. Check if username already exists in localStorage
  // This maintains consistency for returning users
  const existingUsername = localStorage.getItem("username");
  if (existingUsername) {
    return existingUsername;
  }

  // 2. Use pending username from signup flow
  if (pendingUsername) {
    localStorage.setItem("username", pendingUsername);
    return pendingUsername;
  }

  // 3. Try cognito:username claim
  if (payload["cognito:username"]) {
    localStorage.setItem("username", payload["cognito:username"]);
    return payload["cognito:username"];
  }

  // 4. Try preferred_username claim
  if (payload.preferred_username) {
    localStorage.setItem("username", payload.preferred_username);
    return payload.preferred_username;
  }

  // 5. Fallback to email
  if (payload.email) {
    localStorage.setItem("username", payload.email);
    return payload.email;
  }

  return null;
};

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

    // 🟢 Handle OAuth2 redirect (Google / Hosted UI)
    const code = params.get("code");
    if (code) {
      exchangeCodeForToken(code)
        .then((tokens) => {
          localStorage.setItem("id_token", tokens.id_token);
          const payload = parseJwt(tokens.id_token);
          
          // Retrieve pending username and topic from sessionStorage (set during Google signup)
          const pendingUsername = sessionStorage.getItem("pending_google_username");
          const pendingTopic = sessionStorage.getItem("pending_google_topic");
          
          // Store topic in localStorage if provided
          if (pendingTopic) {
            localStorage.setItem("user_topic", pendingTopic);
          }
          
          // Clear pending values from sessionStorage
          sessionStorage.removeItem("pending_google_username");
          sessionStorage.removeItem("pending_google_topic");
          
          // Determine and persist canonical username
          const username = determineAndPersistUsername(payload, pendingUsername);
          
          // Set user state with username and email
          setUser({ 
            name: payload.name || payload.email,
            username: username,
            email: payload.email
          });
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
      // 🟣 Load user from localStorage (for SDK login)
      const token = localStorage.getItem("id_token");
      if (token) {
        const payload = parseJwt(token);
        // Determine and persist canonical username using helper
        const username = determineAndPersistUsername(payload, null);
        setUser({ 
          name: payload.name || payload.email,
          username: username,
          email: payload.email
        });
      }
      setLoading(false);
    }
  }, []);

  // 🚀 Dual-mode logout handler (Hosted UI + SDK)
  const logout = async () => {
    try {
      localStorage.removeItem("id_token");
      localStorage.removeItem("username");
      localStorage.removeItem("user_topic");
      setUser(null);

      // Hosted UI logout for Google/OAuth users
      const domain = "lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
      const clientId = "49gusp4sidkggc371vghtdvujb";
      const redirectUri = window.location.origin.includes("localhost")
        ? "http://localhost:3000/"
        : "https://dodyqytcfhwoe.cloudfront.net/";

      // Try to sign out SDK user first (username/password)
      const { CognitoUserPool } = await import("amazon-cognito-identity-js");
      const poolData = {
        UserPoolId: "ap-south-1_6C5lP9yfm",
        ClientId: "49gusp4sidkggc371vghtdvujb",
      };
      const userPool = new CognitoUserPool(poolData);
      const cognitoUser = userPool.getCurrentUser();

      if (cognitoUser) {
        cognitoUser.signOut();
        window.location.href = "/"; // go to login (home)
        return;
      }

      // If no SDK session, fallback to Hosted UI logout
      const logoutUrl = `https://${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        redirectUri
      )}`;
      console.log("Redirecting to Cognito logout:", logoutUrl);
      window.location.href = logoutUrl;
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
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