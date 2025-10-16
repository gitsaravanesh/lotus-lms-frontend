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
      // Perform global sign out (ends all Cognito sessions)
      await Auth.signOut({
        global: true,
        redirectSignOut: "https://dodyqytcfhwoe.cloudfront.net",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}>
      {!user ? (
        <Login />
      ) : (
        <div>
          <h2>✅ Logged in successfully!</h2>
          <p>Welcome, {user.attributes?.email || "user"} 🎉</p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e63946",
              color: "#fff",
              padding: "10px 20px",
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