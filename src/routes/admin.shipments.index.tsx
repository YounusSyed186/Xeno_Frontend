import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminShipments, useAdminShipmentMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Truck, Plus } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/shipments/')({
  component: AdminShipmentsIndexComponent,
});

function AdminShipmentsIndexComponent() {
  const { data, isLoading } = useAdminShipments();
  const { addTrackingEvent } = useAdminShipmentMutations();

  const [showModal, setShowModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [status, setStatus] = useState('in_transit');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const shipments = data?.items || [];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    addTrackingEvent({
      id: selectedShipment.id,
      payload: { status, location, description },
    });
    toast.success('Tracking event added');
    setShowModal(false);
  };

  const columns: Column<any>[] = [
    {
      header: 'Tracking Number',
      cell: (s) => (
        <div>
          <span className="font-mono font-bold text-foreground">{s.tracking_number || `TRK-${s.id}`}</span>
          <p className="text-[10px] text-muted-foreground">Carrier: {s.carrier || 'Delhivery / BlueDart'}</p>
        </div>
      ),
    },
    {
      header: 'Order Reference',
      cell: (s) => <span className="font-mono text-muted-foreground">{s.order?.order_number || `ORD-${s.order_id}`}</span>,
    },
    {
      header: 'Status',
      cell: (s) => <AdminStatusBadge status={s.status || 'in_transit'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (s) => (
        <button
          onClick={() => {
            setSelectedShipment(s);
            setShowModal(true);
          }}
          className="flex items-center gap-1 ml-auto rounded-xl border border-border/40 bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface/80"
        >
          <Truck className="size-3.5 text-primary" /> + Tracking Event
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Shipment & Carrier Dispatch Operations"
        description="Track pan-India logistics dispatches, carriers, waybill numbers, and milestone tracking events."
      />

      <AdminTable columns={columns} data={shipments} isLoading={isLoading} emptyText="No shipment records available." />

      {showModal && selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Add Shipment Tracking Milestone Event</h3>
            <form onSubmit={handleAddEvent} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Event Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                >
                  <option value="dispatched">Dispatched</option>
                  <option value="in_transit">In Transit</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Hub Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai Logistics Hub"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <input
                  type="text"
                  placeholder="Package processed at sorting center"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border/40 bg-surface px-4 py-2 text-xs text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
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
