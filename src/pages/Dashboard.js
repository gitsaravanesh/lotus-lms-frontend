import React from "react";
import { useAuth } from "../auth/AuthProvider";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <div className="card">
        <h2>✅ Logged in successfully!</h2>
        <p>Welcome, {user?.name || "User"} 🎉</p>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;