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

  const handleLogout = async () => {
    try {
      // Manually redirect to Cognito Hosted UI logout endpoint
      const domain = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
      const clientId = "1gd98lgt6jqtletgio0e2us33n";
      const logoutRedirect = "https://dodyqytcfhwoe.cloudfront.net";

      // Hosted UI logout URL
      const logoutUrl = `${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
        logoutRedirect
      )}`;

      // Redirect the browser manually
      window.location.href = logoutUrl;
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Arial, sans-serif",
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
            boxShadow: "0 0 20px rgba(0,0,0,0.1)",
            display: "inline-block",
          }}
        >
          <h2>✅ Logged in successfully!</h2>
          <p>Welcome, {user.attributes?.email || "user"} 🎉</p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e63946",
              color: "#fff",
              padding: "10px 25px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "20px",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c72c3a")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#e63946")}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;