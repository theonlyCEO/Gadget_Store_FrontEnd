import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
 
  
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const signup = async (userData) => {
      
    
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.message || "Signup failed" };
      }
      setUser({ userId: data.userId, userName: data.userName, email: data.email });
      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error – check server" };
    }
   
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3000/checkpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data.valid) {
        return { success: false, error: data.message || "Invalid credentials" };
      }
      setUser({ userId: data.userId, userName: data.userName, email: data.email });
      return { success: true };
    } catch (err) {
      return { success: false, error: "Network error – check server" };
    }
    
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);