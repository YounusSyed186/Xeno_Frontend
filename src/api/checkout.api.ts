import { apiClient } from './client';
import { Order } from '../types/order';
import { ApiResponse } from '../types/api';

export interface CheckoutPayload {
  shipping_address_id: number;
  billing_address_id?: number;
  payment_method: 'stripe' | 'razorpay' | 'cod';
  notes?: string;
}

export const checkoutApi = {
  async checkout(payload: CheckoutPayload): Promise<ApiResponse<{ order: Order; payment_intent?: any }>> {
    return apiClient<{ order: Order; payment_intent?: any }>('/checkout', {
      method: 'POST',
      body: payload,
    });
  },

  async initiatePayment(orderId: number, method: string): Promise<ApiResponse<{ payment_intent: any }>> {
    return apiClient<{ payment_intent: any }>('/payments/checkout', {
      method: 'POST',
      body: { order_id: orderId, payment_method: method },
    });
  },

  async verifyPayment(paymentId: number, payload: any): Promise<ApiResponse<{ order: Order; status: string }>> {
    return apiClient<{ order: Order; status: string }>(`/payments/${paymentId}/verify`, {
      method: 'POST',
      body: payload,
    });
  },
};
