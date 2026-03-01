import React, { useEffect, useState } from "react";
import useCamera from "../hooks/useCamera";
import Spinner from "./Spinner";

/**
 * Reusable camera capture component
 * Props:
 *  - onCapture(blob, dataUrl): called when user captures image
 *  - instructions: string guidance text
 *  - overlayHint: optional overlay UI element on video
 */
const CameraCapture = ({ onCapture, instructions, overlayHint }) => {
  const { videoRef, isActive, error, capturedImage, startCamera, stopCamera, captureFrame, retake } = useCamera();
  const [loading, setLoading] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const handleStart = async () => {
    setCameraStarting(true);
    await startCamera(facingMode);
    setCameraStarting(false);
  };

  const handleCapture = async () => {
    setLoading(true);
    const blob = await captureFrame();
    setLoading(false);
    if (blob && capturedImage) {
      // capturedImage updated by hook
    }
    return blob;
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;
    // Re-capture to get blob
    const blob = await captureFrame();
    if (blob) {
      onCapture(blob, capturedImage);
      stopCamera();
    }
  };

  // Auto-flip: try environment first, fallback to user
  const toggleCamera = async () => {
    stopCamera();
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  return (
    <div className="w-full">
      {/* Instructions */}
      {instructions && (
        <p className="text-neo-muted font-body text-sm mb-4 text-center leading-relaxed">
          {instructions}
        </p>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-sm font-body">
          ⚠ {error}
        </div>
      )}

      {/* Camera preview or captured image */}
      <div className="relative rounded-3xl overflow-hidden bg-neo-dark aspect-video w-full shadow-glass-lg">
        {/* Live video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${capturedImage ? "hidden" : ""}`}
        />

        {/* Captured still */}
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}

        {/* Overlay guide frame */}
        {isActive && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-2/3 h-2/3 border-2 border-white/50 rounded-3xl" />
            {overlayHint && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full font-body">
                  {overlayHint}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Starting overlay */}
        {cameraStarting && (
          <div className="absolute inset-0 flex items-center justify-center bg-neo-dark/80">
            <Spinner message="Starting camera..." />
          </div>
        )}

        {/* Captured badge */}
        {capturedImage && (
          <div className="absolute top-4 left-4">
            <span className="bg-neo-safe/90 text-white text-xs font-600 px-3 py-1 rounded-full font-display">
              ✓ Image Captured
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-3 justify-center">
        {!isActive && !capturedImage && (
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-600 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
            Start Camera
          </button>
        )}

        {isActive && !capturedImage && (
          <>
            <button
              onClick={handleCapture}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-600 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {loading ? <Spinner size="sm" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="3.2" />
                  <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                </svg>
              )}
              Capture
            </button>
            <button
              onClick={toggleCamera}
              className="px-4 py-3 glass text-neo-muted rounded-2xl hover:text-neo-blue transition-all"
              title="Flip Camera"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-10 9V8l5 3-5 3z" />
              </svg>
            </button>
          </>
        )}

        {capturedImage && (
          <>
            <button
              onClick={() => { retake(); startCamera(facingMode); }}
              className="px-5 py-3 border border-neo-mint text-neo-muted font-body rounded-2xl hover:bg-neo-mint/20 transition-all"
            >
              Retake
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-gradient-to-r from-neo-blue to-neo-teal text-white font-display font-600 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Use This Image →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
