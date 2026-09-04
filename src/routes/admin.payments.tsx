import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminPayments } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

export const Route = createFileRoute('/admin/payments')({
  component: AdminPaymentsComponent,
});

function AdminPaymentsComponent() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminPayments({ page });

  const payments = (data as any)?.payments || (data as any)?.items || (Array.isArray(data) ? data : []);
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
      header: 'Transaction ID',
      cell: (p) => <span className="font-mono font-bold text-foreground">{p.transaction_id || p.reference_id || `PAY-${p.id}`}</span>,
    },
    {
      header: 'Order Reference',
      cell: (p) => <span className="font-mono text-muted-foreground">{p.order?.order_number || `ORD-${p.order_id}`}</span>,
    },
    {
      header: 'Payment Gateway',
      cell: (p) => <span className="capitalize font-semibold text-foreground">{p.payment_gateway || p.provider || 'Stripe/Razorpay'}</span>,
    },
    {
      header: 'Amount',
      cell: (p) => <span className="font-mono font-bold text-emerald-400">₹{Number(p.amount).toLocaleString()}</span>,
    },
    {
      header: 'Status',
      cell: (p) => <AdminStatusBadge status={p.status || 'captured'} />,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Payment Transactions & Ledger"
        description="Audit gateway payment records, transaction reference IDs, captures, and refund logs."
      />

      <AdminTable columns={columns} data={payments} isLoading={isLoading} emptyText="No payment transactions recorded." pagination={pagination} />
    </div>
  );
}
