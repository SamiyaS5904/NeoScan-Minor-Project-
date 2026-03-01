import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("neoscan_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("neoscan_token");
      localStorage.removeItem("neoscan_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─── API Methods ─────────────────────────────────────────────────────────────

export const calibrate = (imageBlob) => {
  const formData = new FormData();
  formData.append("image", imageBlob, "calibration.jpg");
  return api.post("/calibrate", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const analyze = (imageBlob) => {
  const formData = new FormData();
  formData.append("image", imageBlob, "scan.jpg");
  return api.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getResult = (scanId) => api.get(`/result/${scanId}`);

export const loginUser = (email, password) =>
  api.post("/login", { email, password });

export const registerUser = (name, email, password) =>
  api.post("/register", { name, email, password });

export default api;
