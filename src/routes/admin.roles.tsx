import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminRoles, useAdminPermissions, useAdminRoleMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { ShieldCheck, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/roles')({
  component: AdminRolesComponent,
});

function AdminRolesComponent() {
  const { data: roles = [], isLoading } = useAdminRoles();
  const { data: permissions = [] } = useAdminPermissions();
  const { create, destroy } = useAdminRoleMutations();

  const [showModal, setShowModal] = useState(false);
  const [label, setLabel] = useState('');
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({
      name: name || label.toLowerCase().replace(/\s+/g, '_'),
      label,
      permissions: selectedPermissions,
    });
    toast.success('Role created with permissions');
    setShowModal(false);
    setLabel('');
    setName('');
    setSelectedPermissions([]);
  };

  const handleDelete = (id: number) => {
    if (!confirm('Delete role?')) return;
    destroy(id);
    toast.success('Role deleted');
  };

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const columns: Column<any>[] = [
    {
      header: 'Role Label',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <span className="font-bold text-foreground">{r.label || r.name}</span>
        </div>
      ),
    },
    {
      header: 'System Key',
      cell: (r) => <span className="font-mono text-muted-foreground">{r.name}</span>,
    },
    {
      header: 'Assigned Permissions',
      cell: (r) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {r.permissions && r.permissions.length > 0 ? (
            r.permissions.map((p: any) => (
              <span key={p.id} className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground border border-border/40">
                {p.label || p.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground/60">No permissions</span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r) => (
        <button
          onClick={() => handleDelete(r.id)}
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
        title="Role-Based Access Control (RBAC)"
        description="Define operational roles and assign granular security permissions."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Create Role
          </button>
        }
      />

      <AdminTable columns={columns} data={roles} isLoading={isLoading} emptyText="No administrative roles defined." />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 border border-border/40 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-foreground">Create Role & Assign Permissions</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Role Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Catalog Operations Manager"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Granular Permissions</label>
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-surface/40 border border-border/40">
                  {permissions.map((p: any) => (
                    <label key={p.id} className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(p.id)}
                        onChange={() => togglePermission(p.id)}
                        className="rounded border-border/40 text-primary focus:ring-0"
                      />
                      <span>{p.label || p.name}</span>
                    </label>
                  ))}
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
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
