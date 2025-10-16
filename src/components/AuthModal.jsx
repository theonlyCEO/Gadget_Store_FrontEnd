import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

function AuthModal({ isOpen, onClose, initialMode = "signin" }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState(""); // For signup
  const [error, setError] = useState("");
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    let result;
    if (mode === "signin") {
      result = await login(email, password);
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      result = await signup({ email, password, confirmPassword, userName });
    }
    if (result.success) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUserName("");
      onClose();
    } else {
      setError(result.error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>&times;</button>
        <h2>{mode === "signin" ? "Sign In" : "Sign Up"}</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mode === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button type="submit" className="auth-submit-btn">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <span className="auth-switch-link" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;