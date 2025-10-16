import React, { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const domain = "https://lms-auth-dev-sarav.auth.ap-south-1.amazoncognito.com";
  const clientId = "1gd98lgt6jqtletgio0e2us33n";
  const redirectUri = "https://dodyqytcfhwoe.cloudfront.net/";
  const responseType = "code";
  const scope = "email openid profile";

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmation) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    setLoading(true);
    setMessage("");

    const signupUrl = `${domain}/signup?client_id=${clientId}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = signupUrl;
  };

  const signupWithGoogle = () => {
    const googleUrl = `${domain}/oauth2/authorize?identity_provider=Google&client_id=${clientId}&response_type=${responseType}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = googleUrl;
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
      }}
    >
      <h2 style={{ color: "#1b4332" }}>Sign Up</h2>

      <form
        onSubmit={handleSignup}
        style={{
          display: "inline-block",
          background: "#fff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          width: "300px",
          textAlign: "left",
        }}
      >
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          required
          style={{
            width: "100%",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: "#1b4332",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Redirecting..." : "Sign Up"}
        </button>
      </form>

      <p style={{ color: "#d62828", marginTop: "10px" }}>{message}</p>

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <a href="/" style={{ color: "#0077b6" }}>
          Sign In
        </a>
      </p>

      <p style={{ marginTop: "15px", fontSize: "14px", color: "#444" }}>
        or{" "}
        <span
          onClick={signupWithGoogle}
          style={{
            color: "#d62828",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Sign Up with Google
        </span>
      </p>
    </div>
  );
};

export default Signup;