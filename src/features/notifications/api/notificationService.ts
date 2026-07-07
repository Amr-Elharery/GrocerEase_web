import http from "@/shared/http";

export interface NotificationItem {
  id: number;
  user_id: string;
  notification_id: number;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  notification: {
    id: number;
    title: string;
    body: string;
    data?: unknown;
    created_at: string;
  };
}

export interface NotificationsResponse {
  data: NotificationItem[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export const notificationService = {
  async getNotifications(page = 1, perPage = 20): Promise<NotificationsResponse> {
    const res = await http.get("/notifications/", {
      params: { page, per_page: perPage },
    });
    return res.data;
  },

  async markAsRead(notificationId: number): Promise<void> {
    await http.patch(`/notifications/${notificationId}/read`);
  },
};