import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-neo-gradient flex items-center justify-center">
        <div className="flex gap-2">
          <span className="pulse-dot w-3 h-3 rounded-full bg-neo-blue" />
          <span className="pulse-dot w-3 h-3 rounded-full bg-neo-teal" />
          <span className="pulse-dot w-3 h-3 rounded-full bg-neo-mint" />
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
