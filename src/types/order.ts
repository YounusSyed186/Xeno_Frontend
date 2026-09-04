import { Product, ProductVariant } from './product';

export interface Address {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  type: 'shipping' | 'billing' | 'home' | 'work';
  is_default_shipping: boolean;
  is_default_billing: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id?: number | null;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  customization_snapshot?: any;
  product?: Product;
  variant?: ProductVariant;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: 'pending' | 'processing' | 'in_production' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  tax?: number;
  tax_amount?: number;
  shipping?: number;
  shipping_amount?: number;
  discount?: number;
  discount_amount?: number;
  total?: number;
  total_amount?: number;
  currency: string;
  shipping_address?: Address | any;
  billing_address?: Address | any;
  items: OrderItem[];
  payments?: any[];
  invoices?: any[];
  shipments?: any[];
  status_history?: any[];
  productionOrder?: any;
  production_order?: any;
  placed_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title?: string | null;
  comment?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  user?: { name: string };
  product?: Product;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  ticket_number: string;
  user_id: number;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages?: SupportMessage[];
  created_at: string;
}

export interface SupportMessage {
  id: number;
  support_ticket_id: number;
  user_id: number;
  message: string;
  attachments?: any;
  user?: { name: string; role: string };
  created_at: string;
}

export interface UserNotification {
  id: string;
  type: string;
  data: {
    title: string;
    message: string;
    action_url?: string;
  };
  read_at: string | null;
  created_at: string;
}

export type Notification = UserNotification;

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  variant_id?: number | null;
  quantity: number;
  customization?: any;
  customization_snapshot?: any;
  product?: Product;
  variant?: ProductVariant;
  unit_price?: number;
  line_total?: number;
}

export interface Cart {
  id: number;
  user_id?: number | null;
  items: CartItem[];
  subtotal?: number;
  discount?: number;
  tax?: number;
  shipping?: number;
  total?: number;
  coupon?: any;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product?: Product;
  created_at: string;
}

export interface Wishlist {
  id: number;
  user_id: number;
  items: WishlistItem[];
}
