import { apiClient } from './client';
import { Review } from '../types/order';
import { ApiResponse } from '../types/api';

export const reviewsApi = {
  async getEligibleReviews(): Promise<ApiResponse<{ eligible: any[] }>> {
    return apiClient<{ eligible: any[] }>('/reviews/eligible');
  },

  async getProductReviews(productId: number): Promise<ApiResponse<{ reviews: Review[] }>> {
    return apiClient<{ reviews: Review[] }>(`/products/${productId}/reviews`);
  },

  async createReview(payload: { product_id: number; rating: number; title?: string; comment?: string }): Promise<ApiResponse<{ review: Review }>> {
    return apiClient<{ review: Review }>('/reviews', {
      method: 'POST',
      body: payload,
    });
  },

  async updateReview(id: number, payload: { rating?: number; title?: string; comment?: string }): Promise<ApiResponse<{ review: Review }>> {
    return apiClient<{ review: Review }>(`/reviews/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  },

  async deleteReview(id: number): Promise<ApiResponse<object>> {
    return apiClient<object>(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },
};
