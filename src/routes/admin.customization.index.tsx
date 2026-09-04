import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminPrintingMethods, useAdminPrintingMethodMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Printer, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/customization/')({
  component: AdminCustomizationIndexComponent,
});

function AdminCustomizationIndexComponent() {
  const { data: methods = [], isLoading } = useAdminPrintingMethods();
  const { create, destroy } = useAdminPrintingMethodMutations();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({
      name,
      description,
      base_price: Number(basePrice || 0),
      is_active: true,
    });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete printing method?')) return;
    destroy(id);
    toast.success('Deleted printing method');
  };

  const columns: Column<any>[] = [
    {
      header: 'Printing Method',
      cell: (m) => (
        <div className="flex items-center gap-2">
          <Printer className="size-4 text-primary" />
          <span className="font-semibold text-foreground">{m.name}</span>
        </div>
      ),
    },
    {
      header: 'Description',
      cell: (m) => <span className="text-muted-foreground truncate max-w-xs block">{m.description || '—'}</span>,
    },
    {
      header: 'Base Setup Fee',
      cell: (m) => <span className="font-mono font-bold text-foreground">₹{Number(m.base_price || 0).toFixed(2)}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (m) => (
        <button
          onClick={() => handleDelete(m.id)}
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
        title="Merchandise Customization Engine Configuration"
        description="Configure printing methods (DTG, Screen Print, Embroidery), print placements, and artwork fees."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Printing Method
          </button>
        }
      />

      <AdminTable columns={columns} data={methods} isLoading={isLoading} emptyText="No printing methods configured." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Add Customization Printing Method</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Method Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Screen Printing / High Density Embroidery"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  placeholder="Method details, recommended fabrics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Base Setup Fee (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
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
                  Save Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
