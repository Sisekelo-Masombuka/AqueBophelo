import axios from 'axios';

const PRIMARY_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5094';
const FALLBACK_BASE_URL = 'https://localhost:7154';

/**
 * Pre-configured Axios HTTP client for the AquaBophelo React SPA.
 * Manages baseURL resolution, Bearer token injection, language preferences,
 * and automated failover handling.
 */
export const apiClient = axios.create({
  baseURL: PRIMARY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * 1. Reads the JWT token from localStorage ('aquabophelo_token') and attaches it as a Bearer authorization header.
 * 2. Reads the resident's preferred language code ('aquabophelo_lang') and sets the 'Accept-Language' header.
 */
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

// Response interceptor: handles network fallback & 401 session expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // AUTH-06: Automatic session expiry handling on 401 Unauthorized
    if (error.response?.status === 401) {
      const isAuthEndpoint = originalRequest.url && (
        originalRequest.url.includes('/auth/login') ||
        originalRequest.url.includes('/auth/register') ||
        originalRequest.url.includes('/auth/forgot-password') ||
        originalRequest.url.includes('/auth/reset-password')
      );

      // Only redirect if an existing token was present and this is not an auth form attempt
      if (!isAuthEndpoint && localStorage.getItem('aquabophelo_token')) {
        localStorage.removeItem('aquabophelo_token');
        localStorage.removeItem('aquabophelo_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // If in local development and HTTPS fails due to network/certificate error, attempt localhost fallback
    if (
      import.meta.env.DEV &&
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
