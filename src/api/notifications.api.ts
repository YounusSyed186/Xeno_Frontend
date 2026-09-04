import { apiClient } from './client';
import { Notification } from '../types/order';
import { ApiResponse, PaginatedResponse } from '../types/api';

export const notificationsApi = {
  async getNotifications(params?: { page?: number; per_page?: number }): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    return apiClient<PaginatedResponse<Notification>>('/notifications', { params });
  },

  async getUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
    return apiClient<{ unread_count: number }>('/notifications/unread-count');
  },

  async markAsRead(notificationId: number): Promise<ApiResponse<object>> {
    return apiClient<object>(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },

  async markAllAsRead(): Promise<ApiResponse<object>> {
    return apiClient<object>('/notifications/read-all', {
      method: 'POST',
    });
  },
};