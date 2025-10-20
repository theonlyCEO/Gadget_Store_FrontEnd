import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Signin.css";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    // Call context login (hits your /checkpassword backend → MongoDB validation)
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || "Invalid email or password");
      return;
    }

    // On success: Redirect to home (user is now in context/localStorage)
    navigate("/");
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <h1 className="signin-title">Welcome Back</h1>
        <p className="signin-subtitle">Sign in to your GadgetStore account</p>
        
        {error && <p className="error-message" role="alert">{error}</p>}
        
        <form onSubmit={handleSubmit} className="signin-form" noValidate>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signin-input"
            aria-label="Email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signin-input"
            aria-label="Password"
          />
          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Signin;