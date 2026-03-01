import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-20">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-neo-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-neo-teal/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-slide-up">
        {/* Card */}
        <div className="glass rounded-4xl p-8 shadow-glass-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </div>
              <span className="font-display font-700 text-xl text-neo-dark">
                Neo<span className="gradient-text">Scan</span>
              </span>
            </div>
            <h1 className="font-display text-2xl font-700 text-neo-dark">Welcome back</h1>
            <p className="text-neo-muted font-body text-sm mt-1">Sign in to your NeoScan account</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-body animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-display font-600 text-neo-dark mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="doctor@hospital.com"
                className="w-full px-4 py-3 bg-white/70 border border-neo-mint/50 rounded-2xl text-neo-dark font-body text-sm placeholder-neo-muted/50 focus:outline-none focus:ring-2 focus:ring-neo-blue/30 focus:border-neo-blue transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-display font-600 text-neo-dark mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/70 border border-neo-mint/50 rounded-2xl text-neo-dark font-body text-sm placeholder-neo-muted/50 focus:outline-none focus:ring-2 focus:ring-neo-blue/30 focus:border-neo-blue transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-700 rounded-2xl shadow-glass hover:shadow-glass-lg hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size="sm" /> : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-neo-mint/40" />
            <span className="text-xs text-neo-muted font-body">or</span>
            <div className="flex-1 h-px bg-neo-mint/40" />
          </div>

          <p className="text-center text-sm font-body text-neo-muted">
            Don't have an account?{" "}
            <Link to="/register" className="text-neo-blue font-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-neo-muted font-body mt-4">
          Protected by JWT authentication
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
