import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminPermissions, useAdminRoles } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Shield, Users, Key, Search } from 'lucide-react';

export const Route = createFileRoute('/admin/permissions')({
  component: AdminPermissionsComponent,
});

function AdminPermissionsComponent() {
  const [search, setSearch] = useState('');
  const { data: permissions = [], isLoading } = useAdminPermissions();
  const { data: roles = [] } = useAdminRoles();

  const filteredPermissions = permissions.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const permissionColumns: Column<any>[] = [
    {
      header: 'Permission',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          <div>
            <p className="font-semibold text-foreground">{p.label || p.name}</p>
            <p className="text-[10px] font-mono text-muted-foreground">{p.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      cell: (p) => <span className="text-xs text-muted-foreground">{p.description || '—'}</span>,
    },
    {
      header: 'Assigned Roles',
      cell: (p) => {
        const assignedRoles = roles.filter((r: any) => r.permissions?.some((perm: any) => perm.id === p.id || perm.name === p.name));
        if (assignedRoles.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {assignedRoles.slice(0, 3).map((r: any) => (
              <span key={r.id} className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                {r.label || r.name}
              </span>
            ))}
            {assignedRoles.length > 3 && (
              <span className="px-2 py-0.5 text-[10px] bg-muted/10 text-muted-foreground rounded-full">
                +{assignedRoles.length - 3} more
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Permissions"
        description="Manage system permissions and their role assignments."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search permissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        }
      />

      <AdminTable
        columns={permissionColumns}
        data={filteredPermissions}
        isLoading={isLoading}
        emptyText="No permissions found."
        showSearch={false}
      />
    </div>
  );
}