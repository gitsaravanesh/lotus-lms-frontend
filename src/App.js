import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check user authentication on load
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

  // ✅ Fixed logout function with `response_type` and correct redirect
  const handleLogout = async () => {
    try {
      const domain = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
      const clientId = "1gd98lgt6jqtletgio0e2us33n";

      // Detect local or CloudFront environment
      const isLocal = window.location.hostname === "localhost";

      // ⚠️ Must match Allowed sign-out URLs in Cognito (with trailing slash)
      const redirectUri = isLocal
        ? "http://localhost:3000/"
        : "https://dodyqytcfhwoe.cloudfront.net/";

      // ✅ Include response_type=code — fixes 400 error
      const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        redirectUri
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`;

      console.log("Logging out via:", logoutUrl);

      // Redirect to Cognito Hosted UI logout endpoint
      window.location.replace(logoutUrl);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ✅ Loader for smoother UX
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
        // ✅ Show Login screen if user not authenticated
        <Login />
      ) : (
        // ✅ Show Logged-in screen
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