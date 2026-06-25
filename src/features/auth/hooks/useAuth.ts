import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '@/Context/AuthContext';
import { authService } from '../api/authService';
import { shopApi } from '@/features/shop/api/shopApi';

function getJwtExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp) return payload.exp * 1000; 
  } catch {
    /*  */
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
    onSuccess: async (res) => {
      qc.clear();

      login(res.access_token, getJwtExpiry(res.access_token));
      localStorage.setItem('refresh_token', res.refresh_token);

      const roles = res.user_data?.roles ?? [];
      const isStore = roles.some(
        (r) => r.toLowerCase().includes('store') || r.toLowerCase().includes('vendor')
      );

      if (!isStore) {
        navigate('/app/home');
        return;
      }

      try {
        await shopApi.getMyShop(); 
        navigate('/store/inventory');
      } catch {
        navigate('/store/create-shop');
      }
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      full_name: string;
      email: string;
      phone: string;
      password: string;
      confirmPassword: string;
      accountType: 'admin' | 'vendor';
    }) => {
      const { accountType, ...payload } = data;
      await authService.register(payload, accountType);
      return { accountType, email: data.email, password: data.password };
    },
    onSuccess: async ({ accountType, email, password }) => {
      if (accountType === 'admin') {
        navigate('/auth/login');
        return;
      }

      try {
        const res = await authService.login(email, password);
        qc.clear();
        login(res.access_token, getJwtExpiry(res.access_token));
        localStorage.setItem('refresh_token', res.refresh_token);
        navigate('/store/create-shop');
      } catch {
        navigate('/auth/login');
      }
    },
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
    authService.logout().catch(() => {/*    */});
    logout();
    localStorage.removeItem('refresh_token');
    qc.clear(); 
    navigate('/auth/login');
  };
}