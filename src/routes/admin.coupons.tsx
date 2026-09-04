import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminCoupons, useAdminCouponMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/coupons')({
  component: AdminCouponsComponent,
});

function AdminCouponsComponent() {
  const { data: coupons = [], isLoading } = useAdminCoupons();
  const { create, destroy } = useAdminCouponMutations();

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    create({
      code,
      name,
      discount_type: discountType,
      discount_value: Number(discountValue),
      is_active: true,
    });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    destroy(id);
  };

  const columns: Column<any>[] = [
    {
      header: 'Coupon Code',
      cell: (c) => <span className="font-mono font-bold text-primary text-sm">{c.code}</span>,
    },
    {
      header: 'Name',
      cell: (c) => <span className="font-semibold text-foreground">{c.name}</span>,
    },
    {
      header: 'Discount',
      cell: (c) => (
        <span className="font-mono font-medium text-foreground">
          {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (c) => <AdminStatusBadge status={c.is_active ? 'active' : 'inactive'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (c) => (
        <button
          onClick={() => handleDelete(c.id)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3.5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Promotional Coupon Management"
        description="Create discount codes, set percentage or fixed value price reductions, and manage usage rules."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Create Coupon
          </button>
        }
      />

      <AdminTable columns={columns} data={coupons} isLoading={isLoading} emptyText="No promotional coupons created." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Create Promotional Coupon</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Coupon Name</label>
                <input
                  type="text"
                  required
                  placeholder="Summer Promotion 25% Off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Discount Value *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="25"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
                  />
                </div>
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
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
