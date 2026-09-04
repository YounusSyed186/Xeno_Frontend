import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useAdminCategories, useAdminBrands, useAdminProduct, useAdminProductMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { CloudinaryImageUpload } from '@/components/common/CloudinaryImageUpload';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/products/$id')({
  component: AdminProductDetailComponent,
});

function AdminProductDetailComponent() {
  const { id } = useParams({ from: '/admin/products/$id' });
  const navigate = useNavigate();
  const productId = Number(id);

  const { data: categories = [] } = useAdminCategories();
  const { data: brands = [] } = useAdminBrands();
  const { data: product, isLoading, error } = useAdminProduct(productId);
  const { updateProduct } = useAdminProductMutations();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [status, setStatus] = useState('active');
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setSku(product.sku || '');
      setDescription(product.description || '');
      setBasePrice(product.base_price ? String(product.base_price) : '');
      setCategoryId(product.category_id ? String(product.category_id) : '');
      setBrandId(product.brand_id ? String(product.brand_id) : '');
      setStatus(product.status || 'active');
      setImages(product.images || []);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct({
      id: productId,
      payload: {
        name,
        sku,
        description,
        base_price: Number(basePrice),
        category_id: categoryId ? Number(categoryId) : null,
        brand_id: brandId ? Number(brandId) : null,
        status,
        images,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground">
        Product not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <AdminPageHeader
        title={`Edit Product: ${product.name}`}
        description={`SKU: ${product.sku} | ID: #${product.id}`}
        actions={
          <div className="flex items-center gap-2">
            <AdminStatusBadge status={product.status} />
            <button
              onClick={() => navigate({ to: '/admin/products' })}
              className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" /> Back to Products
            </button>
          </div>
        }
      />

      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">SKU *</label>
              <input
                type="text"
                required
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
              folder={`products/${productId}`}
              value={images}
              onChange={setImages}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
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
            <Save className="size-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
