import React from "react";
import Login from "./components/Login";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f6fa",
      }}
    >
      <Login />
    </div>
  );
}

export default App;