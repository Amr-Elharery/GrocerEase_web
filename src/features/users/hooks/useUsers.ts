import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/userService';

export function useUsers(role: string = "", status: string = "") {
  return useQuery({
    queryKey: ['users', role, status],
    queryFn: () => userService.getUsers({ role, status }),
    placeholderData: (prev) => prev,
  });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.suspendUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useReactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.reactivateUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}