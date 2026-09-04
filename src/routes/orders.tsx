import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useOrders, useCancelOrder } from '@/hooks/useOrders';
import { useAuthStore } from '@/stores/auth.store';
import { useEffect } from 'react';
import { Clock, Truck, CheckCircle, XCircle, ArrowRight, Package } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/feedback/Skeleton';

export const Route = createFileRoute('/orders')({
  component: OrdersComponent,
});

function OrdersComponent() {
  const { status, initialized } = useAuthStore();
  const navigate = useNavigate();
  const { orders, pagination, isLoading, isError, error, refetch, cancelOrder, isCancelling } = useOrders({ page: 1, per_page: 10 });

  useEffect(() => {
    if (initialized && status === 'unauthenticated') {
      navigate({ to: '/login' });
    }
  }, [initialized, status, navigate]);

  if (status === 'loading' || !initialized) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Orders" }]}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height="130px" className="rounded-3xl" />
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
        { label: "Orders" }
      ]}
      title="My Orders"
      description="Track live manufacturing stage, shipments, view line items, or download GST invoices"
    >
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height="130px" className="rounded-3xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon="alert"
          title="Failed to load orders"
          description={error?.message || "Please try refreshing your browser"}
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="package"
          title="No orders found"
          description="When you place orders for custom apparel or merchandise, their live production milestones will appear here."
          action={{ label: "Start Shopping", onClick: () => navigate({ to: '/products' }) }}
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="rounded-3xl border border-border/40 bg-card/60 p-6 sm:p-7 space-y-4 shadow-md backdrop-blur-sm transition-all hover:border-border/70"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/30 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/orders/$id"
                      params={{ id: String(order.id) }}
                      className="text-sm font-mono font-bold text-primary hover:underline"
                    >
                      Order #{order.order_number}
                    </Link>
                    <StatusBadge status={order.status} label={order.status} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Placed on {new Date(order.created_at || order.placed_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Order Total</p>
                    <p className="text-base font-extrabold text-foreground">
                      ₹{Number(order.total || order.total_amount || 0).toFixed(2)}
                    </p>
                  </div>
                  <Link
                    to="/orders/$id"
                    params={{ id: String(order.id) }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
                  >
                    Details <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="divide-y divide-border/20">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-foreground">{item.product_name || item.product?.name || 'Custom Product'}</p>
                      <p className="text-muted-foreground text-[11px]">
                        Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                      </p>
                    </div>
                    <span className="font-bold text-foreground">₹{Number(item.line_total).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {['pending_payment', 'confirmed', 'processing'].includes(order.status) && (
                <div className="flex justify-end pt-2 border-t border-border/20">
                  <button
                    type="button"
                    disabled={isCancelling}
                    onClick={() => cancelOrder(order.id)}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}