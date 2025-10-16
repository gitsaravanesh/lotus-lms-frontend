import React from "react";

const Login = () => {
  const domain = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
  const clientId = "1gd98lgt6jqtletgio0e2us33n";
  const redirectUri = "https://dodyqytcfhwoe.cloudfront.net/";
  const responseType = "code";
  const scope = "email openid profile";

  const loginWithEmail = () => {
    const loginUrl = `${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  };

  const loginWithGoogle = () => {
    const loginUrl = `${domain}/oauth2/authorize?identity_provider=Google&client_id=${clientId}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  };

  return (
    <div>
      <h2 style={{ color: "#1b4332" }}>LMS Platform Login</h2>
      <button
        onClick={loginWithEmail}
        style={{
          backgroundColor: "#0077b6",
          color: "#fff",
          padding: "10px 25px",
          border: "none",
          borderRadius: "8px",
          margin: "10px",
          cursor: "pointer",
        }}
      >
        Sign in with Email
      </button>
      <br />
      <button
        onClick={loginWithGoogle}
        style={{
          backgroundColor: "#d62828",
          color: "#fff",
          padding: "10px 25px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;