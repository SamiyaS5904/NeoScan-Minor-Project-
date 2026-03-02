export const api = {
  baseUrl: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "http://localhost:5000/api",
};

export const buildUrl = (path: string) => {
  return `${api.baseUrl}${path}`;
};