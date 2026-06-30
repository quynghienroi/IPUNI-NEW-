import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('diaplus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Only redirect to login if the 401 came from an auth-related endpoint
      // (e.g. /auth/me returning "token expired"). For other endpoints (e.g. /scan),
      // the 401 might be from an external AI API key issue, not from JWT expiration.
      const url = err.config?.url || '';
      const isAuthEndpoint = url.includes('/auth/');
      if (isAuthEndpoint) {
        localStorage.removeItem('diaplus_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

