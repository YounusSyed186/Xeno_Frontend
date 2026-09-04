import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminAuditLogs } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { History } from 'lucide-react';

export const Route = createFileRoute('/admin/audit-logs')({
  component: AdminAuditLogsComponent,
});

function AdminAuditLogsComponent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminAuditLogs({ page });

  const logs = data?.items || [];
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
      header: 'Timestamp',
      cell: (log) => <span className="font-mono text-muted-foreground">{new Date(log.created_at).toLocaleString()}</span>,
    },
    {
      header: 'Admin Staff',
      cell: (log) => <span className="font-semibold text-foreground">{log.user?.name || log.user_email || 'System'}</span>,
    },
    {
      header: 'Action Performed',
      cell: (log) => (
        <div className="flex items-center gap-1.5">
          <History className="size-3.5 text-primary" />
          <span className="font-mono font-semibold text-foreground capitalize">{log.action || log.event}</span>
        </div>
      ),
    },
    {
      header: 'Target Entity',
      cell: (log) => (
        <span className="font-mono text-muted-foreground">
          {log.entity_type} #{log.entity_id}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="System Audit & Security Logs"
        description="Immutable administrative audit trail recording catalog mutations, stock adjustments, order refunds, and RBAC changes."
      />

      <AdminTable columns={columns} data={logs} isLoading={isLoading} emptyText="No audit log records available." pagination={pagination} />
    </div>
  );
}
