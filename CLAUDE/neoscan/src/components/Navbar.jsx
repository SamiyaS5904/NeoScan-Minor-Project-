import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-glass py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              <circle cx="12" cy="12" r="3" fillOpacity="0.4" />
            </svg>
          </div>
          <span className="font-display font-700 text-xl text-neo-dark">
            Neo<span className="gradient-text">Scan</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {[
            { path: "/", label: "Home" },
            { path: "/about", label: "About" },
            { path: "/research", label: "Research" },
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`font-body text-sm font-500 transition-colors ${
                isActive(path)
                  ? "text-neo-blue"
                  : "text-neo-muted hover:text-neo-dark"
              }`}
            >
              {label}
            </Link>
          ))}
          {token && (
            <>
              <Link
                to="/dashboard"
                className={`font-body text-sm font-500 transition-colors ${
                  isActive("/dashboard")
                    ? "text-neo-blue"
                    : "text-neo-muted hover:text-neo-dark"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/calibrate"
                className={`font-body text-sm font-500 transition-colors ${
                  isActive("/calibrate")
                    ? "text-neo-blue"
                    : "text-neo-muted hover:text-neo-dark"
                }`}
              >
                Calibrate
              </Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <>
              <span className="text-sm text-neo-muted font-body">
                Hi, {user?.name?.split(" ")[0] || "User"}
              </span>
              <Link
                to="/scan"
                className="px-4 py-2 bg-gradient-to-r from-neo-blue to-neo-teal text-white text-sm font-600 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-display"
              >
                New Scan
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-neo-mint text-neo-muted text-sm font-500 rounded-xl hover:bg-neo-mint/20 transition-all font-body"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-neo-blue text-sm font-600 rounded-xl hover:bg-neo-blue/10 transition-all font-display"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-neo-blue to-neo-teal text-white text-sm font-600 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all font-display"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-white/50 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className={`w-5 h-0.5 bg-neo-dark mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <div className={`w-5 h-0.5 bg-neo-dark mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-neo-dark transition-all ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass mx-4 mt-2 rounded-2xl p-4 shadow-glass animate-fade-in">
          <div className="flex flex-col gap-3">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/research", label: "Research" },
              ...(token
                ? [
                    { path: "/dashboard", label: "Dashboard" },
                    { path: "/calibrate", label: "Calibrate" },
                    { path: "/scan", label: "New Scan" },
                  ]
                : []),
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className="text-neo-dark font-500 py-2 px-3 rounded-xl hover:bg-neo-blue/10 transition-colors"
              >
                {label}
              </Link>
            ))}
            {token ? (
              <button
                onClick={handleLogout}
                className="text-left text-neo-muted py-2 px-3 rounded-xl hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2 mt-1">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 border border-neo-mint rounded-xl text-neo-blue font-600 text-sm"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center py-2 bg-gradient-to-r from-neo-blue to-neo-teal text-white rounded-xl font-600 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
