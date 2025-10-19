import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Signup() {
  const { signUpWithEmail, signUpWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    topic: "Cloud",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords do not match!");
    signUpWithEmail();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Lotus LMS</h1>
        <p style={styles.subtitle}>Create your learning account</p>

        <form onSubmit={handleSignup}>
          <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required style={styles.input} />
          <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required style={styles.input} />
          <select name="topic" value={form.topic} onChange={handleChange} style={styles.input}>
            <option value="Cloud">Cloud</option>
            <option value="AI">AI</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Testing">Testing</option>
          </select>
          <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required style={styles.input} />
          <input name="confirm" placeholder="Confirm Password" type="password" value={form.confirm} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.primary}>Sign up</button>
        </form>

        <div style={styles.divider}><span style={styles.dividerText}>OR</span></div>

        <button onClick={signUpWithGoogle} style={styles.google}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 20, marginRight: 8 }} />
          Sign up with Google
        </button>

        <div style={{ marginTop: 20 }}>
          <span>Already have an account?</span>{" "}
          <button onClick={() => navigate("/")} style={styles.link}>Sign in</button>
        </div>
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