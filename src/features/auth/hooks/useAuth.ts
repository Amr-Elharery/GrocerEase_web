import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (_: { email: string; password: string }) => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('expiry', String(Date.now() + 5 * 60 * 1000));
      return { token: 'fake-token' };
    },
    onSuccess: () => navigate("/app/home"),
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (_: { name: string; email: string; password: string }) => ({}),
    onSuccess: () => navigate("/app/home"),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (_: string) => ({}),
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (_: { token: string; newPassword: string; confirmPassword: string }) => ({}),
    onSuccess: () => navigate("/auth/login"),
  });
}
