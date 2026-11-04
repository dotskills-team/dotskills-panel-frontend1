import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";

export interface INotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationList {
  items: INotification[];
  unreadCount: number;
}

const BASE_URL = "/notifications";

export const notificationApi = {
  list: () => apiClient.get<ApiResponse<NotificationList>>(BASE_URL),
  markRead: (id: string) => apiClient.patch<ApiResponse<null>>(`${BASE_URL}/${id}/read`),
  markAllRead: () => apiClient.patch<ApiResponse<null>>(`${BASE_URL}/read-all`),
};
