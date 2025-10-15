import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const Dashboard = ({ user, onLogout }) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const info = await Auth.currentUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    loadUserInfo();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Welcome, {userInfo?.attributes?.email || user.username}</h2>
      <p>User Pool ID: {user.pool?.userPoolId}</p>
      <button style={styles.buttonLogout} onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "40px",
  },
  buttonLogout: {
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#555",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Dashboard;