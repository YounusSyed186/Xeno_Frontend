import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useWishlist } from '@/hooks/useWishlist';
import { useEffect } from 'react';
import { Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/feedback/Skeleton';

export const Route = createFileRoute("/wishlist")({
  component: WishlistComponent,
});

function WishlistComponent() {
  const { status, initialized } = useAuthStore();
  const navigate = useNavigate();
  const { items, isLoading, isError, error, refetch, removeFromWishlist, isRemoving, moveToCart, isMovingToCart } = useWishlist();

  useEffect(() => {
    if (initialized && status === 'unauthenticated') {
      navigate({ to: '/login' });
    }
  }, [initialized, status, navigate]);

  if (status === 'loading' || !initialized) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Wishlist" }]}>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height="320px" className="rounded-2xl" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Account", to: "/account" },
        { label: "Wishlist" }
      ]}
      title="Your Wishlist"
      description={items.length > 0 ? `You have ${items.length} saved merchandise item${items.length !== 1 ? 's' : ''}` : 'Save products for later and move them to your cart when ready'}
      actions={
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="size-3.5" /> Browse Products
        </Link>
      }
    >
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height="320px" className="rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon="alert"
          title="Failed to load wishlist"
          description={error?.message || "Please check your network connection and try again"}
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Your wishlist is empty"
          description="Save custom apparel or merchandise items you love and come back to customize or purchase them later."
          action={{ label: "Start Shopping", onClick: () => navigate({ to: '/products' }) }}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => (
            <div key={item.id} className="rounded-2xl border border-border/40 overflow-hidden bg-card/60 flex flex-col group transition-all hover:border-primary/30">
              <div className="aspect-4/3 overflow-hidden relative">
                <img
                  src={item.product?.images?.[0]?.url || '/placeholder.png'}
                  alt={item.product?.name}
                  loading="lazy"
                  className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    disabled={isRemoving}
                    className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-muted-foreground hover:text-destructive hover:bg-destructive/15 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 flex flex-1 flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors text-base">
                    {item.product?.name}
                  </h3>
                  <p className="text-base font-extrabold text-gradient mt-1">
                    ₹{Number(item.product?.base_price || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border/20">
                  <button
                    onClick={() => moveToCart(item.product_id)}
                    disabled={isMovingToCart}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <ShoppingBag className="size-3.5" /> Move to Cart
                  </button>
                  <Link
                    to="/products/$slug"
                    params={{ slug: item.product?.slug }}
                    className="rounded-xl border border-border/60 bg-surface/80 px-3.5 py-2.5 text-xs font-semibold text-foreground hover:border-primary/40 transition-all"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}