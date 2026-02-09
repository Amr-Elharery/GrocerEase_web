import axios, { AxiosError, type AxiosInstance } from 'axios';

type ApiError = {
  message: string;
  status?: number;
  data?: unknown;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const tokenStorageKey = 'auth_token';

const http: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
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
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(apiError);
  }
);

export default http;
export { getToken, tokenStorageKey };
