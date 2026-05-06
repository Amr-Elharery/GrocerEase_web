import { useQuery, useMutation } from '@tanstack/react-query';
import { supportService } from '../api/supportService';

export function useSupportCategories() {
  return useQuery({
    queryKey: ['support-categories'],
    queryFn: () => supportService.getCategories(),
  });
}

export function useSystemStatus() {
  return useQuery({
    queryKey: ['support-system-status'],
    queryFn: () => supportService.getSystemStatus(),
  });
}

export function useDocLinks() {
  return useQuery({
    queryKey: ['support-doc-links'],
    queryFn: () => supportService.getDocLinks(),
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: ['support-contact'],
    queryFn: () => supportService.getContactInfo(),
  });
}

export function useSubmitTicket() {
  return useMutation({
    mutationFn: (data: { subject: string; message: string; email: string }) =>
      supportService.submitTicket(data),
  });
}