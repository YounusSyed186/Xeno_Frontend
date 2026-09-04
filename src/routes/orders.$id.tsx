import { createFileRoute, notFound } from "@tanstack/react-router";
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useOrder } from '@/hooks/useOrders';
import { useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, XCircle, CreditCard, FileText, MapPin, Info } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/feedback/Skeleton';
import { toast } from 'sonner';

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetailComponent,
});

function OrderDetailComponent() {
  const { status, initialized } = useAuthStore();
  const navigate = useNavigate();
  const orderId = parseInt(Route.useParams().id, 10);
  const { data: order, isLoading, isError, error, refetch } = useOrder(orderId);

  useEffect(() => {
    if (initialized && status === 'unauthenticated') {
      navigate({ to: '/login' });
    }
  }, [initialized, status, navigate]);

  if (status === 'loading' || !initialized) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: "Loading..." }]}>
        <div className="space-y-4">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs font-semibold text-muted-foreground text-center">Loading order details...</p>
        </div>
      </PageContainer>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (isLoading) {
    return (
      <PageContainer
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: "Loading..." }]}
        title="Order Details"
        description="Loading order details..."
      >
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width="100%" height="160px" className="rounded-3xl" />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (isError || !order) {
    return (
      <PageContainer
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Orders", to: "/orders" }, { label: "Not Found" }]}
        title="Order Not Found"
        description={error?.message || "The order you're looking for doesn't exist"}
      >
        <EmptyState
          icon="alert"
          title="Order not found"
          description={error?.message || "The order you're looking for doesn't exist"}
          action={{ label: "Back to Orders", onClick: () => navigate({ to: '/orders' }) }}
        />
      </PageContainer>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'delivered':
        return { icon: <CheckCircle className="size-4 text-green-500" />, label: 'Delivered', color: 'text-green-500' };
      case 'cancelled':
        return { icon: <XCircle className="size-4 text-red-500" />, label: 'Cancelled', color: 'text-red-500' };
      case 'shipped':
        return { icon: <Truck className="size-4 text-blue-500" />, label: 'Shipped', color: 'text-blue-500' };
      case 'processing':
        return { icon: <Package className="size-4 text-purple-500" />, label: 'Processing', color: 'text-purple-500' };
      case 'confirmed':
        return { icon: <CheckCircle className="size-4 text-blue-500" />, label: 'Confirmed', color: 'text-blue-500' };
      default:
        return { icon: <Clock className="size-4 text-amber-500" />, label: status.replace('_', ' '), color: 'text-amber-500' };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Orders", to: "/orders" },
        { label: `Order #${order.order_number}` }
      ]}
      title={`Order #${order.order_number}`}
      description={`Placed on ${new Date(order.created_at || order.placed_at || Date.now()).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {['pending_payment', 'confirmed', 'processing'].includes(order.status) && (
            <button
              onClick={() => { /* cancel logic */ }}
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
            >
              Cancel Order
            </button>
          )}
        </div>
      }
    >

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <div className="glass-panel rounded-3xl p-6 border border-border/40">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Package className="size-5 text-primary" /> Order Items
            </h2>
            <div className="mt-6 divide-y divide-border/20">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface border border-border/40">
                      <img
                        src={item.product?.images?.[0]?.url || '/placeholder.png'}
                        alt={item.product_name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.product_name}</h3>
                      {item.variant_label && <p className="text-xs text-muted-foreground">{item.variant_label}</p>}
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground">₹{Number(item.line_total).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          {order.payments && order.payments.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="size-5 text-primary" /> Payment
              </h2>
              <div className="mt-4 space-y-3">
                {order.payments.map((payment: any) => (
                  <div key={payment.id} className="p-4 rounded-xl border border-border/40 bg-surface/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground capitalize">{payment.gateway}</p>
                        <p className="text-xs text-muted-foreground">₹{Number(payment.amount).toFixed(2)} • {payment.currency}</p>
                      </div>
                      <StatusBadge status={payment.status} />
                    </div>
                    {payment.paid_at && (
                      <p className="text-xs text-muted-foreground">Paid on {new Date(payment.paid_at).toLocaleDateString('en-IN')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoice */}
          {order.invoices && order.invoices.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <FileText className="size-5 text-primary" /> Invoices
              </h2>
              <div className="mt-4 space-y-3">
                {order.invoices.map((invoice: any) => (
                  <div key={invoice.id} className="p-4 rounded-xl border border-border/40 bg-surface/50 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{invoice.invoice_number}</p>
                      <p className="text-xs text-muted-foreground">₹{Number(invoice.total).toFixed(2)} • {invoice.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`/api/v1/invoices/${invoice.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        Download Invoice
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipment */}
          {order.shipments && order.shipments.length > 0 && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Truck className="size-5 text-primary" /> Shipment Tracking
              </h2>
              <div className="mt-4 space-y-4">
                {order.shipments.map((shipment: any) => (
                  <div key={shipment.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Tracking: {shipment.tracking_number}</p>
                        <p className="text-xs text-muted-foreground">Carrier: {shipment.carrier}</p>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>
                    {shipment.trackingEvents && shipment.trackingEvents.length > 0 && (
                      <div className="border-l-2 border-border/40 pl-4 space-y-3">
                        {shipment.trackingEvents
                          .sort((a: any, b: any) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
                          .map((event: any) => (
                            <div key={event.id} className="relative flex items-start gap-3">
                              <div className={`mt-1 size-2 rounded-full ${event.status === 'delivered' ? 'bg-green-500' : event.status === 'shipped' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                              <div>
                                <p className="font-medium text-sm text-foreground">{event.status}</p>
                                <p className="text-xs text-muted-foreground">{event.description} • {event.location}</p>
                                <p className="text-xs text-muted-foreground">{new Date(event.occurred_at).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production */}
          {order.productionOrder && (
            <div className="glass-panel rounded-3xl p-6 border border-border/40">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Package className="size-5 text-primary" /> Production Timeline
              </h2>
              <p className="mt-2 text-xs text-muted-foreground">Production: {order.productionOrder.production_number} • Stage: {order.productionOrder.current_stage}</p>
              {order.productionOrder.stageHistory && order.productionOrder.stageHistory.length > 0 && (
                <div className="mt-4 border-l-2 border-border/40 pl-4 space-y-3">
                  {order.productionOrder.stageHistory
                    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map((stage: any) => (
                      <div key={stage.id} className="relative flex items-start gap-3">
                        <div className="mt-1 size-2 rounded-full bg-primary" />
                        <div>
                          <p className="font-medium text-sm text-foreground capitalize">{stage.stage.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">{stage.notes || 'No notes'}</p>
                          <p className="text-xs text-muted-foreground">{new Date(stage.created_at).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="glass-panel rounded-3xl p-6 border border-border/40 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Info className="size-5 text-primary" /> Order Summary
            </h2>
            <div className="mt-4 space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-medium text-foreground">₹{Number(order.subtotal).toFixed(2)}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-green-500"><span>Discount</span><span>-₹{Number(order.discount).toFixed(2)}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span className="font-medium text-foreground">₹{Number(order.shipping).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (GST)</span><span className="font-medium text-foreground">₹{Number(order.tax).toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-border/40 pt-3 text-base font-bold text-foreground">
                <span>Total</span><span>₹{Number(order.total).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40 space-y-3">
              <p className="text-xs font-medium text-foreground">Shipping Address</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {order.shipping_address?.full_name}<br />
                {order.shipping_address?.address_line_1}<br />
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postal_code}<br />
                Ph: {order.shipping_address?.phone}
              </p>
            </div>

            <Link
              to="/orders"
              className="w-full rounded-xl border border-border/40 bg-surface px-4 py-2.5 text-center text-xs font-semibold text-foreground hover:bg-surface/80"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}