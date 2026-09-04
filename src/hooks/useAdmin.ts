import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  dashboardApi, usersApi, rolesApi, productsApi, categoriesApi, collectionsApi, brandsApi,
  sizesApi, colorsApi, materialsApi, variantsApi, customizationApi, pricingApi, ordersApi,
  paymentsApi, productionApi, inventoryApi, shipmentsApi, invoicesApi, couponsApi, reviewsApi,
  supportApi, cmsApi, settingsApi, auditLogsApi,
} from '../api/admin.api';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Dashboard / Analytics
// ---------------------------------------------------------------------------

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.getDashboard();
      return res.data;
    },
  });
}

export function useAdminAnalytics(period: string = '30d') {
  return useQuery({
    queryKey: ['admin', 'analytics', period],
    queryFn: async () => {
      const res = await dashboardApi.getAnalytics({ period: period as any });
      return res.data;
    },
  });
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export function useAdminUsers(params?: any) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const res = await usersApi.list(params);
      return res.data;
    },
  });
}

export function useAdminUser(id: number | string) {
  return useQuery({
    queryKey: ['admin', 'users', id],
    queryFn: async () => {
      const res = await usersApi.get(id);
      return res.data?.user;
    },
    enabled: !!id,
  });
}

export function useAdminUserMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'users'] });

  const suspend = useMutation({
    mutationFn: (id: number | string) => usersApi.suspend(id),
    onSuccess: () => { toast.success('User suspended'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to suspend user'),
  });
  const activate = useMutation({
    mutationFn: (id: number | string) => usersApi.activate(id),
    onSuccess: () => { toast.success('User activated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to activate user'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: Record<string, any> }) => usersApi.update(id, payload),
    onSuccess: () => { toast.success('User updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update user'),
  });

  return { suspend: suspend.mutate, activate: activate.mutate, update: update.mutate };
}

// ---------------------------------------------------------------------------
// Roles & Permissions
// ---------------------------------------------------------------------------

export function useAdminRoles() {
  return useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: async () => {
      const res = await rolesApi.list();
      return res.data?.roles || [];
    },
  });
}

export function useAdminPermissions() {
  return useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: async () => {
      const res = await rolesApi.permissions();
      return res.data?.permissions || [];
    },
  });
}

export function useAdminRoleMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'roles'] });

  const create = useMutation({
    mutationFn: (payload: any) => rolesApi.create(payload),
    onSuccess: () => { toast.success('Role created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create role'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => rolesApi.update(id, payload),
    onSuccess: () => { toast.success('Role updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update role'),
  });
  const destroy = useMutation({
    mutationFn: (id: number | string) => rolesApi.destroy(id),
    onSuccess: () => { toast.success('Role deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete role'),
  });

  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export function useAdminProducts(params?: any) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const res = await productsApi.list(params);
      return res.data;
    },
  });
}

export function useAdminProduct(id: number | string) {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: async () => {
      const res = await productsApi.get(id);
      return res.data?.product;
    },
    enabled: !!id,
  });
}

export function useAdminProductMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'products'] });

  const create = useMutation({
    mutationFn: (payload: any) => productsApi.create(payload),
    onSuccess: () => { toast.success('Product created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create product'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => productsApi.update(id, payload),
    onSuccess: () => { toast.success('Product updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update product'),
  });
  const destroy = useMutation({
    mutationFn: (id: number | string) => productsApi.destroy(id),
    onSuccess: () => { toast.success('Product archived'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to archive product'),
  });
  const restore = useMutation({
    mutationFn: (id: number | string) => productsApi.restore(id),
    onSuccess: () => { toast.success('Product restored'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to restore product'),
  });
  const duplicate = useMutation({
    mutationFn: (id: number | string) => productsApi.duplicate(id),
    onSuccess: () => { toast.success('Product duplicated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to duplicate product'),
  });

  return {
    createProduct: create.mutate,
    updateProduct: update.mutate,
    deleteProduct: destroy.mutate,
    restoreProduct: restore.mutate,
    duplicateProduct: duplicate.mutate,
  };
}

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------

export function useAdminCategories(params?: any) {
  return useQuery({
    queryKey: ['admin', 'categories', params],
    queryFn: async () => {
      const res = await categoriesApi.list(params);
      return res.data?.categories || res.data?.items || [];
    },
  });
}

export function useAdminCollections(params?: any) {
  return useQuery({
    queryKey: ['admin', 'collections', params],
    queryFn: async () => {
      const res = await collectionsApi.list(params);
      return res.data?.collections || res.data?.items || [];
    },
  });
}

export function useAdminBrands(params?: any) {
  return useQuery({
    queryKey: ['admin', 'brands', params],
    queryFn: async () => {
      const res = await brandsApi.list(params);
      return res.data?.brands || res.data?.items || [];
    },
  });
}

export function useAdminSizes() {
  return useQuery({
    queryKey: ['admin', 'sizes'],
    queryFn: async () => {
      const res = await sizesApi.list();
      return res.data?.sizes || res.data?.items || [];
    },
  });
}

export function useAdminColors() {
  return useQuery({
    queryKey: ['admin', 'colors'],
    queryFn: async () => {
      const res = await colorsApi.list();
      return res.data?.colors || res.data?.items || [];
    },
  });
}

export function useAdminMaterials() {
  return useQuery({
    queryKey: ['admin', 'materials'],
    queryFn: async () => {
      const res = await materialsApi.list();
      return res.data?.materials || res.data?.items || [];
    },
  });
}

export function useAdminVariants(params?: any) {
  return useQuery({
    queryKey: ['admin', 'variants', params],
    queryFn: async () => {
      const res = await variantsApi.list(params);
      return res.data?.variants || res.data?.items || [];
    },
  });
}

export function useAdminVariantMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'variants'] });
  const create = useMutation({ mutationFn: (payload: any) => variantsApi.create(payload), onSuccess: () => { toast.success('Variant created'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to create variant') });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number | string; payload: any }) => variantsApi.update(id, payload), onSuccess: () => { toast.success('Variant updated'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to update variant') });
  const destroy = useMutation({ mutationFn: (id: number | string) => variantsApi.destroy(id), onSuccess: () => { toast.success('Variant deleted'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to delete variant') });
  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

export function useAdminCategoryMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
  const create = useMutation({ mutationFn: (payload: any) => categoriesApi.create(payload), onSuccess: () => { toast.success('Category created'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to create category') });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number | string; payload: any }) => categoriesApi.update(id, payload), onSuccess: () => { toast.success('Category updated'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to update category') });
  const destroy = useMutation({ mutationFn: (id: number | string) => categoriesApi.destroy(id), onSuccess: () => { toast.success('Category deleted'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to delete category') });
  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

export function useAdminCollectionMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'collections'] });
  const create = useMutation({ mutationFn: (payload: any) => collectionsApi.create(payload), onSuccess: () => { toast.success('Collection created'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to create collection') });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number | string; payload: any }) => collectionsApi.update(id, payload), onSuccess: () => { toast.success('Collection updated'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to update collection') });
  const destroy = useMutation({ mutationFn: (id: number | string) => collectionsApi.destroy(id), onSuccess: () => { toast.success('Collection deleted'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to delete collection') });
  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

export function useAdminBrandMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'brands'] });
  const create = useMutation({ mutationFn: (payload: any) => brandsApi.create(payload), onSuccess: () => { toast.success('Brand created'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to create brand') });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number | string; payload: any }) => brandsApi.update(id, payload), onSuccess: () => { toast.success('Brand updated'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to update brand') });
  const destroy = useMutation({ mutationFn: (id: number | string) => brandsApi.destroy(id), onSuccess: () => { toast.success('Brand deleted'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to delete brand') });
  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

export function useAdminSizeMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'sizes'] });
  const create = useMutation({ mutationFn: (payload: any) => sizesApi.create(payload), onSuccess: () => { toast.success('Size created'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to create size') });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number | string; payload: any }) => sizesApi.update(id, payload), onSuccess: () => { toast.success('Size updated'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to update size') });
  const destroy = useMutation({ mutationFn: (id: number | string) => sizesApi.destroy(id), onSuccess: () => { toast.success('Size deleted'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to delete size') });
  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

export function useAdminColorMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'colors'] });
  const create = useMutation({ mutationFn: (payload: any) => colorsApi.create(payload), onSuccess: () => { toast.success('Color created'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to create color') });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number | string; payload: any }) => colorsApi.update(id, payload), onSuccess: () => { toast.success('Color updated'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to update color') });
  const destroy = useMutation({ mutationFn: (id: number | string) => colorsApi.destroy(id), onSuccess: () => { toast.success('Color deleted'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to delete color') });
  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

export function useAdminMaterialMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'materials'] });
  const create = useMutation({ mutationFn: (payload: any) => materialsApi.create(payload), onSuccess: () => { toast.success('Material created'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to create material') });
  const update = useMutation({ mutationFn: ({ id, payload }: { id: number | string; payload: any }) => materialsApi.update(id, payload), onSuccess: () => { toast.success('Material updated'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to update material') });
  const destroy = useMutation({ mutationFn: (id: number | string) => materialsApi.destroy(id), onSuccess: () => { toast.success('Material deleted'); invalidate(); }, onError: (e: any) => toast.error(e.message || 'Failed to delete material') });
  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export function useAdminOrders(params?: any) {
  return useQuery({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const res = await ordersApi.list(params);
      return res.data;
    },
  });
}

export function useAdminOrder(id: number | string) {
  return useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: async () => {
      const res = await ordersApi.get(id);
      return res.data?.order;
    },
    enabled: !!id,
  });
}

export function useAdminOrderMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
    qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
  };

  const updateStatus = useMutation({
    mutationFn: ({ id, status, note }: { id: number | string; status: string; note?: string }) =>
      ordersApi.updateStatus(id, status, note),
    onSuccess: () => { toast.success('Order status updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update order status'),
  });
  const generateInvoice = useMutation({
    mutationFn: (id: number | string) => ordersApi.generateInvoice(id),
    onSuccess: () => { toast.success('Invoice generated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to generate invoice'),
  });
  const refund = useMutation({
    mutationFn: ({ id, amount, reason }: { id: number | string; amount: number; reason: string }) =>
      ordersApi.refund(id, amount, reason),
    onSuccess: () => { toast.success('Refund processed'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to process refund'),
  });

  return { updateStatus: updateStatus.mutate, generateInvoice: generateInvoice.mutate, refund: refund.mutate };
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export function useAdminPayments(params?: any) {
  return useQuery({
    queryKey: ['admin', 'payments', params],
    queryFn: async () => {
      const res = await paymentsApi.list(params);
      return res.data;
    },
  });
}

export function useAdminRefunds(params?: any) {
  return useQuery({
    queryKey: ['admin', 'refunds', params],
    queryFn: async () => {
      const res = await paymentsApi.refunds(params);
      return res.data;
    },
  });
}

// ---------------------------------------------------------------------------
// Production
// ---------------------------------------------------------------------------

export function useAdminProduction(params?: any) {
  return useQuery({
    queryKey: ['admin', 'production', params],
    queryFn: async () => {
      const res = await productionApi.list(params);
      return res.data;
    },
  });
}

export function useAdminProductionPipeline() {
  return useQuery({
    queryKey: ['admin', 'production', 'pipeline'],
    queryFn: async () => {
      const res = await productionApi.pipeline();
      return res.data?.pipeline || [];
    },
  });
}

export function useAdminProductionMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'production'] });
    qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
  };

  const advance = useMutation({
    mutationFn: ({ id, note }: { id: number | string; note?: string }) => productionApi.advance(id, note),
    onSuccess: () => { toast.success('Production stage advanced'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to advance production'),
  });
  const setStage = useMutation({
    mutationFn: ({ id, stage, note }: { id: number | string; stage: string; note?: string }) =>
      productionApi.setStage(id, stage, note),
    onSuccess: () => { toast.success('Production stage updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update production stage'),
  });

  return { advance: advance.mutate, setStage: setStage.mutate };
}

export function useAdminPricingTiers(params?: any) {
  return useQuery({
    queryKey: ['admin', 'pricing', 'tiers', params],
    queryFn: async () => {
      const res = await pricingApi.list(params);
      return res.data?.tiers || res.data?.items || [];
    },
  });
}

export function useAdminPricingTierMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'pricing', 'tiers'] });

  const create = useMutation({
    mutationFn: (payload: any) => pricingApi.createTier(payload),
    onSuccess: () => { toast.success('Price tier created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create price tier'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) =>
      pricingApi.updateTier(id, payload),
    onSuccess: () => { toast.success('Price tier updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update price tier'),
  });
  const destroy = useMutation({
    mutationFn: (id: number | string) => pricingApi.destroyTier(id),
    onSuccess: () => { toast.success('Price tier deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete price tier'),
  });

  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

export function useAdminArtworks(params?: any) {
  return useQuery({
    queryKey: ['admin', 'customization', 'artworks', params],
    queryFn: async () => {
      const res = await customizationApi.artworks(params);
      return res.data?.artworks || res.data?.items || [];
    },
  });
}

export function useAdminArtworkMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'customization', 'artworks'] });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) =>
      customizationApi.updateArtworkStatus(id, status),
    onSuccess: () => { toast.success('Artwork status updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update artwork status'),
  });

  return { updateStatus: updateStatus.mutate };
}

export function useAdminPrintingMethods() {
  return useQuery({
    queryKey: ['admin', 'customization', 'printing-methods'],
    queryFn: async () => {
      const res = await customizationApi.printingMethods();
      return res.data?.printing_methods || res.data?.items || [];
    },
  });
}

export function useAdminPrintingMethodMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'customization', 'printing-methods'] });

  const create = useMutation({
    mutationFn: (payload: any) => customizationApi.createPrintingMethod(payload),
    onSuccess: () => { toast.success('Printing method created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create printing method'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) =>
      customizationApi.updatePrintingMethod(id, payload),
    onSuccess: () => { toast.success('Printing method updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update printing method'),
  });
  const destroy = useMutation({
    mutationFn: (id: number | string) => customizationApi.destroyPrintingMethod(id),
    onSuccess: () => { toast.success('Printing method deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete printing method'),
  });

  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

// ---------------------------------------------------------------------------
// Inventory
// ---------------------------------------------------------------------------

export function useAdminInventoryDashboard() {
  return useQuery({
    queryKey: ['admin', 'inventory', 'dashboard'],
    queryFn: async () => {
      const res = await inventoryApi.dashboard();
      return res.data;
    },
  });
}

export function useAdminWarehouses(params?: any) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'warehouses', params],
    queryFn: async () => {
      const res = await inventoryApi.warehouses(params);
      return res.data;
    },
  });
}

export function useAdminStock(params?: any) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'stock', params],
    queryFn: async () => {
      const res = await inventoryApi.stock(params);
      return res.data;
    },
  });
}

export function useAdminMovements(params?: any) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'movements', params],
    queryFn: async () => {
      const res = await inventoryApi.movements(params);
      return res.data;
    },
  });
}

export function useAdminLowStock(params?: any) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'low-stock', params],
    queryFn: async () => {
      const res = await inventoryApi.lowStock(params);
      return res.data;
    },
  });
}

export function useAdminSuppliers(params?: any) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'suppliers', params],
    queryFn: async () => {
      const res = await inventoryApi.suppliers(params);
      return res.data;
    },
  });
}

export function useAdminPurchaseOrders(params?: any) {
  return useQuery({
    queryKey: ['admin', 'inventory', 'purchase-orders', params],
    queryFn: async () => {
      const res = await inventoryApi.purchaseOrders(params);
      return res.data;
    },
  });
}

export function useAdminInventoryMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'inventory'] });
    qc.invalidateQueries({ queryKey: ['admin', 'products'] });
  };

  const adjust = useMutation({
    mutationFn: (payload: any) => inventoryApi.adjust(payload),
    onSuccess: () => { toast.success('Stock adjusted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to adjust stock'),
  });
  const createWarehouse = useMutation({
    mutationFn: (payload: any) => inventoryApi.createWarehouse(payload),
    onSuccess: () => { toast.success('Warehouse created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create warehouse'),
  });
  const updateWarehouse = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => inventoryApi.updateWarehouse(id, payload),
    onSuccess: () => { toast.success('Warehouse updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update warehouse'),
  });
  const createSupplier = useMutation({
    mutationFn: (payload: any) => inventoryApi.createSupplier(payload),
    onSuccess: () => { toast.success('Supplier created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create supplier'),
  });
  const updateSupplier = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => inventoryApi.updateSupplier(id, payload),
    onSuccess: () => { toast.success('Supplier updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update supplier'),
  });
  const createPurchaseOrder = useMutation({
    mutationFn: (payload: any) => inventoryApi.createPurchaseOrder(payload),
    onSuccess: () => { toast.success('Purchase order created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create purchase order'),
  });
  const receivePurchaseOrder = useMutation({
    mutationFn: ({ id, items }: { id: number | string; items: any[] }) => inventoryApi.receivePurchaseOrder(id, items),
    onSuccess: () => { toast.success('Items received'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to receive items'),
  });

  return {
    adjust: adjust.mutate,
    createWarehouse: createWarehouse.mutate,
    updateWarehouse: updateWarehouse.mutate,
    createSupplier: createSupplier.mutate,
    updateSupplier: updateSupplier.mutate,
    createPurchaseOrder: createPurchaseOrder.mutate,
    receivePurchaseOrder: receivePurchaseOrder.mutate,
  };
}

export function useAdminInvoices(params?: any) {
  return useQuery({
    queryKey: ['admin', 'invoices', params],
    queryFn: async () => {
      const res = await invoicesApi.list(params);
      return res.data;
    },
  });
}

export function useAdminInvoice(id: number | string) {
  return useQuery({
    queryKey: ['admin', 'invoices', id],
    queryFn: async () => {
      const res = await invoicesApi.get(id);
      return res.data?.invoice;
    },
    enabled: !!id,
  });
}

// ---------------------------------------------------------------------------
// Shipments
// ---------------------------------------------------------------------------

export function useAdminShipments(params?: any) {
  return useQuery({
    queryKey: ['admin', 'shipments', params],
    queryFn: async () => {
      const res = await shipmentsApi.list(params);
      return res.data;
    },
  });
}

export function useAdminShipment(id: number | string) {
  return useQuery({
    queryKey: ['admin', 'shipments', id],
    queryFn: async () => {
      const res = await shipmentsApi.get(id);
      return res.data?.shipment;
    },
    enabled: !!id,
  });
}

export function useAdminShipmentMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin', 'shipments'] });
    qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
  };

  const addTrackingEvent = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => shipmentsApi.addTrackingEvent(id, payload),
    onSuccess: () => { toast.success('Tracking event added'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to add tracking event'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => shipmentsApi.update(id, payload),
    onSuccess: () => { toast.success('Shipment updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update shipment'),
  });

  return { addTrackingEvent: addTrackingEvent.mutate, update: update.mutate };
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export function useAdminCoupons(params?: any) {
  return useQuery({
    queryKey: ['admin', 'coupons', params],
    queryFn: async () => {
      const res = await couponsApi.list(params);
      return res.data?.coupons || res.data?.items || [];
    },
  });
}

export function useAdminCouponMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'coupons'] });

  const create = useMutation({
    mutationFn: (payload: any) => couponsApi.create(payload),
    onSuccess: () => { toast.success('Coupon created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create coupon'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => couponsApi.update(id, payload),
    onSuccess: () => { toast.success('Coupon updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update coupon'),
  });
  const destroy = useMutation({
    mutationFn: (id: number | string) => couponsApi.destroy(id),
    onSuccess: () => { toast.success('Coupon deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete coupon'),
  });

  return { create: create.mutate, update: update.mutate, destroy: destroy.mutate };
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export function useAdminReviews(params?: any) {
  return useQuery({
    queryKey: ['admin', 'reviews', params],
    queryFn: async () => {
      const res = await reviewsApi.list(params);
      return res.data;
    },
  });
}

export function useAdminReviewMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => reviewsApi.update(id, payload),
    onSuccess: () => { toast.success('Review updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update review'),
  });
  const destroy = useMutation({
    mutationFn: (id: number | string) => reviewsApi.destroy(id),
    onSuccess: () => { toast.success('Review deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete review'),
  });

  return { update: update.mutate, destroy: destroy.mutate };
}

// ---------------------------------------------------------------------------
// Support
// ---------------------------------------------------------------------------

export function useAdminSupportTickets(params?: any) {
  return useQuery({
    queryKey: ['admin', 'support', params],
    queryFn: async () => {
      const res = await supportApi.list(params);
      return res.data;
    },
  });
}

export function useAdminSupportTicket(id: number | string) {
  return useQuery({
    queryKey: ['admin', 'support', id],
    queryFn: async () => {
      const res = await supportApi.get(id);
      return res.data?.ticket;
    },
    enabled: !!id,
  });
}

export function useAdminSupportMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'support'] });

  const reply = useMutation({
    mutationFn: ({ id, message }: { id: number | string; message: string }) => supportApi.reply(id, message),
    onSuccess: () => { toast.success('Reply sent'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to send reply'),
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => supportApi.update(id, payload),
    onSuccess: () => { toast.success('Ticket updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update ticket'),
  });
  const close = useMutation({
    mutationFn: (id: number | string) => supportApi.close(id),
    onSuccess: () => { toast.success('Ticket closed'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to close ticket'),
  });

  return { reply: reply.mutate, update: update.mutate, close: close.mutate };
}

// ---------------------------------------------------------------------------
// CMS
// ---------------------------------------------------------------------------

export function useAdminCmsPages(params?: any) {
  return useQuery({
    queryKey: ['admin', 'cms', 'pages', params],
    queryFn: async () => {
      const res = await cmsApi.pages.list(params);
      return res.data;
    },
  });
}

export function useAdminCmsBlogs(params?: any) {
  return useQuery({
    queryKey: ['admin', 'cms', 'blogs', params],
    queryFn: async () => {
      const res = await cmsApi.blogs.list(params);
      return res.data;
    },
  });
}

export function useAdminCmsFaqs(params?: any) {
  return useQuery({
    queryKey: ['admin', 'cms', 'faqs', params],
    queryFn: async () => {
      const res = await cmsApi.faqs.list(params);
      return res.data;
    },
  });
}

export function useAdminCmsCaseStudies(params?: any) {
  return useQuery({
    queryKey: ['admin', 'cms', 'case-studies', params],
    queryFn: async () => {
      const res = await cmsApi.caseStudies.list(params);
      return res.data;
    },
  });
}

export function useAdminCmsMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'cms'] });

  const createPage = useMutation({
    mutationFn: (payload: any) => cmsApi.pages.create(payload),
    onSuccess: () => { toast.success('Page created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create page'),
  });
  const updatePage = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => cmsApi.pages.update(id, payload),
    onSuccess: () => { toast.success('Page updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update page'),
  });
  const deletePage = useMutation({
    mutationFn: (id: number | string) => cmsApi.pages.destroy(id),
    onSuccess: () => { toast.success('Page deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete page'),
  });

  const createBlog = useMutation({
    mutationFn: (payload: any) => cmsApi.blogs.create(payload),
    onSuccess: () => { toast.success('Blog created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create blog'),
  });
  const updateBlog = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => cmsApi.blogs.update(id, payload),
    onSuccess: () => { toast.success('Blog updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update blog'),
  });
  const deleteBlog = useMutation({
    mutationFn: (id: number | string) => cmsApi.blogs.destroy(id),
    onSuccess: () => { toast.success('Blog deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete blog'),
  });

  const createFaq = useMutation({
    mutationFn: (payload: any) => cmsApi.faqs.create(payload),
    onSuccess: () => { toast.success('FAQ created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create FAQ'),
  });
  const updateFaq = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => cmsApi.faqs.update(id, payload),
    onSuccess: () => { toast.success('FAQ updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update FAQ'),
  });
  const deleteFaq = useMutation({
    mutationFn: (id: number | string) => cmsApi.faqs.destroy(id),
    onSuccess: () => { toast.success('FAQ deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete FAQ'),
  });

  const createCaseStudy = useMutation({
    mutationFn: (payload: any) => cmsApi.caseStudies.create(payload),
    onSuccess: () => { toast.success('Case study created'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to create case study'),
  });
  const updateCaseStudy = useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: any }) => cmsApi.caseStudies.update(id, payload),
    onSuccess: () => { toast.success('Case study updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update case study'),
  });
  const deleteCaseStudy = useMutation({
    mutationFn: (id: number | string) => cmsApi.caseStudies.destroy(id),
    onSuccess: () => { toast.success('Case study deleted'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to delete case study'),
  });

  return {
    createPage: createPage.mutate, updatePage: updatePage.mutate, deletePage: deletePage.mutate,
    createBlog: createBlog.mutate, updateBlog: updateBlog.mutate, deleteBlog: deleteBlog.mutate,
    createFaq: createFaq.mutate, updateFaq: updateFaq.mutate, deleteFaq: deleteFaq.mutate,
    createCaseStudy: createCaseStudy.mutate, updateCaseStudy: updateCaseStudy.mutate, deleteCaseStudy: deleteCaseStudy.mutate,
  };
}

// ---------------------------------------------------------------------------
// Settings / Audit logs / Search
// ---------------------------------------------------------------------------

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const res = await settingsApi.get();
      return res.data?.settings || {};
    },
  });
}

export function useAdminSettingsMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', 'settings'] });

  const update = useMutation({
    mutationFn: (settings: Array<{ key: string; value?: string; group?: string }>) =>
      settingsApi.update(settings),
    onSuccess: () => { toast.success('Settings updated'); invalidate(); },
    onError: (e: any) => toast.error(e.message || 'Failed to update settings'),
  });

  return { update: update.mutate };
}

export function useAdminAuditLogs(params?: any) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: async () => {
      const res = await auditLogsApi.list(params);
      return res.data;
    },
  });
}

export function useAdminSearch(query: string) {
  return useQuery({
    queryKey: ['admin', 'search', query],
    queryFn: async () => {
      if (!query || query.trim().length < 2) return null;
      const res = await dashboardApi.search(query);
      return res.data;
    },
    enabled: query.trim().length >= 2,
  });
}