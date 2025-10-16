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
      await Auth.signOut({ global: true });
      window.location.href = "https://dodyqytcfhwoe.cloudfront.net";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      {!user ? (
        <Login />
      ) : (
        <div>
          <h2>✅ Logged in successfully!</h2>
          <p>Welcome, {user.attributes?.email}</p>
          <button
            onClick={handleLogout}
            style={{
              background: "#e63946",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "20px",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default App;