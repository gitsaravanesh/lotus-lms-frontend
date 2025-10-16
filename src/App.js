import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed logout with correct redirect_uri parameter
  const handleLogout = async () => {
    try {
      const domain = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
      const clientId = "1gd98lgt6jqtletgio0e2us33n";

      // Auto-detect environment
      const isLocal = window.location.hostname === "localhost";

      // ⚠️ Must match Cognito Allowed sign-out URLs exactly (with /)
      const redirectUri = isLocal
        ? "http://localhost:3000/"
        : "https://dodyqytcfhwoe.cloudfront.net/";

      // ✅ Correct parameter name: redirect_uri (not logout_uri)
      const logoutUrl = `${domain}/logout?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      console.log("Logging out via:", logoutUrl);

      // ✅ Redirect to Cognito Hosted UI logout endpoint
      window.location.replace(logoutUrl);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          fontSize: "18px",
          color: "#555",
        }}
      >
        Checking authentication...
      </div>
    );
  }

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      {!user ? (
        <Login />
      ) : (
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
            display: "inline-block",
            minWidth: "320px",
          }}
        >
          <h2
            style={{
              color: "#1b4332",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            ✅ Logged in successfully!
          </h2>
          <p style={{ color: "#333" }}>
            Welcome, <b>{user.attributes?.email || "user"}</b> 🎉
          </p>

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#d62828",
              color: "#fff",
              padding: "10px 30px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "25px",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#b71c1c")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#d62828")
            }
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;