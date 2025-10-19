import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmail();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Lotus LMS</h1>
        <p style={styles.subtitle}>Sign in to continue</p>
        <form onSubmit={handleLogin} style={{ marginBottom: 20 }}>
          <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
          <button type="submit" style={styles.primary}>Sign in</button>
        </form>

        <div style={styles.divider}><span style={styles.dividerText}>OR</span></div>

        <button onClick={signInWithGoogle} style={styles.google}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 20, marginRight: 8 }} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { height: "100vh", background: "linear-gradient(135deg, #0077b6, #00b4d8)", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "#fff", borderRadius: 10, padding: "2.5rem", width: 360, boxShadow: "0 6px 20px rgba(0,0,0,0.15)", textAlign: "center" },
  title: { color: "#023e8a", marginBottom: 10 },
  subtitle: { color: "#555", marginBottom: 25 },
  input: { width: "100%", padding: "10px", marginBottom: 10, borderRadius: 6, border: "1px solid #ccc" },
  primary: { width: "100%", background: "#0077b6", color: "#fff", border: "none", borderRadius: 6, padding: "12px 0", fontSize: 15, cursor: "pointer" },
  divider: { margin: "20px 0", borderBottom: "1px solid #ddd", position: "relative" },
  dividerText: { position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#fff", padding: "0 10px", fontSize: 12 },
  google: { width: "100%", background: "#fff", border: "1px solid #ccc", borderRadius: 6, padding: "12px 0", cursor: "pointer" },
};