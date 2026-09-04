import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCart } from '@/hooks/useCart';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useState } from 'react';
import { PageContainer } from '@/components/ui';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/feedback/Skeleton';

export const Route = createFileRoute('/cart')({
  component: CartComponent,
});

function CartComponent() {
  const { cart, breakdown, items, itemCount, isLoading, updateItem, removeItem, applyCoupon, removeCoupon, isApplyingCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    applyCoupon(couponCode.trim());
    setCouponCode('');
  };

  if (isLoading) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]}>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} variant="rectangular" width="100%" height="110px" className="rounded-2xl" />
            ))}
          </div>
          <div className="lg:col-span-4">
            <Skeleton variant="rectangular" width="100%" height="320px" className="rounded-3xl" />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!items || items.length === 0) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]}>
        <EmptyState
          icon="cart"
          title="Your shopping cart is empty"
          description="You haven't added any custom apparel or merchandise items to your cart yet."
          action={{
            label: "Explore Product Catalog",
            onClick: () => navigate({ to: '/products' }),
            variant: "primary"
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]}
      title="Shopping Cart"
      description={`Review your selected merchandise items (${itemCount} item${itemCount !== 1 ? 's' : ''}) before moving to checkout`}
    >
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/60 p-5 sm:flex-row sm:items-center sm:justify-between transition-all hover:border-border/60"
            >
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-surface border border-border/40">
                  <img
                    src={item.product?.images?.[0]?.url || '/placeholder.png'}
                    alt={item.product?.name || 'Product'}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">
                    {item.product?.name}
                  </h3>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Variant: {[item.variant.color?.name, item.variant.size?.name].filter(Boolean).join(' / ')}
                    </p>
                  )}
                  {item.customization_snapshot && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary mt-1">
                      Customised Item
                    </span>
                  )}
                  <p className="mt-1 text-sm font-medium text-foreground">
                    ₹{Number(item.unit_price).toFixed(2)} each
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                {/* Quantity Stepper */}
                <div className="flex items-center rounded-xl border border-border/60 bg-surface/60 p-0.5">
                  <button
                    type="button"
                    onClick={() => updateItem({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-foreground">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-20">
                  <p className="font-bold text-foreground text-base">
                    ₹{Number(item.line_total).toFixed(2)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-destructive/10"
                  title="Remove item"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="space-y-6 rounded-3xl border border-border/40 bg-card/60 p-6 shadow-md backdrop-blur-sm sticky top-28">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="PROMO CODE"
                className="w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-xs font-semibold uppercase text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={isApplyingCoupon}
                className="rounded-xl bg-surface px-4 py-2 text-xs font-bold text-foreground border border-border/60 hover:bg-surface/80 transition-all shrink-0"
              >
                Apply
              </button>
            </form>

            {cart?.coupon && (
              <div className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs text-primary font-medium">
                <span className="flex items-center gap-1.5">
                  <Tag className="size-3.5" /> Coupon: <strong>{cart.coupon.code}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => removeCoupon()}
                  className="text-[11px] font-bold underline hover:opacity-80 ml-2"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="space-y-3 text-xs text-muted-foreground pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">
                  ₹{Number(breakdown?.subtotal ?? cart?.subtotal ?? 0).toFixed(2)}
                </span>
              </div>

              {Number(breakdown?.discount ?? breakdown?.discount_amount ?? 0) > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-₹{Number(breakdown?.discount ?? breakdown?.discount_amount ?? 0).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated GST</span>
                <span className="font-semibold text-foreground">
                  ₹{Number(breakdown?.tax ?? breakdown?.tax_amount ?? 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-foreground">
                  {Number(breakdown?.shipping ?? breakdown?.shipping_amount ?? 0) > 0
                    ? `₹${Number(breakdown?.shipping ?? breakdown?.shipping_amount).toFixed(2)}`
                    : 'Calculated at Checkout'}
                </span>
              </div>

              <div className="flex justify-between border-t border-border/40 pt-3 text-base font-extrabold text-foreground">
                <span>Total</span>
                <span className="text-gradient font-display text-xl">
                  ₹{Number(breakdown?.total ?? breakdown?.grand_total ?? cart?.total ?? cart?.subtotal ?? 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate({ to: '/checkout' })}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 shadow-md min-h-12"
            >
              Proceed to Checkout <ArrowRight className="size-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-2">
              <ShieldCheck className="size-3.5 text-primary" />
              <span>Safe & Secure 256-Bit Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
