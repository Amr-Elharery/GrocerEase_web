import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/authService';

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { current_password: string; new_password: string }) =>
      authService.changePassword(data),
  });
}