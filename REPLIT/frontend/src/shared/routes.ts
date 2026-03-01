export const api = {
  baseUrl: "http://localhost:8000", // your Flask backend
};

export const buildUrl = (path: string) => {
  return `${api.baseUrl}${path}`;
};