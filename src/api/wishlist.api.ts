import { apiClient } from './client';
import { Wishlist, WishlistItem } from '../types/order';
import { ApiResponse } from '../types/api';

export const wishlistApi = {
  async getWishlist(): Promise<ApiResponse<{ wishlist: Wishlist }>> {
    return apiClient<{ wishlist: Wishlist }>('/wishlist');
  },

  async addToWishlist(productId: number, variantId?: number): Promise<ApiResponse<{ wishlist: Wishlist }>> {
    return apiClient<{ wishlist: Wishlist }>('/wishlist', {
      method: 'POST',
      body: { product_id: productId, variant_id: variantId },
    });
  },

  async removeFromWishlist(productId: number): Promise<ApiResponse<object>> {
    return apiClient<object>(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },

  async moveToCart(productId: number): Promise<ApiResponse<{ cart: any }>> {
    return apiClient<{ cart: any }>(`/wishlist/${productId}/move-to-cart`, {
      method: 'POST',
    });
  },
};