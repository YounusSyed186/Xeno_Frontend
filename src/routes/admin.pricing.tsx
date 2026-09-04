import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminPricingTiers, useAdminPricingTierMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/pricing')({
  component: AdminPricingComponent,
});

function AdminPricingComponent() {
  const { data, isLoading } = useAdminPricingTiers();
  const { create, destroy } = useAdminPricingTierMutations();

  const [showModal, setShowModal] = useState(false);
  const [minQty, setMinQty] = useState('');
  const [maxQty, setMaxQty] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({
      min_quantity: Number(minQty),
      max_quantity: Number(maxQty) || null,
      discount_percent: Number(discountPercent),
    });
    toast.success('Price Tier Created');
    setShowModal(false);
  };

  const tiers = data || [];

  const columns: Column<any>[] = [
    {
      header: 'Min Quantity',
      cell: (tier) => <span className="font-mono font-bold text-foreground">{tier.min_quantity || 1} units</span>,
    },
    {
      header: 'Max Quantity',
      cell: (tier) => <span className="font-mono text-muted-foreground">{tier.max_quantity || 'Unlimited'}</span>,
    },
    {
      header: 'Discount / Tier Rate',
      cell: (tier) => <span className="font-mono font-bold text-emerald-400">{tier.discount_percent || tier.discount_value || 0}% Off</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Volume Tier Pricing & Rules"
        description="Configure quantity-based discount tiers and pricing rules."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Price Tier
          </button>
        }
      />

      <AdminTable columns={columns} data={tiers} isLoading={isLoading} emptyText="No price tiers defined." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Add Quantity Price Tier</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Min Quantity</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Max Quantity</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={maxQty}
                    onChange={(e) => setMaxQty(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  placeholder="15"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
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
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
