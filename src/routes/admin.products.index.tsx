import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAdminProducts, useAdminProductMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Search, RefreshCw, Archive, Copy, Edit, Eye, Image as ImageIcon } from 'lucide-react';

const FALLBACK_PRODUCT_IMAGE = '/placeholder-product.svg';

export const Route = createFileRoute('/admin/products/')({
  component: AdminProductsIndexComponent,
});

function AdminProductsIndexComponent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useAdminProducts({
    search: search || undefined,
    status: status || undefined,
    page,
  });

  const { deleteProduct, restoreProduct, duplicateProduct } = useAdminProductMutations();

  const products = (data as any)?.products || (data as any)?.items || (Array.isArray(data) ? data : []);
  const pagination = data?.pagination
    ? {
        currentPage: data.pagination.current_page,
        lastPage: data.pagination.last_page,
        total: data.pagination.total,
        onPageChange: (p: number) => setPage(p),
      }
    : undefined;

  const columns: Column<any>[] = [
    {
      header: 'Product',
      cell: (product) => (
        <div className="flex items-center gap-3">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0].url || product.images[0].image_path}
              alt={product.name}
              className="size-10 rounded-xl object-cover border border-border/40"
              onError={(e) => { e.currentTarget.src = FALLBACK_PRODUCT_IMAGE; }}
            />
          ) : (
            <img
              src={FALLBACK_PRODUCT_IMAGE}
              alt={product.name}
              className="size-10 rounded-xl object-cover border border-border/40 opacity-40"
            />
          )}
          <div>
            <p className="font-bold text-foreground">{product.name}</p>
            <p className="text-[10px] text-muted-foreground font-mono">SKU: {product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (product) => (
        <span className="text-xs text-muted-foreground">{product.category?.name || 'Uncategorized'}</span>
      ),
    },
    {
      header: 'Base Price',
      cell: (product) => (
        <span className="font-mono font-medium text-foreground">
          ₹{Number(product.base_price).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (product) => <AdminStatusBadge status={product.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (product) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => navigate({ to: `/admin/products/${product.id}` as any })}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface"
            title="Edit Product"
          >
            <Edit className="size-3.5" />
          </button>
          <button
            onClick={() => duplicateProduct(product.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Duplicate Product"
          >
            <Copy className="size-3.5" />
          </button>
          {product.status === 'archived' ? (
            <button
              onClick={() => restoreProduct(product.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
              title="Restore Product"
            >
              <RefreshCw className="size-3.5" />
            </button>
          ) : (
            <button
              onClick={() => deleteProduct(product.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Archive Product"
            >
              <Archive className="size-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Products Catalog"
        description="Manage merchandise products, base prices, variants, inventory, and status."
        actions={
          <button
            onClick={() => navigate({ to: '/admin/products/create' })}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Add Product
          </button>
        }
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border/40 bg-surface/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-44 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={products}
        isLoading={isLoading}
        emptyText="No products found in catalog."
        pagination={pagination}
      />
    </div>
  );
}
