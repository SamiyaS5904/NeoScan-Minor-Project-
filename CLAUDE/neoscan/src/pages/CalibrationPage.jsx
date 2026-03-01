import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CameraCapture from "../components/CameraCapture";
import Spinner from "../components/Spinner";
import { calibrate } from "../utils/api";

const steps = [
  {
    icon: "☀️",
    label: "Good Lighting",
    desc: "Move to a well-lit area with consistent lighting.",
  },
  {
    icon: "📄",
    label: "White Surface",
    desc: "Hold a white paper or point at a white wall.",
  },
  {
    icon: "📸",
    label: "Capture",
    desc: "Fill the frame with the white surface and capture.",
  },
];

const CalibrationPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleCapture = async (blob) => {
    setSubmitting(true);
    setError("");
    try {
      await calibrate(blob);
      setDone(true);
      setTimeout(() => navigate("/scan"), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Calibration failed. Please try again with a clearer white surface."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <span className="inline-block bg-neo-yellow/20 text-amber-600 text-xs font-display font-600 px-3 py-1.5 rounded-full mb-4">
            Step 1 of 3
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-800 text-neo-dark mb-3">
            Lighting <span className="gradient-text">Calibration</span>
          </h1>
          <p className="text-neo-muted font-body leading-relaxed">
            Before scanning, capture a white surface to calibrate for your current lighting
            conditions. This ensures accurate color analysis.
          </p>
        </div>

        {/* Tips */}
        <div className="glass rounded-3xl p-6 shadow-card mb-6 animate-fade-in">
          <h3 className="font-display font-600 text-neo-dark mb-4 text-sm">Follow These Steps</h3>
          <div className="grid grid-cols-3 gap-3">
            {steps.map(({ icon, label, desc }) => (
              <div key={label} className="text-center p-3 bg-neo-blue/5 rounded-2xl">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-xs font-display font-600 text-neo-dark mb-1">{label}</div>
                <div className="text-xs text-neo-muted font-body leading-snug">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Success state */}
        {done && (
          <div className="glass rounded-3xl p-8 shadow-glass text-center animate-fade-in">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-display text-xl font-700 text-neo-dark mb-2">Calibration Complete!</h2>
            <p className="text-neo-muted font-body text-sm">Redirecting to scan page...</p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="pulse-dot w-2 h-2 rounded-full bg-neo-safe" />
              <span className="pulse-dot w-2 h-2 rounded-full bg-neo-teal" />
              <span className="pulse-dot w-2 h-2 rounded-full bg-neo-blue" />
            </div>
          </div>
        )}

        {/* Camera */}
        {!done && !submitting && (
          <div className="glass rounded-3xl p-6 shadow-card animate-fade-in">
            <h3 className="font-display font-600 text-neo-dark mb-4">Capture White Surface</h3>
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-body">
                ⚠ {error}
              </div>
            )}
            <CameraCapture
              onCapture={handleCapture}
              instructions="Point your camera at a plain white surface (paper or wall) and capture. The entire frame should be white."
              overlayHint="Fill frame with white surface"
            />
          </div>
        )}

        {/* Submitting */}
        {submitting && !done && (
          <div className="glass rounded-3xl p-12 shadow-card text-center animate-fade-in">
            <Spinner size="lg" message="Sending calibration image to server..." />
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[
            { step: 1, label: "Calibrate", active: true, done: done },
            { step: 2, label: "Scan", active: false, done: false },
            { step: 3, label: "Results", active: false, done: false },
          ].map(({ step, label, active, done: stepDone }) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-700 transition-all ${
                    stepDone
                      ? "bg-neo-safe text-white"
                      : active
                      ? "bg-gradient-to-br from-neo-blue to-neo-teal text-white"
                      : "bg-neo-mint/30 text-neo-muted"
                  }`}
                >
                  {stepDone ? "✓" : step}
                </div>
                <span className={`text-xs font-body ${active ? "text-neo-blue font-600" : "text-neo-muted"}`}>
                  {label}
                </span>
              </div>
              {step < 3 && <div className="w-12 h-0.5 bg-neo-mint/40 mb-4" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalibrationPage;
