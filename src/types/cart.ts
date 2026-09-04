import { Product, ProductVariant } from './product';

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id?: number | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  customization_snapshot?: any;
  product?: Product;
  variant?: ProductVariant;
}

export interface Coupon {
  id: number;
  code: string;
  type: 'fixed' | 'percentage';
  value: number;
  min_order_amount?: number | null;
  max_discount_amount?: number | null;
  is_active: boolean;
}

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  discount_amount?: number;
  tax_amount?: number;
  shipping_amount?: number;
  grand_total?: number;
}

export interface Cart {
  id: number;
  user_id?: number | null;
  guest_token?: string | null;
  coupon_id?: number | null;
  subtotal: number;
  total: number;
  items: CartItem[];
  coupon?: Coupon | null;
}
