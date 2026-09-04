import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminInventoryDashboard, useAdminInventoryMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Plus, Boxes, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/inventory/')({
  component: AdminInventoryIndexComponent,
});

function AdminInventoryIndexComponent() {
  const { data: stockData, isLoading } = useAdminInventoryDashboard();
  const { adjust } = useAdminInventoryMutations();

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [variantId, setVariantId] = useState('');
  const [warehouseId, setWarehouseId] = useState('1');
  const [quantityChange, setQuantityChange] = useState('');
  const [reason, setReason] = useState('');

  const items = (stockData as any)?.inventory || (stockData as any)?.items || (Array.isArray(stockData) ? stockData : []);

  const handleAdjustStock = (e: React.FormEvent) => {
    e.preventDefault();
    adjust({
      stock_id: Number(variantId),
      quantity: Number(quantityChange),
      type: 'adjustment',
      note: reason,
    });
    toast.success('Inventory adjustment recorded!');
    setShowAdjustModal(false);
  };

  const columns: Column<any>[] = [
    {
      header: 'Product / Variant SKU',
      cell: (item) => (
        <div>
          <span className="font-bold text-foreground">{item.product_name || item.product?.name}</span>
          <p className="text-[10px] font-mono text-muted-foreground">SKU: {item.sku}</p>
        </div>
      ),
    },
    {
      header: 'Current Stock',
      cell: (item) => (
        <span className="font-mono font-bold text-foreground text-sm">
          {item.current_stock ?? item.quantity ?? 0} units
        </span>
      ),
    },
    {
      header: 'Stock Status',
      cell: (item) => {
        const qty = item.current_stock ?? item.quantity ?? 0;
        const status = qty <= 0 ? 'out_of_stock' : qty < 10 ? 'low_stock' : 'in_stock';
        return <AdminStatusBadge status={status} />;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inventory & Stock Operations"
        description="Monitor stock levels across warehouses, track low-stock items, and perform audited inventory adjustments."
        actions={
          <button
            onClick={() => setShowAdjustModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Adjust Stock Level
          </button>
        }
      />

      <AdminTable columns={columns} data={items} isLoading={isLoading} emptyText="No inventory records available." />

      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Record Inventory Adjustment</h3>
            <form onSubmit={handleAdjustStock} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Variant ID *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1"
                  value={variantId}
                  onChange={(e) => setVariantId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Quantity Change (+ / -) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 10 or -2"
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Reason for Adjustment *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Received new shipment batch / Damaged item"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="rounded-xl border border-border/40 bg-surface px-4 py-2 text-xs text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
