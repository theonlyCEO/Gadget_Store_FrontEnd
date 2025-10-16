import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "./AuthPopup.css";

function AuthPopup({ isOpen, onClose, initialMode = "signup" }) {
  // ---- HOOKS: Always called in this exact order (unconditional) ----
  const [mode, setMode] = useState(initialMode); // 'signup' or 'signin'
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup, login } = useAuth();
  const popupRef = useRef(null); // For focus trap
  const firstInputRef = useRef(null); // Auto-focus on first visible input

  // Early return after hooks (safe now)
  if (!isOpen) return null;

  // ---- EFFECTS: Scroll lock, Esc close, focus trap, auto-focus ----
  useEffect(() => {
    document.body.style.overflow = "hidden";
    // Auto-focus logic: Focus username in signup, email in signin
    const focusFirst = () => {
      if (mode === "signup") {
        // Username ref would need another ref, but for simplicity: query
        popupRef.current?.querySelector('input[placeholder="Username"]')?.focus();
      } else {
        popupRef.current?.querySelector('input[placeholder="Email"]')?.focus();
      }
    };
    focusFirst();

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    // Focus trap
    const handleTab = (e) => {
      if (e.key === "Tab" && popupRef.current) {
        const focusable = popupRef.current.querySelectorAll(
          'button, [href], input, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleTab);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", handleTab);
    };
  }, [isOpen, onClose, mode]); // Re-run if mode changes

  // ---- HANDLERS (after hooks) ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const result = await signup({ userName, email, password });
      if (!result.success) {
        setError(result.error);
        return;
      }
    } else {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
    }

    // Reset and close
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  const switchMode = () => {
    setMode(mode === "signup" ? "signin" : "signup");
    setError("");
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // ---- RENDER ----
  return (
    <div className="auth-popup-overlay" onClick={onClose}>
      <div
        className="auth-popup-content"
        onClick={(e) => e.stopPropagation()}
        ref={popupRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button className="auth-close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2 id="auth-title">{mode === "signup" ? "Sign Up" : "Sign In"}</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required={mode === "signup"}
            className={mode === "signup" ? "" : "hidden-input"}
            style={{ display: mode === "signup" ? "block" : "none" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="email-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={mode === "signup"}
            className={mode === "signup" ? "" : "hidden-input"}
            style={{ display: mode === "signup" ? "block" : "none" }}
          />
          <button type="submit" className="auth-submit-btn">
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="auth-switch">
          {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
          <span className="auth-switch-link" onClick={switchMode}>
            {mode === "signup" ? "Sign In" : "Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPopup;