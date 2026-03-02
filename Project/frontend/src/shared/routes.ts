const isProd = import.meta.env.PROD;
export const api = {
  baseUrl: isProd ? "/api" : "http://localhost:5000/api",
};

export const buildUrl = (path: string) => {
  return `${api.baseUrl}${path}`;
};