import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAdminOrders } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Search, Eye, Filter } from 'lucide-react';

export const Route = createFileRoute('/admin/orders/')({
  component: AdminOrdersIndexComponent,
});

function AdminOrdersIndexComponent() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminOrders({
    search: search || undefined,
    status: status || undefined,
    page,
  });

  const orders = (data as any)?.orders || (data as any)?.items || (Array.isArray(data) ? data : []);
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
      header: 'Order Reference',
      cell: (order) => (
        <div>
          <span className="font-bold text-foreground font-mono">{order.order_number}</span>
          <p className="text-[10px] text-muted-foreground">
            {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Customer',
      cell: (order) => (
        <div>
          <p className="font-semibold text-foreground">{order.user?.name || 'Guest User'}</p>
          <p className="text-[10px] text-muted-foreground">{order.user?.email}</p>
        </div>
      ),
    },
    {
      header: 'Items',
      cell: (order) => (
        <span className="text-xs text-muted-foreground font-medium">
          {order.items_count || order.items?.length || 1} item(s)
        </span>
      ),
    },
    {
      header: 'Total Amount',
      cell: (order) => (
        <span className="font-mono font-bold text-foreground">
          ₹{Number(order.total_amount || order.total || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Fulfillment Status',
      cell: (order) => <AdminStatusBadge status={order.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (order) => (
        <button
          onClick={() => navigate({ to: `/admin/orders/${order.id}` as any })}
          className="flex items-center gap-1.5 ml-auto rounded-xl border border-border/40 bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors"
        >
          <Eye className="size-3.5 text-primary" /> View Order
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Order Operations Management"
        description="Monitor placed B2C merchandise orders, status transitions, payments, and fulfillment."
      />

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border/40 bg-surface/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full sm:w-48 rounded-xl border border-border/40 bg-surface/40 px-3 py-2 text-xs text-foreground focus:outline-none"
        >
          <option value="">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="in_production">In Production</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <AdminTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyText="No orders found."
        pagination={pagination}
      />
    </div>
  );
}
