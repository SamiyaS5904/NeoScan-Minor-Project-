import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("neoscan_token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Decode basic user info from token (or store user separately)
      const stored = localStorage.getItem("neoscan_user");
      if (stored) setUser(JSON.parse(stored));
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/login`,
      { email, password }
    );
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("neoscan_token", newToken);
    localStorage.setItem("neoscan_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/register`,
      { name, email, password }
    );
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("neoscan_token");
    localStorage.removeItem("neoscan_user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
