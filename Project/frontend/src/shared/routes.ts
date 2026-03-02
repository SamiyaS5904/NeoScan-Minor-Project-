export const api = {
  baseUrl: "http://localhost:5000",
};

export const buildUrl = (path: string) => {
  return `${api.baseUrl}${path}`;
};