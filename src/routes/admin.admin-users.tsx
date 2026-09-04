import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminUsers, useAdminUserMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { UserCheck, ShieldAlert, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/admin-users')({
  component: AdminUsersComponent,
});

function AdminUsersComponent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminUsers({ role: 'admin', page });
  const { suspend, activate } = useAdminUserMutations();

  const users = (data as any)?.users || data?.items || [];
  const pagination = data?.pagination
    ? {
        currentPage: data.pagination.current_page,
        lastPage: data.pagination.last_page,
        total: data.pagination.total,
        onPageChange: (p: number) => setPage(p),
      }
    : undefined;

  const handleToggleStatus = (user: any) => {
    if (user.status === 'active') {
      suspend(user.id);
      toast.success('Admin user suspended');
    } else {
      activate(user.id);
      toast.success('Admin user activated');
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Staff Name & Email',
      cell: (u) => (
        <div>
          <span className="font-bold text-foreground">{u.name}</span>
          <p className="text-[10px] text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    {
      header: 'Assigned Role',
      cell: (u) => (
        <span className="capitalize font-mono font-semibold text-primary">
          {u.roles && u.roles[0] ? u.roles[0].label || u.roles[0].name : u.role || 'Admin'}
        </span>
      ),
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
          onClick={() => handleToggleStatus(u)}
          className={`px-3 py-1 rounded-xl text-xs font-semibold ${
            u.status === 'active'
              ? 'text-destructive bg-destructive/10 hover:bg-destructive/20'
              : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
          }`}
        >
          {u.status === 'active' ? 'Suspend' : 'Activate'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Staff Accounts & Management"
        description="Manage operational staff, administrators, managers, and system authorization accounts."
      />

      <AdminTable columns={columns} data={users} isLoading={isLoading} emptyText="No administrative staff users." pagination={pagination} />
    </div>
  );
}
