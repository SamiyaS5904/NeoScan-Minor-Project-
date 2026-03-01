import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ResearchPage from "./pages/ResearchPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CalibrationPage from "./pages/CalibrationPage";
import ScanPage from "./pages/ScanPage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="page-enter">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calibrate"
              element={
                <ProtectedRoute>
                  <CalibrationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute>
                  <ScanPage />
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-hero-gradient flex items-center justify-center text-center px-6 pt-20">
                  <div className="glass rounded-4xl p-12 shadow-glass max-w-md">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="font-display text-3xl font-800 text-neo-dark mb-2">Page Not Found</h1>
                    <p className="text-neo-muted font-body mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <a
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-700 rounded-2xl shadow-md hover:shadow-glass transition-all"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
