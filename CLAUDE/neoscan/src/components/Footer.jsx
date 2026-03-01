import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-neo-dark text-white py-12 mt-auto">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neo-blue to-neo-teal flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              </svg>
            </div>
            <span className="font-display font-700 text-lg">NeoScan</span>
          </div>
          <p className="text-sm text-white/60 font-body leading-relaxed max-w-xs">
            Smart Non-Invasive Neonatal Jaundice Screening System powered by AI
            image analysis. A final-year academic research project.
          </p>
          <p className="text-xs text-white/30 mt-4 font-body">
            ⚠ For research purposes only. Not a substitute for clinical diagnosis.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display font-600 text-sm mb-4 text-white/80">Navigation</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/research", label: "Research" },
              { to: "/dashboard", label: "Dashboard" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-white/50 hover:text-white transition-colors font-body"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Screening */}
        <div>
          <h4 className="font-display font-600 text-sm mb-4 text-white/80">Screening</h4>
          <div className="flex flex-col gap-2">
            {[
              { to: "/calibrate", label: "Calibration" },
              { to: "/scan", label: "Start Scan" },
              { to: "/login", label: "Login" },
              { to: "/register", label: "Sign Up" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-sm text-white/50 hover:text-white transition-colors font-body"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/30 font-body">
          © 2025 NeoScan · Final Year Computer Science Project
        </p>
        <p className="text-xs text-white/30 font-body">
          Built with React · Flask · AI Image Analysis
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
