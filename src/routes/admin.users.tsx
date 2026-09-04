import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAdminUsers, useAdminUserMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Search, Eye, UserCheck, ShieldAlert, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersIndexComponent,
});

function AdminUsersIndexComponent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    status: status || undefined,
    role: role || undefined,
    page,
    per_page: pageSize,
  });

  const { suspend, activate, update } = useAdminUserMutations();

  const users = (data as any)?.users || data?.items || [];
  const pagination = data?.pagination
    ? {
        currentPage: data.pagination.current_page,
        lastPage: data.pagination.last_page,
        total: data.pagination.total,
        onPageChange: (p: number) => setPage(p),
        pageSize,
        onPageSizeChange: (s: number) => setPageSize(s),
      }
    : undefined;

  const handleToggleStatus = (user: any) => {
    if (user.status === 'active') {
      suspend(user.id);
      toast.success('User suspended');
    } else {
      activate(user.id);
      toast.success('User activated');
    }
  };

  const handleRoleChange = (user: any, newRole: string) => {
    update({ id: user.id, payload: { roles: [newRole] } });
    toast.success('User role updated');
  };

  const columns: Column<any>[] = [
    {
      header: 'User',
      cell: (u) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <UserCheck className="size-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{u.name}</p>
            <p className="text-[10px] text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      cell: (u) => (
        <div className="space-y-1">
          {u.phone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="size-3" />
              <span>{u.phone}</span>
            </div>
          )}
          {!u.phone && <span className="text-xs text-muted-foreground">—</span>}
        </div>
      ),
    },
    {
      header: 'Role',
      cell: (u) => {
        const roleName = u.roles?.[0]?.name || u.role || 'customer';
        const roleLabel = u.roles?.[0]?.label || roleName;
        return (
          <span className="capitalize px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
            {roleLabel}
          </span>
        );
      },
    },
    {
      header: 'Status',
      cell: (u) => <AdminStatusBadge status={u.status || 'active'} />,
    },
    {
      header: 'Orders',
      cell: (u) => <span className="font-mono text-sm text-foreground">{u.orders_count || 0}</span>,
    },
    {
      header: 'Joined',
      cell: (u) => (
        <span className="text-xs text-muted-foreground">
          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (u) => (
        <div className="flex items-center justify-end gap-2">
          <select
            value={u.roles?.[0]?.name || u.role || 'customer'}
            onChange={(e) => handleRoleChange(u, e.target.value)}
            className="text-xs bg-background border border-border/40 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="support">Support</option>
          </select>
          <button
            onClick={() => handleToggleStatus(u)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title={u.status === 'active' ? 'Suspend user' : 'Activate user'}
          >
            {u.status === 'active' ? <ShieldAlert className="size-4" /> : <UserCheck className="size-4" />}
          </button>
          <button
            onClick={() => navigate({ to: `/admin/users/${u.id}` as any })}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title="View Details"
          >
            <Eye className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="All Users"
        description="Manage customer accounts and staff users. Filter by status, role, or search by name/email."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="hidden sm:block text-xs bg-background border border-border/40 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="hidden sm:block text-xs bg-background border border-border/40 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="support">Support</option>
            </select>
          </div>
        }
      />

      <AdminTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        pagination={pagination}
        emptyText="No users found."
        rowSelection={{
          selectedIds: [],
          onSelectionChange: () => {},
        }}
      />
    </div>
  );
}