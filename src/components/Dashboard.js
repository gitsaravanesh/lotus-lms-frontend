import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Auth.currentAuthenticatedUser().catch(() => {
      navigate("/");
    });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🎉 You are logged in!</h2>
      <p>Welcome to the Lotus LMS Platform</p>
      <button onClick={() => Auth.signOut({ global: true })}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;