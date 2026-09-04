import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminCategories, useAdminCategoryMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/categories')({
  component: AdminCategoriesComponent,
});

function AdminCategoriesComponent() {
  const { data: categories = [], isLoading } = useAdminCategories();
  const { create, update, destroy } = useAdminCategoryMutations();

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

  const handleOpenEdit = (category: any) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
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
    if (!confirm('Are you sure you want to delete this category?')) return;
    destroy(id);
  };

  const columns: Column<any>[] = [
    {
      header: 'Name',
      cell: (cat) => <span className="font-semibold text-foreground">{cat.name}</span>,
    },
    {
      header: 'Slug',
      cell: (cat) => <span className="font-mono text-muted-foreground">{cat.slug}</span>,
    },
    {
      header: 'Description',
      cell: (cat) => <span className="text-muted-foreground truncate max-w-xs block">{cat.description || '—'}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (cat) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(cat)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface"
          >
            <Edit className="size-3.5" />
          </button>
          <button
            onClick={() => handleDelete(cat.id)}
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
        title="Category Management"
        description="Organize store merchandise into hierarchical product categories."
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Category
          </button>
        }
      />

      <AdminTable columns={columns} data={categories} isLoading={isLoading} emptyText="No categories created yet." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              {editingId ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category Name</label>
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
