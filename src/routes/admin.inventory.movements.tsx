import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminMovements } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Search, Filter, Package, ArrowUpFromLine, ArrowDownToLine, RotateCcw, Plus, Minus } from 'lucide-react';

export const Route = createFileRoute('/admin/inventory/movements')({
  component: AdminInventoryMovementsComponent,
});

function AdminInventoryMovementsComponent() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { data, isLoading } = useAdminMovements({
    search: search || undefined,
    type: type || undefined,
    warehouse_id: warehouseId || undefined,
    page,
    per_page: pageSize,
  });

  const movements = (data as any)?.movements || (data as any)?.items || [];
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

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'adjustment':
        return <RotateCcw className="size-4 text-amber-400" />;
      case 'purchase_receipt':
        return <ArrowDownToLine className="size-4 text-emerald-400" />;
      case 'sale':
        return <ArrowUpFromLine className="size-4 text-sky-400" />;
      case 'transfer':
        return <Package className="size-4 text-purple-400" />;
      case 'return':
        return <RotateCcw className="size-4 text-rose-400" />;
      default:
        return <Package className="size-4 text-muted-foreground" />;
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Type',
      cell: (m) => (
        <div className="flex items-center gap-2">
          {getMovementIcon(m.type)}
          <span className="capitalize font-medium text-foreground">{m.type.replace(/_/g, ' ')}</span>
        </div>
      ),
    },
    {
      header: 'Product / Variant',
      cell: (m) => (
        <div>
          <p className="font-semibold text-foreground">{m.product_name || m.variant_sku || 'N/A'}</p>
          <p className="text-[10px] text-muted-foreground font-mono">SKU: {m.sku || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Warehouse',
      cell: (m) => <span className="text-xs text-muted-foreground">{m.warehouse_name || `WH #${m.warehouse_id}`}</span>,
    },
    {
      header: 'Quantity Change',
      cell: (m) => (
        <span className={`font-mono font-bold ${m.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {m.quantity > 0 ? '+' : ''}{m.quantity}
        </span>
      ),
    },
    {
      header: 'Previous Qty',
      cell: (m) => <span className="font-mono text-muted-foreground">{m.quantity_before || 0}</span>,
    },
    {
      header: 'New Qty',
      cell: (m) => <span className="font-mono text-foreground">{m.quantity_after || 0}</span>,
    },
    {
      header: 'Reference',
      cell: (m) => (
        <span className="text-xs text-muted-foreground font-mono">
          {m.reference_type ? `${m.reference_type} #${m.reference_id}` : '—'}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (m) => (
        <span className="text-xs text-muted-foreground">
          {m.created_at ? new Date(m.created_at).toLocaleString() : '—'}
        </span>
      ),
    },
    {
      header: 'Notes',
      cell: (m) => <span className="text-xs text-muted-foreground truncate max-w-xs block">{m.notes || '—'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Stock Movements"
        description="Complete audit trail of all inventory changes including adjustments, receipts, sales, and transfers."
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search movements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="text-xs bg-background border border-border/40 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="adjustment">Adjustment</option>
              <option value="purchase_receipt">Purchase Receipt</option>
              <option value="sale">Sale</option>
              <option value="transfer">Transfer</option>
              <option value="return">Return</option>
            </select>
          </div>
        }
      />

      <AdminTable
        columns={columns}
        data={movements}
        isLoading={isLoading}
        pagination={pagination}
        emptyText="No stock movements found."
        showSearch={false}
      />
    </div>
  );
}