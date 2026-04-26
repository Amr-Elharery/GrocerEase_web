import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionService } from '../api/submissionService';

export function useSubmissions() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: () => submissionService.getSubmissions(),
  });
}
export function useApproveSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, _imageKept }: { id: string; data: unknown; _imageKept?: boolean }) =>
  submissionService.approveSubmission(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submissions'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
export function useRejectSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      submissionService.rejectSubmission(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['submissions'] });
    },
  });
}