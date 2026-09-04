import { apiClient } from './client';
import { SupportTicket, SupportMessage } from '../types/order';
import { ApiResponse, PaginatedResponse } from '../types/api';

export const supportApi = {
  async getTickets(params?: { page?: number; per_page?: number }): Promise<ApiResponse<PaginatedResponse<SupportTicket>>> {
    return apiClient<PaginatedResponse<SupportTicket>>('/support', { params });
  },

  async getTicket(ticketId: number): Promise<ApiResponse<{ ticket: SupportTicket }>> {
    return apiClient<{ ticket: SupportTicket }>(`/support/${ticketId}`);
  },

  async createTicket(data: { subject: string; description: string; order_id?: number; priority?: string }): Promise<ApiResponse<{ ticket: SupportTicket }>> {
    return apiClient<{ ticket: SupportTicket }>('/support', {
      method: 'POST',
      body: data,
    });
  },

  async reply(ticketId: number, message: string): Promise<ApiResponse<{ message: SupportMessage }>> {
    return apiClient<{ message: SupportMessage }>(`/support/${ticketId}/messages`, {
      method: 'POST',
      body: { message },
    });
  },

  async close(ticketId: number): Promise<ApiResponse<{ ticket: SupportTicket }>> {
    return apiClient<{ ticket: SupportTicket }>(`/support/${ticketId}/close`, {
      method: 'POST',
    });
  },
};