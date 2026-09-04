import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminColors, useAdminColorMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/colors')({
  component: AdminColorsComponent,
});

function AdminColorsComponent() {
  const { data: colors = [], isLoading } = useAdminColors();
  const { create, destroy } = useAdminColorMutations();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [hex, setHex] = useState('#000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({ name, hex_code: hex });
    setShowModal(false);
    setName('');
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete color?')) return;
    destroy(id);
  };

  const columns: Column<any>[] = [
    {
      header: 'Color Name',
      cell: (c) => (
        <div className="flex items-center gap-2">
          <span className="size-4 rounded-full border border-border/40" style={{ backgroundColor: c.hex_code || '#888' }} />
          <span className="font-semibold text-foreground">{c.name}</span>
        </div>
      ),
    },
    {
      header: 'HEX Code',
      cell: (c) => <span className="font-mono text-muted-foreground">{c.hex_code || '—'}</span>,
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
        title="Color Palette Attribute Management"
        description="Configure product color variants and HEX swatch values."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Add Color
          </button>
        }
      />

      <AdminTable columns={columns} data={colors} isLoading={isLoading} emptyText="No colors created." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 border border-border/40 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Add Color Swatch</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Color Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Onyx Black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">HEX Code</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="size-8 rounded-lg bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className="flex-1 rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs font-mono text-foreground focus:outline-none"
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
                  Save Color
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
