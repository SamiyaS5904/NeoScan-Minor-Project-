import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const pw = form.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthColors = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-20">
      <div className="absolute top-1/4 right-10 w-64 h-64 bg-neo-teal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-neo-blue/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative animate-slide-up">
        <div className="glass rounded-4xl p-8 shadow-glass-lg">
          {/* Logo */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </div>
              <span className="font-display font-700 text-xl text-neo-dark">
                Neo<span className="gradient-text">Scan</span>
              </span>
            </div>
            <h1 className="font-display text-2xl font-700 text-neo-dark">Create Account</h1>
            <p className="text-neo-muted font-body text-sm mt-1">Join NeoScan to start screening</p>
          </div>

          {/* Success state */}
          {success && (
            <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center animate-fade-in">
              <div className="text-3xl mb-2">✓</div>
              <p className="text-emerald-700 font-display font-600">Account created!</p>
              <p className="text-emerald-600 text-sm font-body mt-1">Redirecting to login...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-body">
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "name", label: "Full Name", type: "text", placeholder: "Dr. Jane Smith" },
                { name: "email", label: "Email Address", type: "email", placeholder: "jane@hospital.com" },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-display font-600 text-neo-dark mb-1.5">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className="w-full px-4 py-3 bg-white/70 border border-neo-mint/50 rounded-2xl text-neo-dark font-body text-sm placeholder-neo-muted/50 focus:outline-none focus:ring-2 focus:ring-neo-blue/30 focus:border-neo-blue transition-all"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-display font-600 text-neo-dark mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 bg-white/70 border border-neo-mint/50 rounded-2xl text-neo-dark font-body text-sm placeholder-neo-muted/50 focus:outline-none focus:ring-2 focus:ring-neo-blue/30 focus:border-neo-blue transition-all"
                />
                {form.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            i <= strength ? strengthColors[strength] : "bg-neo-mint/30"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-neo-muted font-body">{strengthLabels[strength]}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-display font-600 text-neo-dark mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  name="confirm"
                  value={form.confirm}
                  onChange={handleChange}
                  required
                  placeholder="Re-enter password"
                  className={`w-full px-4 py-3 bg-white/70 border rounded-2xl text-neo-dark font-body text-sm placeholder-neo-muted/50 focus:outline-none focus:ring-2 transition-all ${
                    form.confirm && form.confirm !== form.password
                      ? "border-rose-300 focus:ring-rose-200"
                      : "border-neo-mint/50 focus:ring-neo-blue/30 focus:border-neo-blue"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-700 rounded-2xl shadow-glass hover:shadow-glass-lg hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Spinner size="sm" /> : "Create Account"}
              </button>
            </form>
          )}

          <div className="mt-5 text-center">
            <p className="text-sm font-body text-neo-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-neo-blue font-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
