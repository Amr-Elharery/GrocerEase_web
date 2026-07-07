import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../api/notificationService";

export function useNotifications(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ["notifications", page, perPage],
    queryFn: () => notificationService.getNotifications(page, perPage),
    refetchInterval: 60000, 
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}