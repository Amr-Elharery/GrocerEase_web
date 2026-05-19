import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '@/Context/AuthContext';

export function useLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // TODO: replace with real API call
      // const res = await authService.login(data.email, data.password);
      // return res; // { token, expiry, role }

      const role = data.email.includes("store") ? "store_manager" : "admin";
      return { token: "fake-token", expiry: Date.now() + 5 * 60 * 1000, role };
    },
    onSuccess: (data) => {
      login(data.token, data.expiry);
      if (data.role === "store_manager") {
        navigate("/store/inventory");
      } else {
        navigate("/app/home");
      }
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (_: { name: string; email: string; password: string }) => {
      // TODO: replace with real API call
      // const res = await authService.register(name, email, password);
      // return res;
      return {};
    },
    onSuccess: () => navigate("/app/home"),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (_: string) => {
      // TODO: replace with real API call
      // await authService.forgotPassword(email);
      return {};
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (_: { token: string; newPassword: string; confirmPassword: string }) => {
      // TODO: replace with real API call
      // await authService.resetPassword(token, newPassword);
      return {};
    },
    onSuccess: () => navigate("/auth/login"),
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return () => {
    logout();
    navigate("/auth/login");
  };
}