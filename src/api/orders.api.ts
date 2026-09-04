import { apiClient } from './client';
import { Order } from '../types/order';
import { ApiResponse, PaginatedResponse } from '../types/api';

export interface OrderQueryParams {
  page?: number;
  per_page?: number;
  status?: string;
}

export const ordersApi = {
  async getOrders(params?: OrderQueryParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return apiClient<PaginatedResponse<Order>>('/orders', { params });
  },

  async getOrder(orderId: number): Promise<ApiResponse<{ order: Order }>> {
    return apiClient<{ order: Order }>(`/orders/${orderId}`);
  },

  async cancelOrder(orderId: number): Promise<ApiResponse<{ order: Order }>> {
    return apiClient<{ order: Order }>(`/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  },

  async reorder(orderId: number): Promise<ApiResponse<{ order: Order }>> {
    return apiClient<{ order: Order }>(`/orders/${orderId}/reorder`, {
      method: 'POST',
    });
  },
};