import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '@/Context/AuthContext';
import { authService } from '../api/authService';

function getJwtExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) return payload.exp * 1000; 
  } catch {
    /* ignore */
  }
  return Date.now() + 24 * 60 * 60 * 1000;
}

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authService.login(data.email, data.password),
    onSuccess: (res) => {
      qc.clear();

      login(res.access_token, getJwtExpiry(res.access_token));
      localStorage.setItem('refresh_token', res.refresh_token);

      const roles = res.user_data?.roles ?? [];
      const isStore = roles.some(
        (r) => r.toLowerCase().includes('store') || r.toLowerCase().includes('vendor')
      );
      navigate(isStore ? '/store/inventory' : '/app/home');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: {
      full_name: string;
      email: string;
      phone: string;
      password: string;
      confirmPassword: string;
      accountType: 'admin' | 'vendor';
    }) => {
      const { accountType, ...payload } = data;
      return authService.register(payload, accountType);
    },
    onSuccess: () => navigate('/auth/login'),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (_: { token: string; newPassword: string; confirmPassword: string }) => {
      return {};
    },
    onSuccess: () => navigate('/auth/login'),
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const qc = useQueryClient();

  return () => {
    authService.logout().catch(() => {});
    logout();
    localStorage.removeItem('refresh_token');
    qc.clear(); 
    navigate('/auth/login');
  };
}