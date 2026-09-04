import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminCollections, useAdminCollectionMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/collections')({
  component: AdminCollectionsComponent,
});

function AdminCollectionsComponent() {
  const { data: collections = [], isLoading } = useAdminCollections();
  const { create, update, destroy } = useAdminCollectionMutations();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (col: any) => {
    setEditingId(col.id);
    setName(col.name);
    setDescription(col.description || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      update({ id: editingId, payload: { name, description } });
    } else {
      create({ name, description });
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete this collection?')) return;
    destroy(id);
  };

  const columns: Column<any>[] = [
    {
      header: 'Collection Name',
      cell: (col) => <span className="font-semibold text-foreground">{col.name}</span>,
    },
    {
      header: 'Slug',
      cell: (col) => <span className="font-mono text-muted-foreground">{col.slug}</span>,
    },
    {
      header: 'Description',
      cell: (col) => <span className="text-muted-foreground truncate max-w-xs block">{col.description || '—'}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (col) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(col)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface"
          >
            <Edit className="size-3.5" />
          </button>
          <button
            onClick={() => handleDelete(col.id)}
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
        title="Collections Management"
        description="Group merchandise into curated seasonal and featured collections."
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Collection
          </button>
        }
      />

      <AdminTable columns={columns} data={collections} isLoading={isLoading} emptyText="No collections found." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              {editingId ? 'Edit Collection' : 'Create Collection'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Collection Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  rows={3}
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
                  Save Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
