import axios from 'axios';

const http = axios.create({
baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ بيضيف الـ token تلقائياً في كل request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ لو الـ token انتهى يرجع للـ login
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default http;
