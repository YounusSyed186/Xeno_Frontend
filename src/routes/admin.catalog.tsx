import { useState, useMemo } from 'react';
import { createFileRoute, useNavigate, useRouterState } from '@tanstack/react-router';
import { useAdminProducts, useAdminProductMutations, useAdminCategories, useAdminCollections } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Search, Archive, Copy, Edit, Filter, X, RefreshCw, Layers } from 'lucide-react';

export const Route = createFileRoute('/admin/catalog')({
  component: AdminCatalogComponent,
});

function AdminCatalogComponent() {
  const navigate = useNavigate();
  const searchObj = useRouterState({ select: (s) => s.location.search }) as any;
  const categoryParam = typeof searchObj?.category === 'string' ? searchObj.category : '';
  const collectionParam = typeof searchObj?.collection === 'string' ? searchObj.collection : '';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCollection, setSelectedCollection] = useState(collectionParam);

  // fetch categories and collections for dropdowns
  const { data: categoriesData = [], isLoading: catLoading } = useAdminCategories();
  const { data: collectionsData = [], isLoading: colLoading } = useAdminCollections();

  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories || categoriesData?.items || []);
  const collections = Array.isArray(collectionsData) ? collectionsData : (collectionsData?.collections || collectionsData?.items || []);

  const { data, isLoading, refetch } = useAdminProducts({
    search: search || undefined,
    status: status || undefined,
    category_id: selectedCategory || undefined,
    collection_id: selectedCollection || undefined,
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    navigate({
      to: '/admin/catalog',
      search: {
        ...(value ? { category: value } : {}),
        ...(selectedCollection ? { collection: selectedCollection } : {}),
      } as any,
    });
  };

  const handleCollectionChange = (value: string) => {
    setSelectedCollection(value);
    navigate({
      to: '/admin/catalog',
      search: {
        ...(selectedCategory ? { category: selectedCategory } : {}),
        ...(value ? { collection: value } : {}),
      } as any,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedCollection('');
    setStatus('');
    setSearch('');
    navigate({ to: '/admin/catalog', search: {} as any });
  };

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
            />
          ) : (
            <div className="size-10 rounded-xl bg-surface border border-border/40 flex items-center justify-center text-xs font-bold text-muted-foreground">
              {product.name.charAt(0)}
            </div>
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
      header: 'Collection',
      cell: (product) => (
        <span className="text-xs text-zinc-400 font-medium">{product.collection?.name || '—'}</span>
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
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface cursor-pointer"
            title="Edit Product"
          >
            <Edit className="size-3.5" />
          </button>
          <button
            onClick={() => duplicateProduct(product.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
            title="Duplicate Product"
          >
            <Copy className="size-3.5" />
          </button>
          {product.status === 'archived' ? (
            <button
              onClick={() => restoreProduct(product.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
              title="Restore Product"
            >
              <RefreshCw className="size-3.5" />
            </button>
          ) : (
            <button
              onClick={() => deleteProduct(product.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
        title="Catalog"
        description="Browse and manage the product catalog with category and collection filtering."
        actions={
          <button
            onClick={() => navigate({ to: '/admin/products/create' })}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
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
          className="w-full sm:w-40 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          disabled={catLoading}
          className="w-full sm:w-48 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCollection}
          onChange={(e) => handleCollectionChange(e.target.value)}
          disabled={colLoading}
          className="w-full sm:w-48 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Collections</option>
          {collections.map((col: any) => (
            <option key={col.id} value={String(col.id)}>
              {col.name}
            </option>
          ))}
        </select>

        {(selectedCategory || selectedCollection || status || search) && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors shrink-0 cursor-pointer"
            title="Clear all filters"
          >
            <X className="size-3.5" /> Clear Filters
          </button>
        )}
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