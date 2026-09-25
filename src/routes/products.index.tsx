import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from 'react';
import { PageContainer } from "@/components/ui";
import { ProductCard, FilterBar, Pagination, EmptyState, Skeleton } from "@/components";
import { useProducts, useCategories, useColors, useSizes } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { Sparkles, ArrowRight, ArrowUpRight, Shirt, Heart, Image as ImageIcon } from "lucide-react";
import { images } from "@/components/xeno/data";

const T = "Explore Xeno Craft — Custom T-Shirts, Wedding Cards & Stickers";
const D = "Custom T-shirts, personalised wedding invitations and creative stickers — created for your events, celebrations and ideas.";

export interface ProductCatalogSearch {
  search?: string | undefined;
  category?: string | undefined;
  color?: string | undefined;
  size?: string | undefined;
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
    if (typeof search['color'] === 'string') q.color = search['color'];
    if (typeof search['size'] === 'string') q.size = search['size'];
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

const threeCategories = [
  {
    title: "Custom T-Shirts",
    copy: "For events, teams, organisations, gifting and personal requirements.",
    image: images.tshirt,
    link: "/custom-t-shirts",
    cta: "Explore T-Shirts",
    icon: Shirt,
  },
  {
    title: "Wedding Cards",
    copy: "Custom invitations created around your wedding.",
    image: images.weddingcards,
    link: "/wedding-cards",
    cta: "Explore Wedding Cards",
    icon: Heart,
  },
  {
    title: "Stickers",
    copy: "Creative sticker collections available exclusively through Amazon.",
    image: images.stickers,
    link: "/stickers",
    cta: "Shop on Amazon",
    icon: ImageIcon,
    external: true,
  },
];

function ProductsPage() {
  const search = useSearch({ from: "/products/" });
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<ProductCatalogSearch>(search);

  useEffect(() => {
    setActiveFilters(search);
  }, [search]);

  const { data, isLoading, isError, error, refetch } = useProducts(activeFilters as any);
  const { data: categories } = useCategories();
  const { data: colors } = useColors();
  const { data: sizes } = useSizes();

  const products = data?.products || [];
  const pagination = data?.pagination;

  // Filter options simplified to T-Shirt Types, Sizes, Colors (Section 18)
  const filterOptions = [
    {
      key: 'category',
      label: 'T-Shirt Type',
      options: [{ value: '', label: 'All Types' }, ...(categories?.map((c: any) => ({ value: c.slug, label: c.name })) || [])],
    },
    {
      key: 'color',
      label: 'Colour',
      options: [{ value: '', label: 'All Colours' }, ...(colors?.map((c: any) => ({ value: c.code, label: c.name })) || [])],
    },
    {
      key: 'size',
      label: 'Size',
      options: [{ value: '', label: 'All Sizes' }, ...(sizes?.map((s: any) => ({ value: s.code, label: s.name })) || [])],
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

  const handlePerPageChange = (per_page: number) => {
    updateFiltersAndNavigate({ ...activeFilters, per_page, page: 1 });
  };

  const filterRecord: Record<string, string> = {
    category: activeFilters.category || '',
    color: activeFilters.color || '',
    size: activeFilters.size || '',
  };

  return (
    <PageContainer
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Explore" }]}
      title="Explore Xeno Craft"
      description="Custom T-shirts, personalised wedding invitations and creative stickers — created for your events, celebrations and ideas."
    >
      {/* 13. THREE MAIN CATEGORY CARDS */}
      <div className="mb-14 grid gap-6 md:grid-cols-3">
        {threeCategories.map((cat) => (
          <div
            key={cat.title}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5ef046]/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]"
          >
            <div>
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-950 mb-5">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1 text-[11px] font-bold text-[#5ef046]">
                  {cat.title}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{cat.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{cat.copy}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              {cat.external ? (
                <a
                  href="https://www.amazon.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ef046] hover:underline"
                >
                  {cat.cta} <ArrowUpRight className="size-3.5" />
                </a>
              ) : (
                <Link
                  to={cat.link as any}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ef046] hover:underline"
                >
                  {cat.cta} <ArrowRight className="size-3.5" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* T-Shirt Customisation Studio Banner */}
      <div className="mb-10 relative overflow-hidden rounded-3xl border border-[#5ef046]/30 bg-gradient-to-br from-card via-black to-[#5ef046]/10 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#5ef046]/15 border border-[#5ef046]/30 px-3 py-1 text-xs font-bold text-[#5ef046]">
              <Sparkles className="size-3.5" /> 3D Live Customisation Studio
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Design Your Own <span className="text-gradient">T-Shirt</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Choose your garment, add your artwork, configure prints and view 3D real-time mockups.
            </p>
          </div>
          <Link
            to="/studio"
            className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-6 py-3 text-xs font-extrabold text-black hover:bg-[#4de035] transition-all shadow-md shrink-0"
          >
            Launch Studio <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Filter and Catalog Grid */}
      <div className="border-t border-white/10 pt-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Custom T-Shirt Catalog</h3>
            <p className="text-xs text-muted-foreground">Select a garment to start customising</p>
          </div>
        </div>

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
              description="Try clearing your filters"
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
      </div>
    </PageContainer>
  );
}