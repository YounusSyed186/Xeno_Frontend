import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useAdminShipment, useAdminShipmentMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Truck, MapPin, Calendar, ArrowLeft, Plus, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/shipments/$id')({
  component: AdminShipmentDetailComponent,
});

function AdminShipmentDetailComponent() {
  const { id } = Route.useParams();
  const { data: shipment, isLoading, isError } = useAdminShipment(id);
  const { addTrackingEvent, update } = useAdminShipmentMutations();

  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('in_transit');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [isEditingDispatch, setIsEditingDispatch] = useState(false);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    addTrackingEvent({
      id: shipment.id,
      payload: { status, location, description },
    });
    setShowModal(false);
    setLocation('');
    setDescription('');
  };

  const handleUpdateDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    update({
      id: shipment.id,
      payload: {
        carrier: carrier || shipment.carrier,
        tracking_number: trackingNumber || shipment.tracking_number,
        tracking_url: trackingUrl || shipment.tracking_url,
      },
    });
    setIsEditingDispatch(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="h-64 w-full animate-pulse rounded-3xl bg-surface" />
      </div>
    );
  }

  if (isError || !shipment) {
    return (
      <div className="space-y-6">
        <Link
          to="/admin/shipments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Shipments
        </Link>
        <div className="rounded-3xl border border-border/40 bg-card p-12 text-center">
          <p className="text-sm font-semibold text-foreground">Shipment not found or unable to load details.</p>
        </div>
      </div>
    );
  }

  const events = shipment.tracking_events || shipment.trackingEvents || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/admin/shipments"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Shipments
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Add Tracking Milestone
          </button>
        </div>
      </div>

      <AdminPageHeader
        title={`Shipment #${shipment.tracking_number || shipment.id}`}
        description={`Carrier: ${shipment.carrier || 'Delhivery / BlueDart'} • Order Ref: ${shipment.order?.order_number || shipment.order_id}`}
        actions={<AdminStatusBadge status={shipment.status || 'in_transit'} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Tracking Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Truck className="size-4 text-primary" /> Tracking Timeline & Milestones
            </h3>

            {events.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No tracking milestone events logged yet. Click &quot;Add Tracking Milestone&quot; to add dispatch updates.
              </p>
            ) : (
              <div className="relative border-l-2 border-border/50 ml-4 space-y-6 py-2">
                {events.map((ev: any, idx: number) => (
                  <div key={ev.id || idx} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 flex size-4 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                      <CheckCircle2 className="size-3 text-primary-foreground" />
                    </span>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground capitalize">
                          {ev.status?.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Clock className="size-3" />
                          {ev.occurred_at ? new Date(ev.occurred_at).toLocaleString() : 'Recent'}
                        </span>
                      </div>
                      {ev.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="size-3 text-primary" /> {ev.location}
                        </p>
                      )}
                      {ev.description && (
                        <p className="text-xs text-foreground/80 bg-surface/40 p-2.5 rounded-xl border border-border/20 mt-1">
                          {ev.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Shipment Details & Dispatch Meta */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="text-sm font-bold text-foreground">Dispatch Details</h3>
              <button
                onClick={() => {
                  setCarrier(shipment.carrier || '');
                  setTrackingNumber(shipment.tracking_number || '');
                  setTrackingUrl(shipment.tracking_url || '');
                  setIsEditingDispatch(!isEditingDispatch);
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {isEditingDispatch ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {isEditingDispatch ? (
              <form onSubmit={handleUpdateDispatch} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Carrier</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="e.g. Delhivery, BlueDart, DTDC"
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tracking URL</label>
                  <input
                    type="text"
                    value={trackingUrl}
                    onChange={(e) => setTrackingUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Save Dispatch Info
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Carrier</span>
                  <span className="font-semibold text-foreground">{shipment.carrier || 'Not assigned'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Waybill / Tracking No.</span>
                  <span className="font-mono font-bold text-foreground">
                    {shipment.tracking_number || 'TRK-' + shipment.id}
                  </span>
                </div>
                {shipment.tracking_url && (
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Carrier Portal</span>
                    <a
                      href={shipment.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {shipment.tracking_url}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground block text-[11px]">Dispatched At</span>
                  <span className="text-foreground">
                    {shipment.dispatched_at ? new Date(shipment.dispatched_at).toLocaleString() : 'Pending dispatch'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Estimated Delivery</span>
                  <span className="text-foreground">
                    {shipment.estimated_delivery_at
                      ? new Date(shipment.estimated_delivery_at).toLocaleDateString()
                      : '3-5 Business Days'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Milestone Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-foreground">Add Tracking Milestone</h3>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Milestone Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="dispatched">Dispatched</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Hub / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai Logistics Hub, MH"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Package arrived at distribution hub, sorted for last mile delivery."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border/40 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
