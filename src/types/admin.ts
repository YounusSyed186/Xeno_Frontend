import { Order } from './order';
import { Product } from './product';

export interface DashboardMetrics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  recent_orders: Order[];
  top_products: Product[];
  sales_chart?: any;
}

export interface ProductionOrder {
  id: number;
  order_id: number;
  production_number: string;
  stage: 'artwork_review' | 'artwork_approved' | 'production' | 'quality_control' | 'packed' | 'dispatched' | 'delivered';
  notes?: string | null;
  order?: Order;
  created_at: string;
  updated_at: string;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  location?: string | null;
  is_active: boolean;
}

export interface StockMovement {
  id: number;
  variant_id: number;
  warehouse_id: number;
  quantity_change: number;
  type: 'manual_adjustment' | 'purchase_order' | 'sales_deduction' | 'return';
  reference_number?: string | null;
  reason?: string | null;
  created_at: string;
}

export interface Shipment {
  id: number;
  order_id: number;
  tracking_number: string;
  courier_name: string;
  status: 'pending' | 'dispatched' | 'in_transit' | 'delivered';
  shipped_at?: string | null;
  delivered_at?: string | null;
  order?: Order;
  created_at: string;
}
