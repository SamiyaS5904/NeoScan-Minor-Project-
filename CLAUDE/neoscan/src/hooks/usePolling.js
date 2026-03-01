import { useState, useEffect, useRef, useCallback } from "react";
import { getResult } from "../utils/api";

/**
 * Polls GET /result/:scanId every `interval` ms until
 * result.status === "ready" or maxAttempts is exceeded.
 */
const usePolling = (scanId, interval = 5000, maxAttempts = 30) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const timerRef = useRef(null);

  const poll = useCallback(async () => {
    if (!scanId) return;
    try {
      const res = await getResult(scanId);
      const data = res.data;
      if (data.status === "ready") {
        setResult(data);
        clearInterval(timerRef.current);
      } else {
        setAttempts((a) => {
          if (a + 1 >= maxAttempts) {
            clearInterval(timerRef.current);
            setError("Analysis is taking longer than expected. Please try again.");
          }
          return a + 1;
        });
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to fetch result.");
      clearInterval(timerRef.current);
    }
  }, [scanId, maxAttempts]);

  useEffect(() => {
    if (!scanId) return;
    poll(); // immediate first call
    timerRef.current = setInterval(poll, interval);
    return () => clearInterval(timerRef.current);
  }, [scanId, interval, poll]);

  return { result, error, isPolling: !result && !error, attempts };
};

export default usePolling;
