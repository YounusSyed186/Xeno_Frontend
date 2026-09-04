import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminBrands, useAdminBrandMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/brands')({
  component: AdminBrandsComponent,
});

function AdminBrandsComponent() {
  const { data: brands = [], isLoading } = useAdminBrands();
  const { create, update, destroy } = useAdminBrandMutations();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setShowModal(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingId(b.id);
    setName(b.name);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      update({ id: editingId, payload: { name } });
    } else {
      create({ name });
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this brand?')) return;
    destroy(id);
  };

  const columns: Column<any>[] = [
    {
      header: 'Brand Name',
      cell: (b) => <span className="font-semibold text-foreground">{b.name}</span>,
    },
    {
      header: 'Slug',
      cell: (b) => <span className="font-mono text-muted-foreground">{b.slug}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (b) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(b)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface"
          >
            <Edit className="size-3.5" />
          </button>
          <button
            onClick={() => handleDelete(b.id)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Brand Management"
        description="Manage apparel and merchandise brand entities."
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Brand
          </button>
        }
      />

      <AdminTable columns={columns} data={brands} isLoading={isLoading} emptyText="No brands found." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              {editingId ? 'Edit Brand' : 'Create Brand'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Brand Name</label>
                <input
                  type="text"
                  required
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
