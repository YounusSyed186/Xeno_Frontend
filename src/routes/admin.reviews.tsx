import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminReviews, useAdminReviewMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Star, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/reviews')({
  component: AdminReviewsComponent,
});

function AdminReviewsComponent() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminReviews({ page });
  const { update } = useAdminReviewMutations();

  const reviews = data?.items || [];

  const handleUpdateStatus = (id: number, status: 'approved' | 'rejected') => {
    update({ id, payload: { status, rating: undefined } });
    toast.success(`Review ${status}`);
  };

  const columns: Column<any>[] = [
    {
      header: 'Product',
      cell: (r) => <span className="font-semibold text-foreground">{r.product?.name || `Product #${r.product_id}`}</span>,
    },
    {
      header: 'Customer',
      cell: (r) => <span className="text-xs text-muted-foreground">{r.user?.name || 'Customer'}</span>,
    },
    {
      header: 'Rating',
      cell: (r) => (
        <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
          <Star className="size-3.5 fill-amber-400" />
          <span>{r.rating} / 5</span>
        </div>
      ),
    },
    {
      header: 'Comment',
      cell: (r) => <span className="text-xs text-muted-foreground truncate max-w-xs block">{r.comment || 'No text review'}</span>,
    },
    {
      header: 'Status',
      cell: (r) => <AdminStatusBadge status={r.status || 'approved'} />,
    },
    {
      header: 'Moderation',
      className: 'text-right',
      cell: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleUpdateStatus(r.id, 'approved')}
            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
            title="Approve Review"
          >
            <CheckCircle className="size-4" />
          </button>
          <button
            onClick={() => handleUpdateStatus(r.id, 'rejected')}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
            title="Reject Review"
          >
            <XCircle className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customer Reviews Moderation"
        description="Moderate customer product feedback, star ratings, and review visibility."
      />

      <AdminTable columns={columns} data={reviews} isLoading={isLoading} emptyText="No customer reviews submitted." />
    </div>
  );
}
