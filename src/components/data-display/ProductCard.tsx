import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Reveal } from '@/components/xeno/Reveal';
import { TiltCard } from '@/components/xeno/ui';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  className?: string;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'default',
  className = '',
  onClick,
}) => {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const hasVariants = product.variants && product.variants.length > 0;
  const inStock = hasVariants
    ? (product.variants || []).some((v) => v.stock_status === 'in_stock')
    : ((product as any).stocks?.some((s: any) => s.available > 0) ?? true);

  const categorySlug = product.category?.slug?.toLowerCase() || '';
  const categoryName = product.category?.name?.toLowerCase() || '';
  const isCustomizable = Boolean(
    (product as any).has_customization ||
    (product as any).customizations?.length ||
    product.variants?.length ||
    ['apparel', 't-shirt', 'hoodie', 'jersey', 'polo', 'cap', 'uniform', 'wear', 'garment'].some(
      (term) => categorySlug.includes(term) || categoryName.includes(term)
    )
  );

  const moq = product.moq && product.moq > 1 ? product.moq : null;
  const lowestTierPrice = product.price_tiers && product.price_tiers.length > 0
    ? Math.min(...product.price_tiers.map((t) => Number(t.unit_price)))
    : null;
  const colorHexes = Array.from(
    new Set(
      (product.variants || [])
        .map((v) => (v.color as any)?.hex || v.color?.hex_code)
        .filter((hex): hex is string => Boolean(hex))
    )
  ).slice(0, 5);

  if (variant === 'compact') {
    return (
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        onClick={onClick}
        className={`group flex items-center gap-4 rounded-xl border border-border/40 bg-card/60 p-3 transition-colors duration-500 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
      >
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-surface border border-border/40">
          <img
            src={primaryImage?.url || '/placeholder.svg'}
            alt={product.name}
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
            loading="lazy"
            width={160}
            height={160}
            className="size-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.08]"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
          <p className="mt-1 text-sm font-medium text-foreground">
            ₹{Number(product.base_price).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {inStock ? 'In stock' : 'Out of stock'}
          </p>
        </div>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-primary transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Reveal delay={0}>
      <TiltCard className="h-full">
        <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] hairline bg-card/60 transition-colors duration-500 hover:border-primary/30">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            onClick={onClick}
            className="relative aspect-4/3 overflow-hidden block focus-visible:outline-none"
          >
            <img
              src={primaryImage?.url || '/placeholder.svg'}
              alt={product.name}
              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
              loading="lazy"
              width={1024}
              height={768}
              className="size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-lux)] group-hover:scale-[1.08]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
            {!inStock && (
              <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                <StatusBadge status="out_of_stock" label="Out of Stock" className="text-sm" />
              </div>
            )}
            {product.is_featured && (
              <div className="absolute top-3 left-3 z-10">
                <StatusBadge status="info" label="Featured" className="text-xs" />
              </div>
            )}
            {moq && (
              <div className="absolute top-3 right-3 z-10">
                <span className="rounded-full bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-zinc-100 shadow-sm">
                  MOQ: {moq}
                </span>
              </div>
            )}
          </Link>
          <div className="flex flex-1 flex-col p-6">
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              onClick={onClick}
              className="block group/link"
            >
              <h3 className="flex items-start justify-between gap-3 text-xl group-hover/link:text-primary transition-colors">
                <span>{product.name}</span>
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-primary transition-transform duration-500 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" aria-hidden="true" />
              </h3>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">{product.short_description}</p>
            <div className="mt-auto pt-4 border-t border-border/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display text-2xl font-extrabold text-gradient">
                    ₹{Number(product.base_price).toLocaleString()}
                  </p>
                  {lowestTierPrice && lowestTierPrice < Number(product.base_price) && (
                    <span className="text-[11px] font-semibold text-primary block mt-0.5">
                      From ₹{lowestTierPrice.toLocaleString()} in bulk
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge
                    status={inStock ? 'in_stock' : 'out_of_stock'}
                    label={inStock ? 'In Stock' : 'Out of Stock'}
                  />
                  {colorHexes.length > 0 && (
                    <div className="flex items-center gap-1 mt-0.5" title="Available colors">
                      {colorHexes.map((hex, i) => (
                        <span
                          key={i}
                          className="size-2.5 rounded-full border border-white/30 shadow-xs"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {isCustomizable ? (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="flex items-center justify-center rounded-xl border border-border/60 py-2.5 text-center text-xs font-semibold text-foreground hover:bg-surface hover:border-primary/40 transition-all"
                  >
                    Details
                  </Link>
                  <Link
                    to="/studio"
                    search={{ product: product.slug }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <Sparkles className="size-3.5" /> Customise
                  </Link>
                </div>
              ) : (
                <Link
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  className="w-full flex items-center justify-center rounded-xl bg-surface/80 border border-border/60 py-2.5 text-center text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-transparent transition-all"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        </div>
      </TiltCard>
    </Reveal>
  );
};