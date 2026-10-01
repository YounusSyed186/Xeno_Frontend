import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowRight, ShieldCheck, Sparkles, ExternalLink, Droplets, Filter, Check, ShoppingBag, Eye, Layers } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/xeno/Reveal";
import { images } from "@/components/xeno/data";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

const T = "Creative Die-Cut & Holographic Stickers — Laptops, Bottles & Workstations | Xeno Craft";
const D = "Explore Xeno Craft's creative vinyl stickers for laptops, bottles, notebooks and journals. Waterproof, residue-free, die-cut & holographic designs available directly and on Amazon.";

export const Route = createFileRoute("/stickers")({
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
  component: StickersPage,
});

export interface StickerProductItem {
  id?: number | string | undefined;
  slug: string;
  title: string;
  desc: string;
  image: string;
  badge: string;
  count: string;
  price: number;
  compareAtPrice?: number | undefined;
  material?: string | undefined;
  externalUrl?: string | null | undefined;
  collectionSlug?: string | undefined;
}

const highlights = [
  {
    icon: Droplets,
    title: "100% Waterproof",
    desc: "Survives hydro flask condensation, dishwasher heat, and heavy outdoor weather.",
  },
  {
    icon: ShieldCheck,
    title: "Residue-Free Peel",
    desc: "Peels clean off aluminium MacBooks, glass bottles, and Kindle covers without sticky glue.",
  },
  {
    icon: Sparkles,
    title: "Scratch-Resistant UV Matte",
    desc: "Heavy 100-micron vinyl with UV laminate shields colors from backpack keys and friction.",
  },
];

const filterCategories = [
  { label: "All Sticker Packs", slug: "all" },
  { label: "Developer & Tech", slug: "tech-dev-stickers" },
  { label: "Cyberpunk & Anime", slug: "cyberpunk-anime-stickers" },
  { label: "Aesthetic Quotes", slug: "aesthetic-quotes-stickers" },
  { label: "Holographic Decals", slug: "holographic-foil-stickers" },
  { label: "Wanderlust & Outdoor", slug: "outdoor-travel-stickers" },
];

function StickersPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Fetch live sticker products from backend API
  const { data: productsData, isLoading } = useProducts({
    category: "stickers",
    per_page: 50,
  });

  // Harmonize dynamic products from API
  const stickerItems: StickerProductItem[] = useMemo(() => {
    const apiProducts = (productsData?.products || []) as Product[];
    if (!apiProducts || apiProducts.length === 0) {
      return [];
    }

    return apiProducts.map((p) => {
      const primaryImg = p.images?.find((img) => img.is_primary)?.url || p.images?.[0]?.url || images.stickers;
      const countMatch = p.name.match(/\((\d+\s*Pcs)\)/i)?.[1] || `${p.variants?.[0]?.size?.name || '50 Pcs'} Pack`;
      
      return {
        id: p.id,
        slug: p.slug,
        title: p.name,
        desc: p.short_description || p.description || "Precision die-cut vinyl sticker pack.",
        count: countMatch,
        badge: p.collection?.name || p.variants?.[0]?.material?.name || "Vinyl Decals",
        price: Number(p.base_price) || 299,
        compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
        material: p.variants?.[0]?.material?.name || "Waterproof Vinyl",
        image: primaryImg,
        externalUrl: p.external_url || "https://www.amazon.in",
        collectionSlug: p.collection?.slug,
      };
    });
  }, [productsData]);

  // Filter items
  const filteredPacks = useMemo(() => {
    if (selectedFilter === "all") return stickerItems;
    return stickerItems.filter((item) => item.collectionSlug === selectedFilter);
  }, [stickerItems, selectedFilter]);

  return (
    <div className="pt-28 pb-20 sm:pt-36">
      {/* HERO SECTION */}
      <section className="grain relative overflow-hidden pb-16 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_80%)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                <Sparkles className="size-3.5 text-[#5ef046]" /> Dynamic Sticker Collection
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl font-extrabold tracking-tight text-white">
                Stick a Little Personality <span className="text-gradient">Everywhere</span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
                Creative vinyl sticker packs for your laptops, water bottles, notebooks, keyboards, and workstations.
                Precision die-cut, 100% waterproof, and zero sticky residue.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-white/80">
                <span className="flex items-center gap-1.5 text-[#5ef046]">
                  <Check className="size-4" /> 100% Waterproof
                </span>
                <span className="flex items-center gap-1.5 text-[#5ef046]">
                  <Check className="size-4" /> Residue-Free Peel
                </span>
                <span className="flex items-center gap-1.5 text-[#5ef046]">
                  <Check className="size-4" /> Direct & Amazon Prime Fulfillment
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#packs-grid"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-8 py-4 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  <ShoppingBag className="size-4" />
                  <span>Browse Sticker Packs</span>
                </a>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
                >
                  <span>Explore All Catalog</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-4/3 overflow-hidden rounded-[2.5rem] border border-white/15 bg-card shadow-2xl">
              <img
                src={images.stickers}
                alt="Creative Vinyl Stickers"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Prime Delivery & Direct Orders</span>
                <span className="rounded-full bg-emerald-500/20 text-[#5ef046] border border-[#5ef046]/30 text-[10px] font-extrabold px-3 py-1">
                  Ready to Ship
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKER HIGHLIGHTS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card/50 p-5 backdrop-blur-sm">
                <div className="size-10 rounded-xl bg-[#5ef046]/10 flex items-center justify-center text-[#5ef046] shrink-0">
                  <h.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{h.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STICKER PRODUCT DISPLAY */}
      <section id="packs-grid" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <SectionHeading
            eyebrow="Dynamic Catalog"
            title={<>Explore Our <span className="text-gradient">Sticker Packs</span></>}
            copy="Handcrafted die-cut stickers with ultra-durable UV matte & holographic laminates."
          />
          <div className="shrink-0 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              Showing <strong className="text-white">{filteredPacks.length}</strong> sticker packs
            </span>
          </div>
        </div>

        {/* COLLECTION FILTER TABS */}
        <div className="mb-10 flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 mr-2 text-xs font-semibold text-muted-foreground">
            <Filter className="size-3.5 text-primary" /> Filter Series:
          </div>
          {filterCategories.map((cat) => {
            const isActive = selectedFilter === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedFilter(cat.slug)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#5ef046] text-black shadow-[0_0_15px_rgba(94,240,70,0.4)]"
                    : "border border-white/15 bg-surface/60 text-muted-foreground hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* PRODUCT GRID */}
        {isLoading && filteredPacks.length === 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="h-96 rounded-3xl border border-white/10 bg-card/40 animate-pulse" />
            ))}
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-card/40 py-16 px-6 text-center">
            <p className="text-zinc-400 text-sm">No sticker packs found in this series.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPacks.map((pack, i) => (
              <Reveal key={pack.slug || pack.title} delay={i * 0.05}>
                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5ef046]/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
                  {/* Image Container */}
                  <div className="relative aspect-4/3 overflow-hidden bg-zinc-950">
                    <img
                      src={pack.image}
                      alt={pack.title}
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold text-[#5ef046]">
                        {pack.count}
                      </span>
                      {pack.badge && (
                        <span className="rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          {pack.badge}
                        </span>
                      )}
                    </div>

                    {/* Material Overlay Tag */}
                    {pack.material && (
                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-md bg-black/75 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[10px] text-zinc-300">
                          {pack.material}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#5ef046] transition-colors leading-snug">
                          {pack.title}
                        </h3>
                      </div>
                      
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-white">₹{pack.price}</span>
                        {pack.compareAtPrice && pack.compareAtPrice > pack.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{pack.compareAtPrice}
                          </span>
                        )}
                        <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">
                          In Stock
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {pack.desc}
                      </p>
                    </div>

                    {/* Action Links */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                      {pack.externalUrl ? (
                        <a
                          href={pack.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5ef046] hover:bg-[#4de035] py-2.5 text-xs font-extrabold text-black transition-all hover:shadow-[0_0_15px_rgba(94,240,70,0.4)]"
                        >
                          <span>Buy on Marketplace / Amazon</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : null}

                      <Link
                        to="/products/$slug"
                        params={{ slug: pack.slug }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/15 py-2 text-xs font-bold text-white transition-all border border-white/10"
                      >
                        <Eye className="size-3.5 text-[#5ef046]" />
                        <span>View Product Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* CUSTOM STICKER BULK CALLOUT */}
        <div className="mt-20 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card/80 to-card p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5ef046]/10 border border-[#5ef046]/30 px-3.5 py-1 text-xs font-bold text-[#5ef046] uppercase tracking-wider">
                <Layers className="size-3.5" /> Custom Die-Cut Stickers For Brands
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold text-white">
                Want Custom Stickers with Your Own Logo & Artwork?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Order custom die-cut vinyl stickers for your startup, events, college fest, or personal merchandise.
                Send us your design and get bulk wholesale rates with door-step delivery across India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <Link
                to="/bulk-orders"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5ef046] px-8 py-4 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)]"
              >
                <span>Upload Design & Order Custom</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#5ef046] hover:text-black hover:border-transparent hover:shadow-[0_0_20px_rgba(94,240,70,0.4)]"
          >
            <Sparkles className="size-4 text-[#5ef046]" />
            <span>Explore All Products & Merchandise Catalog</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
