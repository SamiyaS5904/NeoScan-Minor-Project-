import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CameraCapture from "../components/CameraCapture";
import Spinner from "../components/Spinner";
import { analyze } from "../utils/api";

const tips = [
  { icon: "💡", text: "Ensure good lighting on the baby's face" },
  { icon: "👁️", text: "Focus on the eye region or forehead" },
  { icon: "📏", text: "Keep camera 15–20 cm from the face" },
  { icon: "🚫", text: "Avoid shadows and reflections" },
];

const ScanPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [region, setRegion] = useState("eye"); // "eye" | "forehead"

  const handleCapture = async (blob) => {
    setSubmitting(true);
    setError("");
    try {
      const res = await analyze(blob);
      const { scan_id } = res.data;
      navigate("/dashboard", { state: { scanId: scan_id } });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Analysis request failed. Please check your connection and try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient">
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <span className="inline-block bg-neo-teal/10 text-neo-teal text-xs font-display font-600 px-3 py-1.5 rounded-full mb-4">
            Step 2 of 3
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-800 text-neo-dark mb-3">
            Baby <span className="gradient-text">Scan</span>
          </h1>
          <p className="text-neo-muted font-body leading-relaxed">
            Capture a clear image of the baby's eye region or forehead. The AI will analyze
            skin and sclera color to estimate bilirubin levels.
          </p>
        </div>

        {/* Region selector */}
        <div className="glass rounded-3xl p-4 shadow-card mb-5 animate-fade-in flex gap-2">
          <button
            onClick={() => setRegion("eye")}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-display font-600 transition-all ${
              region === "eye"
                ? "bg-gradient-to-r from-neo-blue to-neo-teal text-white shadow-md"
                : "text-neo-muted hover:text-neo-dark"
            }`}
          >
            👁 Eye Region
          </button>
          <button
            onClick={() => setRegion("forehead")}
            className={`flex-1 py-2.5 rounded-2xl text-sm font-display font-600 transition-all ${
              region === "forehead"
                ? "bg-gradient-to-r from-neo-blue to-neo-teal text-white shadow-md"
                : "text-neo-muted hover:text-neo-dark"
            }`}
          >
            🧠 Forehead
          </button>
        </div>

        {/* Scan tips */}
        <div className="glass rounded-3xl p-5 shadow-card mb-6 animate-fade-in">
          <h3 className="font-display font-600 text-neo-dark mb-3 text-sm">Scanning Tips</h3>
          <div className="grid grid-cols-2 gap-2">
            {tips.map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-2 text-xs text-neo-muted font-body">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Camera or submitting */}
        {submitting ? (
          <div className="glass rounded-3xl p-12 shadow-card text-center animate-fade-in">
            <Spinner size="lg" message="Uploading scan for AI analysis..." />
            <p className="text-xs text-neo-muted font-body mt-4">
              You'll be redirected to the results dashboard shortly.
            </p>
          </div>
        ) : (
          <div className="glass rounded-3xl p-6 shadow-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-600 text-neo-dark">Camera</h3>
              <span className="text-xs bg-neo-teal/10 text-neo-teal font-display font-600 px-2 py-1 rounded-full">
                {region === "eye" ? "Eye Region Mode" : "Forehead Mode"}
              </span>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-body">
                ⚠ {error}
              </div>
            )}
            <CameraCapture
              onCapture={handleCapture}
              instructions={
                region === "eye"
                  ? "Center the baby's eye area in the frame. Ensure the sclera (white of eye) is visible and well-lit."
                  : "Center the baby's forehead in the frame. Ensure skin is clearly visible without shadows."
              }
              overlayHint={region === "eye" ? "Position eye region here" : "Position forehead here"}
            />
          </div>
        )}

        {/* Calibration reminder */}
        <div className="mt-6 p-4 bg-neo-yellow/10 border border-neo-yellow/30 rounded-2xl text-sm font-body text-amber-700 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <span>
            Make sure you've completed calibration before scanning. If lighting has changed,{" "}
            <a href="/calibrate" className="font-600 underline">recalibrate</a>.
          </span>
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[
            { step: 1, label: "Calibrate", done: true, active: false },
            { step: 2, label: "Scan", done: false, active: true },
            { step: 3, label: "Results", done: false, active: false },
          ].map(({ step, label, done, active }) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-700 transition-all ${
                    done
                      ? "bg-neo-safe text-white"
                      : active
                      ? "bg-gradient-to-br from-neo-blue to-neo-teal text-white"
                      : "bg-neo-mint/30 text-neo-muted"
                  }`}
                >
                  {done ? "✓" : step}
                </div>
                <span className={`text-xs font-body ${active ? "text-neo-blue font-600" : done ? "text-neo-safe font-600" : "text-neo-muted"}`}>
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

export default ScanPage;
