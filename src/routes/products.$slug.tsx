import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from 'react';
import { PageContainer, Accordion } from "@/components/ui";
import { SectionHeading, Reveal } from "@/components/xeno/Reveal";
import { ProductCard } from "@/components/data-display/ProductCard";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCustomizationOptions } from "@/hooks/useCustomization";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { StatusBadge } from "@/components/data-display/StatusBadge";
import { toast } from "sonner";
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  Layers,
  ArrowRight,
  Plus,
  Minus,
  Check,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/products/$slug")({
  head: () => ({
    meta: [
      { title: "Product Details — Custom Printing & Bulk Pricing | Xeno Craft" },
      { name: "description", content: "Explore custom apparel with 3D preview and live volume pricing." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: p, isLoading, isError, error } = useProduct(slug);
  const { data: customizationData } = useCustomizationOptions();
  const { addItem, isAdding } = useCart();
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const { data: relatedData } = useProducts({
    category: p?.category?.slug || '',
    per_page: 4,
  });

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userQuantity, setUserQuantity] = useState<number | null>(null);

  if (isLoading) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: "Loading..." }]}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Skeleton variant="rectangular" width="100%" height="450px" className="rounded-3xl" />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <Skeleton variant="text" width="60%" height="40px" />
            <Skeleton variant="text" width="40%" height="30px" />
            <Skeleton variant="rectangular" width="100%" height="200px" className="rounded-2xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError || !p) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: "Not Found" }]}>
        <EmptyState
          icon="alert"
          title="Product not found"
          description={error?.message || "The product you're looking for doesn't exist"}
          action={{ label: "Back to products", onClick: () => window.history.back(), variant: "outline" }}
        />
      </PageContainer>
    );
  }

  const moq = Math.max(1, p.moq || 1);
  const quantity = userQuantity !== null ? Math.max(moq, userQuantity) : moq;
  const setQuantity = (q: number) => setUserQuantity(Math.max(moq, q));

  const images = p.images && p.images.length > 0 ? p.images : [{ url: '/placeholder.png' }];
  const activeImage = images[selectedImageIndex] || images[0];

  const variants = p.variants || [];
  const hasVariants = variants.length > 0;
  const currentVariant = variants.find((v: any) => v.id === selectedVariantId) || variants[0];

  const inStock = hasVariants
    ? variants.some((v: any) => v.stock_status === 'in_stock')
    : ((p as any).stocks?.some((s: any) => s.available > 0) ?? true);

  const isWishlisted = (wishlistItems || []).some((item: any) => item.product_id === p.id);

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(p.id);
    } else {
      if (currentVariant?.id) {
        addToWishlist({ productId: p.id, variantId: currentVariant.id });
      } else {
        addToWishlist({ productId: p.id });
      }
    }
  };

  // Dynamic Tier Pricing Engine Calculation
  const tiers = p.price_tiers || [];
  const activeTier = tiers.find(
    (t: any) =>
      t.is_active &&
      quantity >= t.min_quantity &&
      (t.max_quantity == null || quantity <= t.max_quantity)
  );
  const effectiveBasePrice = activeTier ? Number(activeTier.unit_price) : Number(p.base_price);
  const unitPrice = effectiveBasePrice + Number(currentVariant?.price_adjustment || 0);
  const totalPrice = unitPrice * quantity;

  // Next tier calculation for motivation
  const sortedTiers = [...tiers].filter((t: any) => t.is_active).sort((a: any, b: any) => a.min_quantity - b.min_quantity);
  const nextTier = sortedTiers.find((t: any) => t.min_quantity > quantity);
  const unitsToNextTier = nextTier ? nextTier.min_quantity - quantity : null;
  const potentialSavings = nextTier ? unitPrice - Number(nextTier.unit_price) : 0;

  // Extract unique colors and sizes from variants
  const colorOptions = Array.from(
    new Map(
      variants
        .filter((v: any) => v.color)
        .map((v: any) => [v.color.id, { id: v.color.id, name: v.color.name, hex: v.color.hex, variantId: v.id }])
    ).values()
  );

  const sizeOptions = Array.from(
    new Map(
      variants
        .filter((v: any) => v.size)
        .map((v: any) => [v.size.id, { id: v.size.id, name: v.size.name, variantId: v.id }])
    ).values()
  );

  const handleAddToCart = () => {
    if (hasVariants && !currentVariant) {
      toast.error('Please select a variant (size / color)');
      return;
    }
    addItem(
      {
        product_id: p.id,
        variant_id: currentVariant?.id ?? null,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} × ${p.name} to your cart!`);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to add item to cart');
        },
      }
    );
  };

  const related = (relatedData?.products || []).filter((item: any) => item.id !== p.id).slice(0, 3);

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Products", to: "/products" },
        ...(p.category ? [{ label: p.category.name, to: `/products?category=${p.category.slug}` }] : []),
        { label: p.name }
      ]}
    >
      {/* 2-COLUMN HERO SECTION: GALLERY + BUY BOX */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: INTERACTIVE GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-3xl border border-border/40 bg-card/60 shadow-md">
            <img
              src={activeImage?.url || '/placeholder.svg'}
              alt={p.name}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              className="size-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />

            {/* Badges on Gallery */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {p.is_featured && (
                <StatusBadge status="info" label="Featured" />
              )}
              <StatusBadge
                status={inStock ? 'in_stock' : 'out_of_stock'}
                label={inStock ? 'In Stock' : 'Out of Stock'}
              />
            </div>

            <button
              onClick={toggleWishlist}
              className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
                isWishlisted
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                  : 'bg-black/60 border-white/15 text-muted-foreground hover:text-white'
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`size-4.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Gallery Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/40 scale-105'
                      : 'border-border/40 hover:border-primary/40 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PRODUCT BUY BOX */}
        <div className="lg:col-span-5 rounded-3xl border border-border/40 bg-card/60 p-6 sm:p-8 space-y-6 shadow-md backdrop-blur-sm">
          {/* Header & Meta */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {p.category && (
                <span className="font-semibold text-primary uppercase tracking-wider text-[11px]">
                  {p.category.name}
                </span>
              )}
              {p.sku && <span className="font-mono text-[11px]">SKU: {p.sku}</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
              {p.name}
            </h1>

            {p.short_description && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {p.short_description}
              </p>
            )}
          </div>

          {/* Pricing Section */}
          <div className="rounded-2xl border border-border/30 bg-background/50 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-xs text-muted-foreground">Unit Price</p>
                  {activeTier && (
                    <span className="rounded-full bg-primary/20 border border-primary/40 px-2 py-0.5 text-[10px] font-bold text-primary">
                      Tier: {activeTier.name || `${activeTier.min_quantity}+ units`}
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-gradient">
                    ₹{unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {p.compare_at_price && Number(p.compare_at_price) > unitPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{Number(p.compare_at_price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
              {tiers.length > 0 ? (
                <div className="text-right">
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary">
                    Bulk Discounts Active
                  </span>
                  {moq > 1 && (
                    <p className="text-[11px] font-semibold text-amber-400 mt-1">
                      Min. Order: {moq} units
                    </p>
                  )}
                </div>
              ) : moq > 1 ? (
                <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                  Min. Order: {moq} units
                </span>
              ) : null}
            </div>
            {nextTier && unitsToNextTier && potentialSavings > 0 ? (
              <div className="mt-3 rounded-xl bg-primary/10 border border-primary/25 px-3 py-2 text-xs flex items-center justify-between text-primary">
                <span>Unlock Next Tier ({nextTier.min_quantity}+ units @ ₹{Number(nextTier.unit_price).toLocaleString('en-IN')}/ea)</span>
                <span className="font-bold font-mono">+ {unitsToNextTier} more to save ₹{potentialSavings.toFixed(0)}/ea</span>
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-2">
                Inclusive of all standard customisation options. GST calculated at checkout.
              </p>
            )}
          </div>

          {/* Variant Selector: Colors & Sizes */}
          {hasVariants && (
            <div className="space-y-4 pt-2">
              {colorOptions.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Colour: <span className="text-foreground capitalize">{currentVariant?.color?.name || 'Selected'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {colorOptions.map((c: any) => {
                      const isSelected = currentVariant?.color?.id === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            const match = variants.find((v: any) => v.color?.id === c.id && (currentVariant?.size?.id ? v.size?.id === currentVariant.size.id : true)) || variants.find((v: any) => v.color?.id === c.id);
                            if (match) setSelectedVariantId(match.id);
                          }}
                          className={`group relative flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-primary bg-primary/15 text-foreground ring-1 ring-primary'
                              : 'border-border/40 bg-surface/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                          }`}
                        >
                          <span className="size-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {sizeOptions.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Size: <span className="text-foreground">{currentVariant?.size?.name || 'Selected'}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((s: any) => {
                      const isSelected = currentVariant?.size?.id === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            const match = variants.find((v: any) => v.size?.id === s.id && (currentVariant?.color?.id ? v.color?.id === currentVariant.color.id : true)) || variants.find((v: any) => v.size?.id === s.id);
                            if (match) setSelectedVariantId(match.id);
                          }}
                          className={`min-w-11 h-9 rounded-xl border px-3 text-xs font-bold transition-all ${
                            isSelected
                              ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                              : 'border-border/40 bg-surface/60 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity Stepper & Line Total */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quantity
              </label>
              {moq > 1 && (
                <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  Minimum order: {moq} units
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center rounded-xl border border-border/60 bg-surface/60 p-1">
                <button
                  type="button"
                  disabled={quantity <= moq}
                  onClick={() => setQuantity(Math.max(moq, quantity - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title={quantity <= moq ? `Minimum order quantity is ${moq}` : "Decrease quantity"}
                >
                  <Minus className="size-3.5" />
                </button>
                <input
                  type="number"
                  min={moq}
                  max={9999}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setQuantity(val);
                  }}
                  onBlur={() => {
                    if (quantity < moq) setQuantity(moq);
                  }}
                  className="w-16 text-center bg-transparent text-sm font-bold text-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                  title="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-xs text-muted-foreground">Estimated Total</p>
                <p className="text-lg font-bold text-foreground">
                  ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* DUAL ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || (!hasVariants && !inStock) || (hasVariants && !currentVariant)}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 shadow-md min-h-12"
            >
              <ShoppingBag className="size-4.5" />
              {isAdding ? 'Adding to Cart...' : inStock ? `Add to Cart — ₹${totalPrice.toLocaleString('en-IN')}` : 'Out of Stock'}
            </button>

            <Link
              to="/studio"
              search={{ product: p.slug, ...(currentVariant ? { variant: currentVariant.id } : {}) }}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-3.5 text-center text-sm font-bold text-primary transition-all hover:bg-primary/20 hover:border-primary min-h-12"
            >
              <Sparkles className="size-4" />
              Customise in 3D Studio
            </Link>
          </div>

          {/* Assurance / Trust Chips */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-primary shrink-0" />
              <span>Pan-India Express Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>100% Quality Inspected</span>
            </div>
          </div>
        </div>
      </div>

      {/* SUPPORTING SECTIONS BELOW THE FOLD */}
      <div className="mt-16 space-y-16">
        {/* Volume Pricing Tiers Table */}
        {p.price_tiers && p.price_tiers.length > 0 && (
          <div className="rounded-3xl border border-border/40 bg-card/50 p-6 sm:p-8">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary uppercase tracking-wider">
                Volume Pricing
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-2">
                Transparent Bulk Discount Tiers
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Higher quantities unlock substantial per-unit manufacturing discounts.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {p.price_tiers.map((tier: any) => {
                const isActive = activeTier?.id === tier.id;
                return (
                  <div
                    key={tier.id}
                    className={`relative rounded-2xl border p-5 space-y-2 transition-all ${
                      isActive
                        ? 'border-primary bg-primary/10 ring-1 ring-primary shadow-[0_0_15px_rgba(94,240,70,0.2)]'
                        : 'border-border/40 bg-background/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary uppercase">{tier.name || 'Tier'}</span>
                      {isActive && (
                        <span className="rounded-full bg-[#5ef046] px-2 py-0.5 text-[9px] font-extrabold text-black uppercase">
                          Active Tier
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-black text-foreground">
                      ₹{Number(tier.unit_price).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-muted-foreground"> / unit</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tier.max_quantity ? `${tier.min_quantity} – ${tier.max_quantity} units` : `${tier.min_quantity}+ units`}
                    </p>
                    {tier.note && <p className="text-[11px] text-muted-foreground/80 pt-2 border-t border-border/20">{tier.note}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Materials and Customization Options */}
        <div className="grid gap-8 lg:grid-cols-2">
          {((p as any).materials || []).length > 0 && (
            <div className="rounded-3xl border border-border/40 bg-card/50 p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Layers className="size-4.5 text-primary" /> Fabric & Material Specifications
              </h3>
              <ul className="divide-y divide-border/30">
                {((p as any).materials || []).map((m: any, i: number) => (
                  <li key={i} className="py-3">
                    <p className="text-sm font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {customizationData && (
            <div className="rounded-3xl border border-border/40 bg-card/50 p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-4.5 text-primary" /> Supported Printing Methods
              </h3>
              <p className="text-xs text-muted-foreground">
                All merchandise is crafted using industrial-grade printing and embroidery machinery.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {customizationData.printing_methods?.map((m: any) => (
                  <span key={m.id} className="rounded-xl border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary">
                    {m.name}
                  </span>
                ))}
                {customizationData.options?.map((o: any) => (
                  <span key={o.id} className="rounded-xl border border-border/40 bg-surface/60 px-3.5 py-1.5 text-xs text-muted-foreground">
                    {o.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAQs */}
        {((p as any).faq || []).length > 0 && (
          <div className="rounded-3xl border border-border/40 bg-card/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <Accordion items={(p as any).faq} />
          </div>
        )}

        {/* Related Products Grid */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Related Products</h2>
                <p className="text-xs text-muted-foreground mt-1">Customers also customized these merchandise items</p>
              </div>
              <Link to="/products" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel: Product) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}