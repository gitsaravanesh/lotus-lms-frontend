import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import Login from "./components/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Detect logged-in user when app loads
  useEffect(() => {
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
    checkUser();
  }, []);

  // 🔹 Logout handler using Cognito Hosted UI logout endpoint
  const handleLogout = async () => {
    try {
      await Auth.signOut({
        global: true,
        // ✅ Must match Allowed sign-out URLs in Cognito
        redirectSignOut: "https://dodyqytcfhwoe.cloudfront.net",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 🔹 Show loading spinner until Amplify checks session
  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  // 🔹 Conditional rendering for login / dashboard
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {!user ? (
        // 🔸 Not logged in → Show Login screen
        <Login />
      ) : (
        // 🔸 Logged in → Show dashboard
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
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "#c72c3a")
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = "#e63946")
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