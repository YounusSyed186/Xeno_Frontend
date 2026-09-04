import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminInvoices } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { FileText, Download } from 'lucide-react';

export const Route = createFileRoute('/admin/invoices')({
  component: AdminInvoicesComponent,
});

function AdminInvoicesComponent() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminInvoices({ page });

  const invoices = (data as any)?.invoices || (data as any)?.items || (Array.isArray(data) ? data : []);
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
      header: 'Invoice Number',
      cell: (inv) => (
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <span className="font-mono font-bold text-foreground">{inv.invoice_number || `INV-${inv.id}`}</span>
        </div>
      ),
    },
    {
      header: 'Order Reference',
      cell: (inv) => <span className="font-mono text-muted-foreground">{inv.order?.order_number || `ORD-${inv.order_id}`}</span>,
    },
    {
      header: 'Customer',
      cell: (inv) => <span className="font-semibold text-foreground">{inv.user?.name || inv.customer_name || 'Customer'}</span>,
    },
    {
      header: 'Total Amount',
      cell: (inv) => <span className="font-mono font-bold text-foreground">₹{Number(inv.total_amount || inv.amount).toLocaleString()}</span>,
    },
    {
      header: 'Status',
      cell: (inv) => <AdminStatusBadge status={inv.status || 'issued'} />,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tax Invoices & Billing Operations"
        description="Generated commercial invoices, tax breakdowns, and PDF records."
      />

      <AdminTable columns={columns} data={invoices} isLoading={isLoading} emptyText="No commercial invoices generated." pagination={pagination} />
    </div>
  );
}
