import { apiClient } from './client';
import { Cart, PricingBreakdown } from '../types/cart';
import { ApiResponse } from '../types/api';

export interface AddToCartPayload {
  product_id: number;
  variant_id?: number | null;
  quantity: number;
  customization?: any;
}

export const cartApi = {
  async getCart(): Promise<ApiResponse<{ cart: Cart; breakdown: PricingBreakdown; guest_token: string }>> {
    return apiClient<{ cart: Cart; breakdown: PricingBreakdown; guest_token: string }>('/cart');
  },

  async addItem(payload: AddToCartPayload): Promise<ApiResponse<{ cart: Cart; breakdown: PricingBreakdown }>> {
    return apiClient<{ cart: Cart; breakdown: PricingBreakdown }>('/cart/items', {
      method: 'POST',
      body: payload,
    });
  },

  async updateItem(cartItemId: number, quantity: number): Promise<ApiResponse<{ cart: Cart; breakdown: PricingBreakdown }>> {
    return apiClient<{ cart: Cart; breakdown: PricingBreakdown }>(`/cart/items/${cartItemId}`, {
      method: 'PATCH',
      body: { quantity },
    });
  },

  async removeItem(cartItemId: number): Promise<ApiResponse<{ cart: Cart; breakdown: PricingBreakdown }>> {
    return apiClient<{ cart: Cart; breakdown: PricingBreakdown }>(`/cart/items/${cartItemId}`, {
      method: 'DELETE',
    });
  },

  async applyCoupon(code: string): Promise<ApiResponse<{ cart: Cart; breakdown: PricingBreakdown }>> {
    return apiClient<{ cart: Cart; breakdown: PricingBreakdown }>('/cart/coupon', {
      method: 'POST',
      body: { code },
    });
  },

  async removeCoupon(): Promise<ApiResponse<{ cart: Cart; breakdown: PricingBreakdown }>> {
    return apiClient<{ cart: Cart; breakdown: PricingBreakdown }>('/cart/coupon', {
      method: 'DELETE',
    });
  },

  async mergeGuestCart(): Promise<ApiResponse<{ cart: Cart; breakdown: PricingBreakdown }>> {
    return apiClient<{ cart: Cart; breakdown: PricingBreakdown }>('/cart/merge', {
      method: 'GET',
    });
  },
};
