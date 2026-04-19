import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: () => {
      navigate("/app/home");
    },
    onError: (error) => {
      alert(error.message);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authService.register(data),
    onSuccess: () => {
    navigate("/app/home"); 
   },
    onError: (error) => {
      alert(error.message);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email) => authService.forgotPassword(email),
    onError: (error) => {
      alert(error.message);
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data) => authService.resetPassword(data),
    onSuccess: () => {
      alert('Password reset successful');
      navigate("/auth");
    },
    onError: (error) => {
      alert(error.message);
    },
  });
}
