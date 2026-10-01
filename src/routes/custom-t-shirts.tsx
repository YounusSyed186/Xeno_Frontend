import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Shirt } from "lucide-react";
import { Reveal } from "@/components/xeno/Reveal";
import { useProducts, useCollections } from "@/hooks/useProducts";
import { images } from "@/components/xeno/data";

const T = "Custom T-Shirts for Every Occasion — Events, Corporate, College & Sports | Xeno Craft";
const D = "Personalised custom T-shirts: Classic cotton, oversized streetwear, dry-fit sports jerseys and polo shirts customized in Hyderabad with pan-India delivery.";

interface TShirtSearch {
  collection?: string | undefined;
  size?: string | undefined;
  color?: string | undefined;
}

export const Route = createFileRoute("/custom-t-shirts")({
  validateSearch: (search: Record<string, unknown>): TShirtSearch => ({
    collection: typeof search["collection"] === "string" ? search["collection"] : undefined,
    size: typeof search["size"] === "string" ? search["size"] : undefined,
    color: typeof search["color"] === "string" ? search["color"] : undefined,
  }),
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
  component: CustomTShirtsPage,
});

const defaultCollectionOptions = [
  { label: "All T-Shirts", value: "" },
  { label: "Streetwear Drop", value: "streetwear-drop" },
  { label: "Summer Collection", value: "summer-collection" },
  { label: "Corporate Merch", value: "corporate-gifting" },
  { label: "Winter Collection", value: "winter-collection" },
];

function CustomTShirtsPage() {
  const search = useSearch({ from: "/custom-t-shirts" });
  const navigate = useNavigate();
  const [selectedCollection, setSelectedCollection] = useState<string>(search.collection || "");

  const { data: collectionsData } = useCollections();
  const collectionsList = Array.isArray(collectionsData) ? collectionsData : (collectionsData?.data || []);

  const collectionFilterTabs = collectionsList.length > 0
    ? [
        { label: "All T-Shirts", value: "" },
        ...collectionsList
          .filter((c: any) =>
            ["streetwear-drop", "summer-collection", "corporate-gifting", "winter-collection"].includes(c.slug)
          )
          .map((c: any) => ({ label: c.name, value: c.slug })),
      ]
    : defaultCollectionOptions;

  const { data: productsData, isLoading: isProductsLoading } = useProducts({
    category: "t-shirts",
    collection: selectedCollection || undefined,
  });

  const productsList = productsData?.products || [];

  const handleCollectionChange = (colSlug: string) => {
    setSelectedCollection(colSlug);
    navigate({
      search: ((prev: any) => ({ ...prev, collection: colSlug || undefined })) as any,
    });
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36">
      {/* 14. HERO SECTION */}
      <section className="grain relative overflow-hidden pb-16 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_80%)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                Custom T-Shirts
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl font-extrabold tracking-tight text-white">
                Custom T-Shirts for <span className="text-gradient">Every Occasion</span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
                From college fests and sports events to corporate events and gifting, we create customised T-shirts for teams, organisations, communities and celebrations.
              </p>
              <p className="mt-3 text-sm text-zinc-300 font-medium">
                Add your logo, event artwork, team name, text or custom design and make it yours.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-7 py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  <Sparkles className="size-4" />
                  Start Customising
                </Link>
                <Link
                  to="/bulk-orders"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/40"
                >
                  Get a Bulk Quote
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-4/3 overflow-hidden rounded-[2.5rem] border border-white/15 bg-card shadow-2xl">
              <img
                src={images.tshirt}
                alt="Custom T-Shirts Collection"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* 15. DESIGN STUDIO SECTION */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/30 bg-gradient-to-br from-card via-zinc-950 to-primary/10 p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/30 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                T-Shirt Customisation Studio
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.1]">
                Design Your Own <span className="text-gradient">T-Shirt</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Choose your T-shirt, add your design, logo, text or artwork and create something that's completely yours.
              </p>

              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs font-extrabold text-[#5ef046] uppercase tracking-wider mb-1">01. Choose</div>
                  <p className="text-xs text-zinc-300">Select the T-shirt style that suits your requirement.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs font-extrabold text-[#5ef046] uppercase tracking-wider mb-1">02. Design</div>
                  <p className="text-xs text-zinc-300">Upload your logo, artwork, text or custom creative.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs font-extrabold text-[#5ef046] uppercase tracking-wider mb-1">03. Make It Yours</div>
                  <p className="text-xs text-zinc-300">Create for events, teams, groups or personal needs.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-8 py-4 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_25px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  Start Designing <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/15 bg-black/80 p-6 flex flex-col items-center justify-center text-center">
                <Shirt className="size-20 text-[#5ef046] mb-4 animate-pulse" />
                <h4 className="text-lg font-bold text-white">Live 3D Customiser</h4>
                <p className="mt-2 text-xs text-muted-foreground max-w-xs">
                  Real-time 360° visual preview, multi-placement print configurator, and instant price estimation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 17, 18, 19. PRODUCT CATALOGUE & BACKEND FILTERS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">Catalogue</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              Available <span className="text-gradient">T-Shirt Collection</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore our drops and customize any product with your logos, prints or graphics.
            </p>
          </div>

          {/* BACKEND FILTERS: Real Collections */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-surface/80 p-1">
              {collectionFilterTabs.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleCollectionChange(opt.value)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    selectedCollection === opt.value
                      ? "bg-[#5ef046] text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-[#5ef046]/40 hover:text-[#5ef046]"
            >
              <span>Explore All</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* PRODUCT CARDS: Real Database Products */}
        {isProductsLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded-3xl border border-white/10 bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : productsList.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-card/40 p-12 text-center">
            <p className="text-zinc-400 text-sm">No products found for this collection filter.</p>
            <button
              onClick={() => handleCollectionChange("")}
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#5ef046] hover:underline"
            >
              Show All T-Shirts
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productsList.map((product: any, i: number) => {
              const imgUrl = product.images?.[0]?.url || images.tshirt;
              const price = Math.round(Number(product.base_price || 0));
              const badgeLabel = product.collection?.name || product.category?.name || "T-Shirt";

              return (
                <Reveal key={product.id || product.slug} delay={i * 0.05}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5ef046]/40 hover:shadow-[0_12px_30px_rgba(0,0,0,0.7)]">
                    <Link
                      to="/products/$slug"
                      params={{ slug: product.slug }}
                      className="relative aspect-square overflow-hidden bg-zinc-950 block focus-visible:outline-none"
                    >
                      <img
                        src={imgUrl}
                        alt={product.name}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[#5ef046]">
                        {badgeLabel}
                      </span>
                    </Link>
                    
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <Link
                          to="/products/$slug"
                          params={{ slug: product.slug }}
                          className="block group/title"
                        >
                          <h3 className="text-base font-bold text-white line-clamp-1 group-hover/title:text-[#5ef046] transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.short_description || product.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/10 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-white">₹{price}</span>
                          <span className="text-[10px] uppercase font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                            Customizable
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to="/products/$slug"
                            params={{ slug: product.slug }}
                            className="flex items-center justify-center rounded-xl border border-white/15 bg-white/5 py-2 text-center text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-all"
                          >
                            Details
                          </Link>
                          <Link
                            to="/studio"
                            search={{ product: product.slug }}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#5ef046] py-2 text-center text-xs font-extrabold text-black hover:bg-[#4de035] transition-all shadow-sm"
                          >
                            <Sparkles className="size-3" /> Customise
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#5ef046] hover:text-black hover:border-transparent hover:shadow-[0_0_20px_rgba(94,240,70,0.4)]"
          >
            <Sparkles className="size-4 text-[#5ef046]" />
            <span>Explore All Catalog Products</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

