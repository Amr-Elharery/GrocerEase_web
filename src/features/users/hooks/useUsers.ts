import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/userService';
import type { User } from '../api/userService';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => userService.createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
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

export function useChangeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role, shop_ids }: { id: string; role: User["role"]; shop_ids?: string[] }) =>
      userService.changeRole(id, role, shop_ids),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
    },
  });
}