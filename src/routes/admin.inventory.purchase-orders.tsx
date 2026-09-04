import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminPurchaseOrders, useAdminSuppliers, useAdminWarehouses, useAdminInventoryMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Search, Truck, Package, CheckCircle, RotateCcw, Eye } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/inventory/purchase-orders')({
  component: AdminPurchaseOrdersComponent,
});

function AdminPurchaseOrdersComponent() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { data, isLoading } = useAdminPurchaseOrders({
    search: search || undefined,
    status: status || undefined,
    page,
    per_page: pageSize,
  });

  const { data: suppliers = [] } = useAdminSuppliers({ active_only: true });
  const { data: warehouses = [] } = useAdminWarehouses({ active_only: true });

  const { createPurchaseOrder, receivePurchaseOrder } = useAdminInventoryMutations();

  const orders = (data as any)?.purchase_orders || (data as any)?.items || [];
  const pagination = data?.pagination
    ? {
        currentPage: data.pagination.current_page,
        lastPage: data.pagination.last_page,
        total: data.pagination.total,
        onPageChange: (p: number) => setPage(p),
        pageSize,
        onPageSizeChange: (s: number) => setPageSize(s),
      }
    : undefined;

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [supplierId, setSupplierId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [expectedAt, setExpectedAt] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<Array<{ product_id: number; variant_id?: number; quantity: number; unit_cost: number }>>([{ product_id: 0, quantity: 1, unit_cost: 0 }]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setSupplierId('');
    setWarehouseId('');
    setExpectedAt('');
    setNotes('');
    setItems([{ product_id: 0, quantity: 1, unit_cost: 0 }]);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter(i => i.product_id > 0 && i.quantity > 0);
    if (validItems.length === 0) {
      toast.error('Please add at least one item');
      return;
    }
    const payload = {
      supplier_id: Number(supplierId),
      warehouse_id: Number(warehouseId),
      expected_at: expectedAt || undefined,
      notes,
      items: validItems.map(item => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
      })),
    };
    createPurchaseOrder(payload);
    toast.success('Purchase order created');
    setShowModal(false);
  };

  const addItem = () => setItems([...items, { product_id: 0, quantity: 1, unit_cost: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: any) => {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  const handleReceive = (order: any) => {
    const receivedItems = order.items.map((item: any) => ({
      purchase_order_item_id: item.id,
      received_quantity: item.quantity,
    }));
    receivePurchaseOrder({ id: order.id, items: receivedItems });
    toast.success('Items marked as received');
  };

  const columns: Column<any>[] = [
    {
      header: 'PO Number',
      cell: (o) => <span className="font-mono font-bold text-foreground">{o.po_number || `PO-${o.id}`}</span>,
    },
    {
      header: 'Supplier',
      cell: (o) => (
        <div>
          <p className="font-semibold text-foreground">{o.supplier?.name || 'Unknown'}</p>
          <p className="text-[10px] text-muted-foreground">{o.supplier?.contact_name || ''}</p>
        </div>
      ),
    },
    {
      header: 'Warehouse',
      cell: (o) => <span className="text-xs text-muted-foreground">{o.warehouse?.name || `WH #${o.warehouse_id}`}</span>,
    },
    {
      header: 'Items',
      cell: (o) => <span className="text-xs text-muted-foreground">{o.items_count || o.items?.length || 0} items</span>,
    },
    {
      header: 'Total Cost',
      cell: (o) => <span className="font-mono font-bold text-foreground">₹{Number(o.total_cost || 0).toLocaleString()}</span>,
    },
    {
      header: 'Status',
      cell: (o) => <AdminStatusBadge status={o.status} />,
    },
    {
      header: 'Expected',
      cell: (o) => <span className="text-xs text-muted-foreground">{o.expected_at ? new Date(o.expected_at).toLocaleDateString() : '—'}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (o) => (
        <div className="flex items-center justify-end gap-1.5">
          {o.status === 'ordered' || o.status === 'partially_received' ? (
            <button
              onClick={() => handleReceive(o)}
              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
              title="Receive Items"
            >
              <CheckCircle className="size-3.5" />
            </button>
          ) : null}
          <button
            onClick={() => {}}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="View Details"
          >
            <Eye className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Purchase Orders"
        description="Manage supplier purchase orders, track receipts, and maintain inventory replenishment."
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Create PO
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search purchase orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border/40 bg-surface/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-44 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="ordered">Ordered</option>
          <option value="partially_received">Partially Received</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        pagination={pagination}
        emptyText="No purchase orders found."
        showSearch={false}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 border border-border/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-foreground">Create Purchase Order</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Supplier *</label>
                  <select
                    required
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Warehouse *</label>
                  <select
                    required
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="">Select Warehouse</option>
                    {warehouses.map((w: any) => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Expected Date</label>
                  <input
                    type="date"
                    value={expectedAt}
                    onChange={(e) => setExpectedAt(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Internal notes for this purchase order"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-[11px]">Order Items</h4>
                  <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Plus className="size-3.5" /> Add Item
                  </button>
                </div>
                {items.map((item, idx) => (
                  <div key={idx} className="grid gap-3 grid-cols-12 p-3 bg-surface/50 rounded-xl border border-border/30">
                    <div className="col-span-4 space-y-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground">Product</label>
                      <select
                        value={item.product_id}
                        onChange={(e) => updateItem(idx, 'product_id', Number(e.target.value))}
                        className="w-full text-xs bg-background border border-border/40 rounded-lg px-2 py-1.5 focus:outline-none"
                      >
                        <option value={0}>Select Product</option>
                        {/* Products would be fetched here */}
                      </select>
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                        className="w-full text-xs font-mono bg-background border border-border/40 rounded-lg px-2 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-3 space-y-1.5">
                      <label className="text-[10px] font-semibold text-muted-foreground">Unit Cost (INR)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_cost}
                        onChange={(e) => updateItem(idx, 'unit_cost', Number(e.target.value))}
                        className="w-full text-xs font-mono bg-background border border-border/40 rounded-lg px-2 py-1.5 focus:outline-none"
                      />
                    </div>
                    <div className="col-span-3 flex items-end">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-destructive hover:underline text-xs flex items-center gap-1"
                      >
                        <RotateCcw className="size-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border/40 bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="size-4" /> Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}