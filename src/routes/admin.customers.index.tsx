import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAdminUsers } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Search, Eye, UserCheck, ShieldAlert } from 'lucide-react';

export const Route = createFileRoute('/admin/customers/')({
  component: AdminCustomersIndexComponent,
});

function AdminCustomersIndexComponent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    status: status || undefined,
    page,
  });

  const users = (data as any)?.users || data?.items || [];
  const pagination = data?.pagination
    ? {
        currentPage: data.pagination.current_page,
        lastPage: data.pagination.last_page,
        total: data.pagination.total,
        onPageChange: (p: number) => setPage(p),
      }
    : undefined;

  const columns: Column<any>[] = [
    {
      header: 'Customer',
      cell: (u) => (
        <div>
          <span className="font-bold text-foreground">{u.name}</span>
          <p className="text-[10px] text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      cell: (u) => <span className="font-mono text-muted-foreground">{u.phone || '—'}</span>,
    },
    {
      header: 'Total Orders',
      cell: (u) => <span className="font-mono font-semibold text-foreground">{u.orders_count || 0}</span>,
    },
    {
      header: 'Status',
      cell: (u) => <AdminStatusBadge status={u.status || 'active'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (u) => (
        <button
          onClick={() => navigate({ to: `/admin/customers/${u.id}` as any })}
          className="flex items-center gap-1 ml-auto rounded-xl border border-border/40 bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface/80"
        >
          <Eye className="size-3.5 text-primary" /> View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Directory & Profiles"
        description="Inspect registered customer accounts, order histories, addresses, and status controls."
      />

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border/40 bg-surface/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-44 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Account Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <AdminTable columns={columns} data={users} isLoading={isLoading} emptyText="No customer accounts found." pagination={pagination} />
    </div>
  );
}
