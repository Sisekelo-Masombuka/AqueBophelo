import axios from 'axios';

const PRIMARY_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5094';
const FALLBACK_BASE_URL = 'https://localhost:7154';

export const apiClient = axios.create({
  baseURL: PRIMARY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-attach JWT Bearer token and Accept-Language header if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aquabophelo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const lang = localStorage.getItem('aquabophelo_lang') || 'EN';
    config.headers['Accept-Language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatic network/cert error fallback interceptor (HTTPS -> HTTP fallback)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If HTTPS fails due to network/certificate error, attempt HTTP fallback
    if (
      (error.code === 'ERR_NETWORK' || !error.response) &&
      originalRequest.baseURL !== FALLBACK_BASE_URL
    ) {
      originalRequest._retry = true;
      originalRequest.baseURL = FALLBACK_BASE_URL;
      if (originalRequest.url && originalRequest.url.startsWith('https://localhost:7154')) {
        originalRequest.url = originalRequest.url.replace('https://localhost:7154', FALLBACK_BASE_URL);
      }
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
