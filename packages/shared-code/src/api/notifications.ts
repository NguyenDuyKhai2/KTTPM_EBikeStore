import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";
import type { NotificationItem, UnreadNotificationCount } from "../types";

export const notificationAPI = {
  list: async () => {
    const response = await apiClient.get<NotificationItem[]>(API_ENDPOINTS.notifications.list);
    return response.data;
  },
  unreadCount: async () => {
    const response = await apiClient.get<UnreadNotificationCount>(API_ENDPOINTS.notifications.unreadCount);
    return response.data;
  },
  markRead: async (id: number | string) => {
    const response = await apiClient.patch<NotificationItem>(API_ENDPOINTS.notifications.markRead(id));
    return response.data;
  },
  markAllRead: async () => {
    await apiClient.patch(API_ENDPOINTS.notifications.markAllRead);
  }
};
