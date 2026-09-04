import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAdminSupportTickets } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { LifeBuoy, Eye } from 'lucide-react';

export const Route = createFileRoute('/admin/support/')({
  component: AdminSupportIndexComponent,
});

function AdminSupportIndexComponent() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminSupportTickets({ page });

  const tickets = data?.items || [];
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
      header: 'Ticket #',
      cell: (t) => (
        <div className="flex items-center gap-2">
          <LifeBuoy className="size-4 text-sky-400" />
          <span className="font-mono font-bold text-foreground">{t.ticket_number || `TKT-${t.id}`}</span>
        </div>
      ),
    },
    {
      header: 'Subject',
      cell: (t) => <span className="font-semibold text-foreground truncate max-w-xs block">{t.subject}</span>,
    },
    {
      header: 'Customer',
      cell: (t) => <span className="text-xs text-muted-foreground">{t.user?.name || 'Customer'}</span>,
    },
    {
      header: 'Priority',
      cell: (t) => <span className="capitalize font-mono text-xs font-semibold text-amber-400">{t.priority || 'Normal'}</span>,
    },
    {
      header: 'Status',
      cell: (t) => <AdminStatusBadge status={t.status || 'open'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (t) => (
        <button
          onClick={() => navigate({ to: `/admin/support/${t.id}` as any })}
          className="flex items-center gap-1 ml-auto rounded-xl border border-border/40 bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface/80"
        >
          <Eye className="size-3.5 text-primary" /> Reply
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Support Operations Inbox"
        description="Respond to customer support inquiries, manage ticket priorities, and close resolved tickets."
      />

      <AdminTable columns={columns} data={tickets} isLoading={isLoading} emptyText="No support tickets in inbox." pagination={pagination} />
    </div>
  );
}
