import { apiClient } from './client';
import { Address } from '../types/order';
import { ApiResponse } from '../types/api';

export const addressesApi = {
  async getAddresses(): Promise<ApiResponse<{ addresses: Address[] }>> {
    return apiClient<{ addresses: Address[] }>('/addresses');
  },

  async createAddress(payload: Partial<Address>): Promise<ApiResponse<{ address: Address }>> {
    return apiClient<{ address: Address }>('/addresses', {
      method: 'POST',
      body: payload,
    });
  },

  async updateAddress(id: number, payload: Partial<Address>): Promise<ApiResponse<{ address: Address }>> {
    return apiClient<{ address: Address }>(`/addresses/${id}`, {
      method: 'PUT',
      body: payload,
    });
  },

  async deleteAddress(id: number): Promise<ApiResponse<object>> {
    return apiClient<object>(`/addresses/${id}`, {
      method: 'DELETE',
    });
  },
};
