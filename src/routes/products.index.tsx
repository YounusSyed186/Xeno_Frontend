import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from 'react';
import { PageContainer } from "@/components/ui";
import { ProductCard, DataTable, FilterBar, Pagination, EmptyState, Skeleton } from "@/components";
import { useProducts, useCategories, useBrands, useCollections, useColors, useSizes, useMaterials } from "@/hooks/useProducts";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { Product } from "@/types/product";
import { Sparkles, ArrowRight, Shirt, Flame, Check } from "lucide-react";

const T = "Products — Custom Apparel, Stickers & Corporate Merchandise | Xeno Craft";
const D = "Explore fifteen product families: custom t-shirts, jerseys, hoodies, uniforms, caps, stickers, welcome kits, gift boxes and packaging.";

const defaultFilters = {
  search: '',
  category: '',
  collection: '',
  brand: '',
  color: '',
  size: '',
  material: '',
  sort: 'newest',
  min_price: '',
  max_price: '',
  in_stock: '',
  featured: '',
  page: 1,
  per_page: 12,
};

export interface ProductCatalogSearch {
  search?: string | undefined;
  category?: string | undefined;
  collection?: string | undefined;
  brand?: string | undefined;
  color?: string | undefined;
  size?: string | undefined;
  material?: string | undefined;
  sort?: string | undefined;
  min_price?: number | undefined;
  max_price?: number | undefined;
  in_stock?: boolean | undefined;
  featured?: boolean | undefined;
  page?: number | undefined;
  per_page?: number | undefined;
}

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductCatalogSearch => {
    const q: ProductCatalogSearch = {};
    if (typeof search['search'] === 'string') q.search = search['search'];
    if (typeof search['category'] === 'string') q.category = search['category'];
    if (typeof search['collection'] === 'string') q.collection = search['collection'];
    if (typeof search['brand'] === 'string') q.brand = search['brand'];
    if (typeof search['color'] === 'string') q.color = search['color'];
    if (typeof search['size'] === 'string') q.size = search['size'];
    if (typeof search['material'] === 'string') q.material = search['material'];
    if (typeof search['sort'] === 'string') q.sort = search['sort'];
    if (search['min_price']) q.min_price = Number(search['min_price']);
    if (search['max_price']) q.max_price = Number(search['max_price']);
    if (search['in_stock'] === true || search['in_stock'] === 'true') q.in_stock = true;
    if (search['featured'] === true || search['featured'] === 'true') q.featured = true;
    q.page = search['page'] ? Number(search['page']) : 1;
    q.per_page = search['per_page'] ? Number(search['per_page']) : 12;
    return q;
  },
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const search = useSearch({ from: "/products/" });
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<ProductCatalogSearch>(search);

  // Sync search params with activeFilters
  useEffect(() => {
    setActiveFilters(search);
  }, [search]);

  const { data, isLoading, isError, error, refetch } = useProducts(activeFilters as any);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: collections } = useCollections();
  const { data: colors } = useColors();
  const { data: sizes } = useSizes();
  const { data: materials } = useMaterials();

  const products = data?.products || [];
  const pagination = data?.pagination;

  const filterOptions = [
    {
      key: 'category',
      label: 'Category',
      options: [{ value: '', label: 'All Categories' }, ...(categories?.map((c: any) => ({ value: c.slug, label: c.name })) || [])],
    },
    {
      key: 'collection',
      label: 'Collection',
      options: [{ value: '', label: 'All Collections' }, ...(collections?.map((c: any) => ({ value: c.slug, label: c.name })) || [])],
    },
    {
      key: 'brand',
      label: 'Brand',
      options: [{ value: '', label: 'All Brands' }, ...(brands?.map((b: any) => ({ value: b.slug, label: b.name })) || [])],
    },
    {
      key: 'color',
      label: 'Color',
      options: [{ value: '', label: 'All Colors' }, ...(colors?.map((c: any) => ({ value: c.code, label: c.name })) || [])],
    },
    {
      key: 'size',
      label: 'Size',
      options: [{ value: '', label: 'All Sizes' }, ...(sizes?.map((s: any) => ({ value: s.code, label: s.name })) || [])],
    },
    {
      key: 'material',
      label: 'Material',
      options: [{ value: '', label: 'All Materials' }, ...(materials?.map((m: any) => ({ value: m.code, label: m.name })) || [])],
    },
  ];

  const updateFiltersAndNavigate = (newFilters: ProductCatalogSearch) => {
    setActiveFilters(newFilters);
    navigate({
      search: newFilters as any,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFiltersAndNavigate({ ...activeFilters, [key]: value || undefined, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    updateFiltersAndNavigate({ ...activeFilters, search: value || undefined, page: 1 });
  };

  const handleClearAll = () => {
    updateFiltersAndNavigate({ page: 1, per_page: 12 });
  };

  const handlePageChange = (page: number) => {
    updateFiltersAndNavigate({ ...activeFilters, page });
  };

  const handleSortChange = (sort: string) => {
    updateFiltersAndNavigate({ ...activeFilters, sort, page: 1 });
  };

  const handlePerPageChange = (per_page: number) => {
    updateFiltersAndNavigate({ ...activeFilters, per_page, page: 1 });
  };

  // Derive apparel quick chips
  const categoryList = (categories as any[]) || [];
  const apparelSlugs = ['t-shirts', 'hoodies', 'jerseys', 'sports-jerseys', 'corporate-polos', 'polos', 'caps', 'uniforms', 'apparel'];
  const quickCategories = [
    { label: 'All Catalog', slug: '' },
    ...categoryList
      .filter((c: any) => apparelSlugs.some(s => c.slug?.toLowerCase().includes(s) || s.includes(c.slug?.toLowerCase())))
      .map((c: any) => ({ label: c.name, slug: c.slug })),
  ];

  const filterRecord: Record<string, string> = {
    category: activeFilters.category || '',
    collection: activeFilters.collection || '',
    brand: activeFilters.brand || '',
    color: activeFilters.color || '',
    size: activeFilters.size || '',
    material: activeFilters.material || '',
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products" }]}
      title="Product Catalog"
      description="Browse our complete collection of custom apparel, merchandise, and promotional products"
      actions={
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(activeFilters.in_stock)}
              onChange={(e) => updateFiltersAndNavigate({ ...activeFilters, in_stock: e.target.checked ? true : undefined, page: 1 })}
              className="rounded border-border/40 text-primary focus:ring-primary"
            />
            In stock only
          </label>
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(activeFilters.featured)}
              onChange={(e) => updateFiltersAndNavigate({ ...activeFilters, featured: e.target.checked ? true : undefined, page: 1 })}
              className="rounded border-border/40 text-primary focus:ring-primary"
            />
            Featured only
          </label>
        </div>
      }
    >
      {/* Custom Apparel Spotlight Section (Product Discovery & Commerce) */}
      <div className="mb-8 relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-card/90 via-card/50 to-primary/10 p-6 sm:p-8 lg:p-10 shadow-lg">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/30 px-3.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" /> 3D Live Customisation Studio
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground">
              Customise Your Own <span className="text-gradient">Apparel</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Choose your garment, select your variant, add your artwork, configure your customisation and get your final price.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/studio"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-extrabold text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
              >
                Launch Customiser <ArrowRight className="size-4" />
              </Link>
              <button
                onClick={() => {
                  const apparelCat = categoryList.find((c: any) =>
                    ['t-shirts', 'apparel', 'hoodies', 'jerseys'].includes(c.slug?.toLowerCase())
                  );
                  handleFilterChange('category', apparelCat?.slug || 't-shirts');
                }}
                className="rounded-xl border border-border/60 bg-background/60 px-5 py-3 text-xs font-semibold text-foreground hover:border-primary/40 hover:bg-surface transition-all"
              >
                View Apparel Only
              </button>
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border/40 bg-background/40 p-4 space-y-1">
              <Shirt className="size-5 text-primary mb-2" />
              <p className="text-xs font-bold text-foreground">Custom T-Shirts</p>
              <p className="text-[11px] text-muted-foreground">DTF & Screen Printing</p>
            </div>
            <div className="rounded-2xl border border-border/40 bg-background/40 p-4 space-y-1">
              <Flame className="size-5 text-primary mb-2" />
              <p className="text-xs font-bold text-foreground">Hoodies & Sweats</p>
              <p className="text-[11px] text-muted-foreground">360+ GSM Heavyweight</p>
            </div>
          </div>
        </div>
      </div>

      {/* Apparel Quick Filter Chips */}
      {quickCategories.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider shrink-0 mr-1">
              Quick Filters:
            </span>
            {quickCategories.map((chip) => {
              const isSelected = (activeFilters.category || '') === chip.slug;
              return (
                <button
                  key={chip.slug || 'all'}
                  onClick={() => handleFilterChange('category', chip.slug)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'bg-surface/80 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  {isSelected && <Check className="size-3" />}
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <FilterBar
        filters={filterOptions}
        activeFilters={filterRecord}
        onFilterChange={handleFilterChange}
        onClearAll={handleClearAll}
        searchValue={activeFilters.search || ''}
        onSearchChange={handleSearchChange}
      />

      <div className="mt-8">
        {isLoading ? (
          <Skeleton count={6} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />
        ) : isError ? (
          <EmptyState
            icon="alert"
            title="Failed to load products"
            description={error?.message || "Please try again"}
            action={{ label: "Retry", onClick: () => refetch() }}
          />
        ) : products.length === 0 ? (
          <EmptyState
            icon="package"
            title="No products found"
            description="Try adjusting your filters or search terms"
            action={{ label: "Clear filters", onClick: handleClearAll, variant: "outline" }}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {pagination && pagination.last_page > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              total={pagination.total}
              pageSize={pagination.per_page}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePerPageChange}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
}