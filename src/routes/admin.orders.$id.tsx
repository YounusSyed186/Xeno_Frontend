import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useAdminOrder, useAdminOrderMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { ArrowLeft, Loader2, RefreshCw, Truck, DollarSign, Clock, User, Package, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/orders/$id')({
  component: AdminOrderDetailComponent,
});

function AdminOrderDetailComponent() {
  const { id } = useParams({ from: '/admin/orders/$id' });
  const navigate = useNavigate();
  const orderId = Number(id);

  const { data: order, isLoading, error } = useAdminOrder(orderId);
  const { updateStatus, refund, generateInvoice } = useAdminOrderMutations();

  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (order) {
      setNewStatus(order.status || '');
    }
  }, [order]);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStatus(true);
    updateStatus({ id: orderId, status: newStatus, note: statusNotes });
    toast.success('Order status updated!');
    setIsUpdatingStatus(false);
  };

  const handleRefund = () => {
    if (!confirm('Are you sure you want to trigger a refund for this order?')) return;
    // Note: refund amount and reason would need to be collected from user
    refund({ id: orderId, amount: order?.total_amount || order?.total || 0, reason: 'Admin refund' });
    toast.success('Refund processed successfully');
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Order ${order.order_number}`}
        description={`Placed on ${new Date(order.created_at).toLocaleString()}`}
        actions={
          <div className="flex items-center gap-2">
            <AdminStatusBadge status={order.status} />
            <button
              onClick={() => navigate({ to: '/admin/orders' })}
              className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Back to Orders
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Order Items & Customizations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Package className="size-4 text-primary" /> Order Items & Customizations
            </h2>

            <div className="divide-y divide-border/20">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{item.product_name || item.product?.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      SKU: {item.sku || 'N/A'} | Variant: {item.variant_name || 'Standard'}
                    </p>
                    {item.customizations && item.customizations.length > 0 && (
                      <div className="mt-2 text-[10px] bg-surface/80 p-2 rounded-xl border border-border/30 text-emerald-400 font-mono">
                        Customization: {JSON.stringify(item.customizations)}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">₹{Number(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-[10px] text-muted-foreground">{item.quantity} x ₹{Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border/40 flex justify-between items-center text-xs font-bold text-foreground">
              <span>Total Amount</span>
              <span className="font-mono text-base text-primary">₹{Number(order.total_amount || order.total || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Fulfillment Status Transition Box */}
          <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" /> Update Fulfillment Status
            </h2>

            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="pending_payment">Pending Payment</option>
                    <option value="payment_confirmed">Payment Confirmed</option>
                    <option value="artwork_review">Artwork Review</option>
                    <option value="artwork_approved">Artwork Approved</option>
                    <option value="production">In Production</option>
                    <option value="quality_control">Quality Control</option>
                    <option value="packed">Packed</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Status Notes</label>
                  <input
                    type="text"
                    placeholder="Optional transition notes..."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Updating...' : 'Update Order Status'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Customer Info & Payment Operations */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-3 text-xs">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <User className="size-4 text-primary" /> Customer Profile
            </h2>
            <div className="pt-2 space-y-1">
              <p className="font-bold text-foreground">{order.user?.name || 'Guest'}</p>
              <p className="text-muted-foreground">{order.user?.email}</p>
              <p className="text-muted-foreground">{order.user?.phone || 'No phone provided'}</p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-4 text-xs">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <DollarSign className="size-4 text-primary" /> Payment Operations
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Provider:</span>
                <span className="font-semibold text-foreground capitalize">{order.payment_method || 'Online'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status:</span>
                <AdminStatusBadge status={order.payment_status || 'paid'} />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-border/20">
              <button
                onClick={handleRefund}
                className="w-full rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition-colors"
              >
                Trigger Order Refund
              </button>
              <button
                onClick={() => {
                  generateInvoice(orderId);
                  toast.success('Invoice generation initiated');
                }}
                disabled={order.payment_status !== 'paid' || order.invoice}
                className="w-full rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FileText className="size-3.5" />
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
