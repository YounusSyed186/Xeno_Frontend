import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminMaterials, useAdminMaterialMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/materials')({
  component: AdminMaterialsComponent,
});

function AdminMaterialsComponent() {
  const { data: materials = [], isLoading } = useAdminMaterials();
  const { create, destroy } = useAdminMaterialMutations();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({ name });
    setShowModal(false);
    setName('');
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete material?')) return;
    destroy(id);
  };

  const columns: Column<any>[] = [
    {
      header: 'Material Name',
      cell: (m) => <span className="font-semibold text-foreground">{m.name}</span>,
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
        title="Fabric & Material Attribute Management"
        description="Manage product fabric materials (e.g., 100% French Terry Cotton, Fleece, Polyester)."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Material
          </button>
        }
      />

      <AdminTable columns={columns} data={materials} isLoading={isLoading} emptyText="No materials created." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Add Fabric Material</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Material Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100% Organic Heavyweight Cotton"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
