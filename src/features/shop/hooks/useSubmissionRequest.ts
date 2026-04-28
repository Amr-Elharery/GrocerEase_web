import { useMutation } from '@tanstack/react-query';
import { submissionRequestService } from '../api/submissionRequestService';

export function useSubmitProductRequest() {
  return useMutation({
    mutationFn: (data: unknown) => submissionRequestService.submitRequest(data),
  });
}