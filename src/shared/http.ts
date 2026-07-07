import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

type ApiError = {
  message: string;
  status?: number;
  data?: unknown;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const tokenStorageKey = 'auth_token';
const refreshTokenKey = 'refresh_token';

const http: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

const getToken = () => {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(tokenStorageKey) ?? undefined;
};

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (config.headers) delete config.headers['Content-Type'];
  } else {
    config.headers = config.headers ?? {};
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
  }

  return config;
});

function clearSession() {
  localStorage.removeItem(tokenStorageKey);
  localStorage.removeItem('expiry');
  localStorage.removeItem(refreshTokenKey);
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/refresh-token');

    if (status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      const refreshToken = localStorage.getItem(refreshTokenKey);

      if (refreshToken) {
        try {
          const refreshRes = await axios.post(
            `${apiBaseUrl}/auth/refresh-token`,
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } }
          );
          const data = refreshRes.data as string | { access_token?: string };
          const newToken = typeof data === 'string' ? data : data?.access_token;

          if (newToken) {
            localStorage.setItem(tokenStorageKey, newToken);
            original.headers = original.headers ?? {};
            (original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
            return http(original); 
          }
        } catch {
          /*  */
        }
      }

      clearSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    const apiError: ApiError = {
      message: error.message,
      status,
      data: error.response?.data,
    };
    return Promise.reject(apiError);
  }
);

export default http;
export { getToken, tokenStorageKey };