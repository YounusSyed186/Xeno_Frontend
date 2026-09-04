/**
 * Xeno Craft Admin API layer — maps 1:1 to backend/routes/api.php.
 * Envelope: { success, message, data }; lists: data.<key> + data.pagination.
 */
import { apiClient } from './client';
import type { ApiResponse } from '../types/api';

export interface PaginationMeta { current_page: number; last_page: number; per_page: number; total: number; }
export interface PaginatedList<T = any> { pagination: PaginationMeta; [key: string]: any; }

// Dashboard / Analytics / Search
export const dashboardApi = {
  getDashboard: () => apiClient('/admin/dashboard'),
  getAnalytics: (params?: { period?: '7d' | '30d' | '90d' | '1y' }) => apiClient('/admin/analytics', { params }),
  search: (q: string) => apiClient('/admin/search', { params: { q } }),
};

// Users
export const usersApi = {
  list: (params?: { search?: string; status?: string; role?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/users', { params }),
  get: (id: number | string) => apiClient(`/admin/users/${id}`),
  update: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/users/${id}`, { method: 'PATCH', body: payload }),
  suspend: (id: number | string) => apiClient(`/admin/users/${id}/suspend`, { method: 'POST' }),
  activate: (id: number | string) => apiClient(`/admin/users/${id}/activate`, { method: 'POST' }),
};

// Roles & Permissions
export const rolesApi = {
  list: () => apiClient('/admin/roles'),
  permissions: () => apiClient('/admin/permissions'),
  create: (payload: { name: string; label: string; description?: string; permissions?: number[] }) =>
    apiClient('/admin/roles', { method: 'POST', body: payload }),
  update: (id: number | string, payload: { label?: string; description?: string; permissions?: number[] }) =>
    apiClient(`/admin/roles/${id}`, { method: 'PATCH', body: payload }),
  destroy: (id: number | string) => apiClient(`/admin/roles/${id}`, { method: 'DELETE' }),
};

// Products
export const productsApi = {
  list: (params?: { search?: string; status?: string; category_id?: number; brand_id?: number; collection_id?: number; page?: number; per_page?: number }) =>
    apiClient('/admin/products', { params }),
  get: (id: number | string) => apiClient(`/admin/products/${id}`),
  create: (payload: Record<string, any>) => apiClient('/admin/products', { method: 'POST', body: payload }),
  update: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/products/${id}`, { method: 'PATCH', body: payload }),
  destroy: (id: number | string) => apiClient(`/admin/products/${id}`, { method: 'DELETE' }),
  restore: (id: number | string) => apiClient(`/admin/products/${id}/restore`, { method: 'POST' }),
  duplicate: (id: number | string) => apiClient(`/admin/products/${id}/duplicate`, { method: 'POST' }),
};

// Taxonomy (categories, collections, brands, sizes, colors, materials, variants)
function taxonomyApi(resource: string) {
  return {
    list: (params?: Record<string, any>) => apiClient(`/admin/${resource}`, { params }),
    create: (payload: Record<string, any>) => apiClient(`/admin/${resource}`, { method: 'POST', body: payload }),
    update: (id: number | string, payload: Record<string, any>) =>
      apiClient(`/admin/${resource}/${id}`, { method: 'PATCH', body: payload }),
    destroy: (id: number | string) => apiClient(`/admin/${resource}/${id}`, { method: 'DELETE' }),
  };
}
export const categoriesApi = taxonomyApi('categories');
export const collectionsApi = taxonomyApi('collections');
export const brandsApi = taxonomyApi('brands');
export const sizesApi = taxonomyApi('sizes');
export const colorsApi = taxonomyApi('colors');
export const materialsApi = taxonomyApi('materials');
export const variantsApi = taxonomyApi('variants');

// Customization
export const customizationApi = {
  index: () => apiClient('/admin/customization'),
  printingMethods: () => apiClient('/admin/customization/printing-methods'),
  createPrintingMethod: (payload: Record<string, any>) =>
    apiClient('/admin/customization/printing-methods', { method: 'POST', body: payload }),
  updatePrintingMethod: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/customization/printing-methods/${id}`, { method: 'PATCH', body: payload }),
  destroyPrintingMethod: (id: number | string) =>
    apiClient(`/admin/customization/printing-methods/${id}`, { method: 'DELETE' }),
  options: () => apiClient('/admin/customization/options'),
  createOption: (payload: Record<string, any>) =>
    apiClient('/admin/customization/options', { method: 'POST', body: payload }),
  updateOption: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/customization/options/${id}`, { method: 'PATCH', body: payload }),
  destroyOption: (id: number | string) =>
    apiClient(`/admin/customization/options/${id}`, { method: 'DELETE' }),
  artworks: (params?: { status?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/customization/artworks', { params }),
  updateArtworkStatus: (id: number | string, status: string) =>
    apiClient(`/admin/customization/artworks/${id}`, { method: 'PATCH', body: { status } }),
};

// Pricing tiers
export const pricingApi = {
  list: (params?: { product_id?: number; active_only?: boolean; page?: number }) =>
    apiClient('/admin/pricing', { params }),
  createTier: (payload: Record<string, any>) => apiClient('/admin/pricing/tiers', { method: 'POST', body: payload }),
  updateTier: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/pricing/tiers/${id}`, { method: 'PATCH', body: payload }),
  destroyTier: (id: number | string) => apiClient(`/admin/pricing/tiers/${id}`, { method: 'DELETE' }),
};

// Orders
export const ORDER_STATUSES = [
  'pending_payment', 'payment_confirmed', 'artwork_review', 'artwork_approved',
  'production', 'quality_control', 'packed', 'dispatched', 'delivered', 'cancelled', 'returned',
] as const;

export const ordersApi = {
  list: (params?: { search?: string; status?: string; payment_status?: string; date_from?: string; date_to?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/orders', { params }),
  get: (id: number | string) => apiClient(`/admin/orders/${id}`),
  updateStatus: (id: number | string, status: string, note?: string) =>
    apiClient(`/admin/orders/${id}/status`, { method: 'POST', body: { status, note } }),
  generateInvoice: (id: number | string) => apiClient(`/admin/orders/${id}/generate-invoice`, { method: 'POST' }),
  addNote: (id: number | string, note: string) =>
    apiClient(`/admin/orders/${id}/notes`, { method: 'POST', body: { note } }),
  refund: (id: number | string, amount: number, reason: string) =>
    apiClient(`/admin/orders/${id}/refund`, { method: 'POST', body: { amount, reason } }),
};

// Payments
export const paymentsApi = {
  list: (params?: { search?: string; status?: string; gateway?: string; date_from?: string; date_to?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/payments', { params }),
  get: (id: number | string) => apiClient(`/admin/payments/${id}`),
  refund: (id: number | string, amount: number, reason: string) =>
    apiClient(`/admin/payments/${id}/refund`, { method: 'POST', body: { amount, reason } }),
  refunds: (params?: { page?: number; per_page?: number }) => apiClient('/admin/refunds', { params }),
};

// Production
export const PRODUCTION_STAGES = [
  'artwork_review', 'artwork_approved', 'production', 'quality_control', 'packed', 'dispatched', 'delivered',
] as const;

export const productionApi = {
  list: (params?: { stage?: string; search?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/production', { params }),
  pipeline: () => apiClient('/admin/production/pipeline'),
  get: (id: number | string) => apiClient(`/admin/production/${id}`),
  advance: (id: number | string, note?: string) =>
    apiClient(`/admin/production/${id}/advance`, { method: 'POST', body: { note } }),
  setStage: (id: number | string, stage: string, note?: string) =>
    apiClient(`/admin/production/${id}/stage`, { method: 'POST', body: { stage, note } }),
};

// Inventory
export const inventoryApi = {
  dashboard: () => apiClient('/admin/inventory'),
  warehouses: (params?: { active_only?: boolean; page?: number; per_page?: number }) =>
    apiClient('/admin/inventory/warehouses', { params }),
  createWarehouse: (payload: Record<string, any>) =>
    apiClient('/admin/inventory/warehouses', { method: 'POST', body: payload }),
  updateWarehouse: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/inventory/warehouses/${id}`, { method: 'PATCH', body: payload }),
  stock: (params?: { warehouse_id?: number; product_id?: number; search?: string; low_stock_only?: boolean; out_of_stock_only?: boolean; page?: number; per_page?: number }) =>
    apiClient('/admin/inventory/stock', { params }),
  movements: (params?: { warehouse_id?: number; type?: string; date_from?: string; date_to?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/inventory/movements', { params }),
  adjust: (payload: { stock_id: number; quantity: number; type: 'adjustment'; note?: string }) =>
    apiClient('/admin/inventory/adjustments', { method: 'POST', body: payload }),
  lowStock: (params?: { page?: number; per_page?: number }) => apiClient('/admin/inventory/low-stock', { params }),
  suppliers: (params?: { active_only?: boolean; page?: number; per_page?: number }) =>
    apiClient('/admin/inventory/suppliers', { params }),
  createSupplier: (payload: Record<string, any>) =>
    apiClient('/admin/inventory/suppliers', { method: 'POST', body: payload }),
  updateSupplier: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/inventory/suppliers/${id}`, { method: 'PATCH', body: payload }),
  purchaseOrders: (params?: { status?: string; supplier_id?: number; page?: number; per_page?: number }) =>
    apiClient('/admin/inventory/purchase-orders', { params }),
  createPurchaseOrder: (payload: Record<string, any>) =>
    apiClient('/admin/inventory/purchase-orders', { method: 'POST', body: payload }),
  updatePurchaseOrder: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/inventory/purchase-orders/${id}`, { method: 'PATCH', body: payload }),
  receivePurchaseOrder: (id: number | string, items: Array<{ purchase_order_item_id: number; received_quantity: number }>) =>
    apiClient(`/admin/inventory/purchase-orders/${id}/receive`, { method: 'POST', body: { items } }),
};

// Shipments
export const SHIPMENT_STATUSES = ['pending', 'dispatched', 'in_transit', 'delivered', 'failed'] as const;

export const shipmentsApi = {
  list: (params?: { status?: string; courier?: string; search?: string; date_from?: string; date_to?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/shipments', { params }),
  get: (id: number | string) => apiClient(`/admin/shipments/${id}`),
  addTrackingEvent: (id: number | string, payload: { status: string; location?: string; description?: string; occurred_at?: string }) =>
    apiClient(`/admin/shipments/${id}/tracking`, { method: 'POST', body: payload }),
  update: (id: number | string, payload: { tracking_number?: string; courier?: string; status?: string; estimated_delivery_at?: string }) =>
    apiClient(`/admin/shipments/${id}`, { method: 'PATCH', body: payload }),
};

// Invoices
export const invoicesApi = {
  list: (params?: { status?: string; search?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/invoices', { params }),
  get: (id: number | string) => apiClient(`/admin/invoices/${id}`),
  downloadUrl: (id: number | string) => {
    const base = (import.meta.env as Record<string, string>)['VITE_API_URL'] || 'http://localhost:8000/api/v1';
    return `${base}/admin/invoices/${id}/download`;
  },
};

// Coupons
export const couponsApi = {
  list: (params?: { search?: string; type?: string; active_only?: boolean; expired_only?: boolean; page?: number; per_page?: number }) =>
    apiClient('/admin/coupons', { params }),
  create: (payload: Record<string, any>) => apiClient('/admin/coupons', { method: 'POST', body: payload }),
  update: (id: number | string, payload: Record<string, any>) =>
    apiClient(`/admin/coupons/${id}`, { method: 'PATCH', body: payload }),
  destroy: (id: number | string) => apiClient(`/admin/coupons/${id}`, { method: 'DELETE' }),
};

// Reviews
export const reviewsApi = {
  list: (params?: { status?: string; rating?: number; search?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/reviews', { params }),
  update: (id: number | string, payload: { status: string; rating?: number }) =>
    apiClient(`/admin/reviews/${id}`, { method: 'PATCH', body: payload }),
  destroy: (id: number | string) => apiClient(`/admin/reviews/${id}`, { method: 'DELETE' }),
};

// Support
export const supportApi = {
  list: (params?: { status?: string; priority?: string; assigned_to?: number; search?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/support', { params }),
  get: (id: number | string) => apiClient(`/admin/support/${id}`),
  reply: (id: number | string, message: string) =>
    apiClient(`/admin/support/${id}/messages`, { method: 'POST', body: { message } }),
  update: (id: number | string, payload: { status?: string; priority?: string; assigned_to?: number | null }) =>
    apiClient(`/admin/support/${id}`, { method: 'PATCH', body: payload }),
  assign: (id: number | string, assignedTo: number) =>
    apiClient(`/admin/support/${id}/assign`, { method: 'POST', body: { assigned_to: assignedTo } }),
  close: (id: number | string) => apiClient(`/admin/support/${id}/close`, { method: 'POST' }),
};

// CMS
export const cmsApi = {
  pages: {
    list: (params?: { status?: string; search?: string; page?: number; per_page?: number }) =>
      apiClient('/admin/cms/pages', { params }),
    create: (payload: Record<string, any>) => apiClient('/admin/cms/pages', { method: 'POST', body: payload }),
    update: (id: number | string, payload: Record<string, any>) =>
      apiClient(`/admin/cms/pages/${id}`, { method: 'PATCH', body: payload }),
    destroy: (id: number | string) => apiClient(`/admin/cms/pages/${id}`, { method: 'DELETE' }),
  },
  blogs: {
    list: (params?: { status?: string; category?: string; search?: string; page?: number; per_page?: number }) =>
      apiClient('/admin/cms/blogs', { params }),
    create: (payload: Record<string, any>) => apiClient('/admin/cms/blogs', { method: 'POST', body: payload }),
    update: (id: number | string, payload: Record<string, any>) =>
      apiClient(`/admin/cms/blogs/${id}`, { method: 'PATCH', body: payload }),
    destroy: (id: number | string) => apiClient(`/admin/cms/blogs/${id}`, { method: 'DELETE' }),
  },
  faqs: {
    list: (params?: { category?: string; active_only?: boolean; page?: number; per_page?: number }) =>
      apiClient('/admin/cms/faqs', { params }),
    create: (payload: Record<string, any>) => apiClient('/admin/cms/faqs', { method: 'POST', body: payload }),
    update: (id: number | string, payload: Record<string, any>) =>
      apiClient(`/admin/cms/faqs/${id}`, { method: 'PATCH', body: payload }),
    destroy: (id: number | string) => apiClient(`/admin/cms/faqs/${id}`, { method: 'DELETE' }),
  },
  caseStudies: {
    list: (params?: { status?: string; search?: string; page?: number; per_page?: number }) =>
      apiClient('/admin/cms/case-studies', { params }),
    create: (payload: Record<string, any>) => apiClient('/admin/cms/case-studies', { method: 'POST', body: payload }),
    update: (id: number | string, payload: Record<string, any>) =>
      apiClient(`/admin/cms/case-studies/${id}`, { method: 'PATCH', body: payload }),
    destroy: (id: number | string) => apiClient(`/admin/cms/case-studies/${id}`, { method: 'DELETE' }),
  },
};

// Settings / Audit logs / Notifications
export const settingsApi = {
  get: () => apiClient('/admin/settings'),
  update: (settings: Array<{ key: string; value?: string; group?: string }>) =>
    apiClient('/admin/settings', { method: 'POST', body: { settings } }),
};

export const auditLogsApi = {
  list: (params?: { user_id?: number; action?: string; auditable_type?: string; date_from?: string; date_to?: string; page?: number; per_page?: number }) =>
    apiClient('/admin/audit-logs', { params }),
};

export const adminNotificationsApi = {
  list: () => apiClient('/admin/notifications'),
};