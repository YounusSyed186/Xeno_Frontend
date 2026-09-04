import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAdminCategories, useAdminBrands, useAdminProductMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { CloudinaryImageUpload } from '@/components/common/CloudinaryImageUpload';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/products/create')({
  component: AdminProductCreateComponent,
});

function AdminProductCreateComponent() {
  const navigate = useNavigate();
  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();
  const { createProduct } = useAdminProductMutations();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [status, setStatus] = useState('active');
  const [images, setImages] = useState<any[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !basePrice) {
      toast.error('Please fill in required fields (Name, SKU, Base Price)');
      return;
    }

    createProduct({
      name,
      sku,
      description,
      base_price: Number(basePrice),
      category_id: categoryId ? Number(categoryId) : null,
      brand_id: brandId ? Number(brandId) : null,
      status,
      images,
    });

    navigate({ to: '/admin/products' });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title="Add New Merchandise Product"
        description="Enter product details, pricing, categorization, and initial status."
        actions={
          <button
            onClick={() => navigate({ to: '/admin/products' })}
            className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" /> Cancel
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider text-[11px]">
            General Product Information
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Classic Oversized Heavyweight Cotton Hoodie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">SKU (Stock Keeping Unit) *</label>
              <input
                type="text"
                required
                placeholder="XC-HD-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Base Price (INR) *</label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="1499.00"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Brand</label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
              >
                <option value="">Select Brand</option>
                {brands.map((b: any) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea
              rows={4}
              placeholder="Detailed merchandise specification, fabric blend, fit guide..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <CloudinaryImageUpload
              label="Product Images Gallery (Cloudinary CDN)"
              helperText="Upload high-resolution product photos. Drag and select primary image."
              multiple={true}
              folder="products"
              value={images}
              onChange={setImages}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Initial Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="active">Active (Published to Store)</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: '/admin/products' })}
            className="rounded-xl border border-border/40 bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Save className="size-4" /> Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
