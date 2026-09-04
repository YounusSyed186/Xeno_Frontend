import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminArtworks, useAdminArtworkMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/customization/artworks')({
  component: AdminArtworksComponent,
});

function AdminArtworksComponent() {
  const { data: artworks = [], isLoading } = useAdminArtworks();
  const { updateStatus } = useAdminArtworkMutations();

  const handleUpdateStatus = (id: number, status: string) => {
    updateStatus({ id, status });
    toast.success(`Artwork set to ${status}`);
  };

  const columns: Column<any>[] = [
    {
      header: 'Artwork File',
      cell: (art) => (
        <div className="flex items-center gap-3">
          {art.file_path ? (
            <img src={art.file_path} alt="Uploaded Artwork" className="size-10 rounded-xl object-cover border border-border/40" />
          ) : (
            <div className="size-10 rounded-xl bg-surface border border-border/40 flex items-center justify-center">
              <ImageIcon className="size-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <span className="font-semibold text-foreground">{art.file_name || `Artwork #${art.id}`}</span>
            <p className="text-[10px] text-muted-foreground">{art.user?.name || 'Customer'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Print Method',
      cell: (art) => <span className="capitalize text-muted-foreground font-semibold">{art.printing_method?.name || 'Standard DTG'}</span>,
    },
    {
      header: 'Status',
      cell: (art) => <AdminStatusBadge status={art.status || 'pending'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (art) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleUpdateStatus(art.id, 'approved')}
            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
            title="Approve Artwork"
          >
            <CheckCircle className="size-4" />
          </button>
          <button
            onClick={() => handleUpdateStatus(art.id, 'rejected')}
            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
            title="Reject Artwork"
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
        title="Uploaded Customer Artworks & Vector Files"
        description="Inspect high-resolution customer artwork uploads, check DPI requirements, and approve for production printing."
      />

      <AdminTable columns={columns} data={artworks} isLoading={isLoading} emptyText="No artwork uploads pending review." />
    </div>
  );
}
