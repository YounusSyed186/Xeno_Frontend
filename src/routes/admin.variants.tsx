import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminVariants, useAdminProducts, useAdminColors, useAdminSizes, useAdminMaterials, useAdminVariantMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2, Edit, Search, Palette, Ruler, Box, Package } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/variants')({
  component: AdminVariantsComponent,
});

function AdminVariantsComponent() {
  const { data: variants = [], isLoading } = useAdminVariants();
  const { data: productsData } = useAdminProducts({ per_page: 100 });
  const { data: colors = [] } = useAdminColors();
  const { data: sizes = [] } = useAdminSizes();
  const { data: materials = [] } = useAdminMaterials();
  const { create, update, destroy } = useAdminVariantMutations();

  const products = productsData?.items || productsData?.products || [];

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [productId, setProductId] = useState('');
  const [colorId, setColorId] = useState('');
  const [sizeId, setSizeId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [priceAdjustment, setPriceAdjustment] = useState('0');
  const [sku, setSku] = useState('');
  const [stockStatus, setStockStatus] = useState('in_stock');
  const [isActive, setIsActive] = useState(true);

  const handleOpenCreate = () => {
    setEditingId(null);
    setProductId('');
    setColorId('');
    setSizeId('');
    setMaterialId('');
    setPriceAdjustment('0');
    setSku('');
    setStockStatus('in_stock');
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (v: any) => {
    setEditingId(v.id);
    setProductId(v.product_id ? String(v.product_id) : '');
    setColorId(v.color_id ? String(v.color_id) : '');
    setSizeId(v.size_id ? String(v.size_id) : '');
    setMaterialId(v.material_id ? String(v.material_id) : '');
    setPriceAdjustment(String(v.price_adjustment || 0));
    setSku(v.sku || '');
    setStockStatus(v.stock_status || 'in_stock');
    setIsActive(v.is_active !== false);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      toast.error('Product is required');
      return;
    }
    const payload = {
      product_id: Number(productId),
      color_id: colorId ? Number(colorId) : null,
      size_id: sizeId ? Number(sizeId) : null,
      material_id: materialId ? Number(materialId) : null,
      price_adjustment: Number(priceAdjustment),
      sku: sku || undefined,
      stock_status: stockStatus,
      is_active: isActive,
    };
    if (editingId) {
      update({ id: editingId, payload });
      toast.success('Variant updated');
    } else {
      create(payload);
      toast.success('Variant created');
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this variant?')) return;
    destroy(id);
    toast.success('Variant deleted');
  };

  const getProductName = (productId: number) => {
    const p = products.find((prod: any) => prod.id === productId);
    return p?.name || `Product #${productId}`;
  };

  const getColorName = (colorId: number) => {
    const c = colors.find((col: any) => col.id === colorId);
    return c?.name || `Color #${colorId}`;
  };

  const getSizeName = (sizeId: number) => {
    const s = sizes.find((sz: any) => sz.id === sizeId);
    return s?.name || `Size #${sizeId}`;
  };

  const getMaterialName = (materialId: number) => {
    const m = materials.find((mat: any) => mat.id === materialId);
    return m?.name || `Material #${materialId}`;
  };

  const columns: Column<any>[] = [
    {
      header: 'Product',
      cell: (v) => (
        <div>
          <p className="font-semibold text-foreground">{getProductName(v.product_id)}</p>
          <p className="text-[10px] text-muted-foreground font-mono">SKU: {v.sku || 'Auto'}</p>
        </div>
      ),
    },
    {
      header: 'Color',
      cell: (v) => (
        <div className="flex items-center gap-2">
          {v.color?.hex_code && (
            <span className="size-4 rounded-full border border-border/40" style={{ backgroundColor: v.color.hex_code }} />
          )}
          <span className="text-xs text-muted-foreground">{v.color ? v.color.name : getColorName(v.color_id)}</span>
        </div>
      ),
    },
    {
      header: 'Size',
      cell: (v) => <span className="text-xs text-muted-foreground font-mono">{v.size ? v.size.name : getSizeName(v.size_id)}</span>,
    },
    {
      header: 'Material',
      cell: (v) => <span className="text-xs text-muted-foreground">{v.material ? v.material.name : getMaterialName(v.material_id)}</span>,
    },
    {
      header: 'Price Adj.',
      cell: (v) => (
        <span className={`font-mono font-medium ${Number(v.price_adjustment || 0) > 0 ? 'text-rose-400' : Number(v.price_adjustment || 0) < 0 ? 'text-emerald-400' : 'text-foreground'}`}>
          {Number(v.price_adjustment || 0) > 0 ? '+' : ''}₹{Number(v.price_adjustment || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Stock Status',
      cell: (v) => {
        const status = v.stock_status || 'in_stock';
        const colors = {
          in_stock: 'bg-emerald-500/10 text-emerald-400',
          low_stock: 'bg-amber-500/10 text-amber-400',
          out_of_stock: 'bg-rose-500/10 text-rose-400',
          preorder: 'bg-sky-500/10 text-sky-400',
        };
        return (
          <span className={`px-2 py-0.5 text-[10px] rounded-full ${colors[status as keyof typeof colors] || colors.in_stock}`}>
            {status.replace(/_/g, ' ')}
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: (v) => (
        <span className={`px-2 py-0.5 text-[10px] rounded-full ${v.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {v.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (v) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(v)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Edit Variant"
          >
            <Edit className="size-3.5" />
          </button>
          <button
            onClick={() => handleDelete(v.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete Variant"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Product Variants"
        description="Manage product variants with color, size, material combinations and price adjustments."
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Add Variant
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search variants..."
            className="w-full rounded-xl border border-border/40 bg-surface/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={variants}
        isLoading={isLoading}
        emptyText="No variants found."
        showSearch={false}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-border/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-foreground">{editingId ? 'Edit Variant' : 'Add New Variant'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Product *</label>
                <select
                  required
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="">Select Product</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Color</label>
                  <select
                    value={colorId}
                    onChange={(e) => setColorId(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="">None</option>
                    {colors.map((c: any) => (
                      <option key={c.id} value={c.id} style={{ color: c.hex_code }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Size</label>
                  <select
                    value={sizeId}
                    onChange={(e) => setSizeId(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="">None</option>
                    {sizes.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Material</label>
                  <select
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="">None</option>
                    {materials.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Price Adjustment (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={priceAdjustment}
                    onChange={(e) => setPriceAdjustment(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Custom SKU</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Stock Status</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="preorder">Pre-order</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary"
                  />
                  Active
                </label>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border/40 bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="size-4" /> {editingId ? 'Update Variant' : 'Create Variant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}