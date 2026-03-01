import { useState, useRef, useCallback } from "react";

const useCamera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const startCamera = useCallback(async (facingMode = "environment") => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsActive(true);
    } catch (err) {
      setError(
        err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access and try again."
          : "Could not access camera. Please ensure your device has a camera."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsActive(false);
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current) return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);

    // Convert to Blob for API
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  }, []);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  return {
    videoRef,
    isActive,
    error,
    capturedImage,
    startCamera,
    stopCamera,
    captureFrame,
    retake,
  };
};

export default useCamera;
