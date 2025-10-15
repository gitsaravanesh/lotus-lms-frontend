import React, { useEffect, useState } from "react";
import { Amplify, Auth } from "aws-amplify";
import awsConfig from "./aws-exports";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

Amplify.configure(awsConfig);

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>LMS Platform</h1>
      {!user ? (
        <Login />
      ) : (
        <Dashboard user={user} onLogout={() => Auth.signOut().then(() => setUser(null))} />
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
  },
};

export default App;