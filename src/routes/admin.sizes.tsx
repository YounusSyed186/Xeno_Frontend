import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminSizes, useAdminSizeMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/sizes')({
  component: AdminSizesComponent,
});

function AdminSizesComponent() {
  const { data: sizes = [], isLoading } = useAdminSizes();
  const { create, destroy } = useAdminSizeMutations();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({ name, code: code || name });
    setShowModal(false);
    setName('');
    setCode('');
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete size?')) return;
    destroy(id);
  };

  const columns: Column<any>[] = [
    {
      header: 'Size Name',
      cell: (s) => <span className="font-semibold text-foreground">{s.name}</span>,
    },
    {
      header: 'Code / Abbreviation',
      cell: (s) => <span className="font-mono text-muted-foreground font-bold">{s.code || s.name}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (s) => (
        <button
          onClick={() => handleDelete(s.id)}
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
        title="Size System Attribute Management"
        description="Manage standard sizing options (e.g., S, M, L, XL, XXL, 3XL)."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Size Option
          </button>
        }
      />

      <AdminTable columns={columns} data={sizes} isLoading={isLoading} emptyText="No sizes created." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Add Size Option</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Size Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extra Large"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Code / Abbreviation</label>
                <input
                  type="text"
                  placeholder="e.g. XL"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
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
                  Save Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
