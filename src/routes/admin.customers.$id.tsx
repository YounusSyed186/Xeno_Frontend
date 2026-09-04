import React, { useEffect } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useAdminUser, useAdminUserMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { ArrowLeft, Loader2, User, Mail, Phone, MapPin, ShoppingBag, ShieldAlert, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/customers/$id')({
  component: AdminCustomerDetailComponent,
});

function AdminCustomerDetailComponent() {
  const { id } = useParams({ from: '/admin/customers/$id' });
  const navigate = useNavigate();
  const userId = Number(id);

  const { data: customer, isLoading, error } = useAdminUser(userId);
  const { suspend, activate } = useAdminUserMutations();

  const handleToggleStatus = () => {
    if (!customer) return;
    if (customer.status === 'active') {
      suspend(userId);
      toast.success('Customer account suspended');
    } else {
      activate(userId);
      toast.success('Customer account activated');
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground">
        Customer profile not found.
      </div>
    );
  }

  const orderColumns: Column<any>[] = [
    {
      header: 'Order Reference',
      cell: (o) => <span className="font-mono font-bold text-foreground">{o.order_number}</span>,
    },
    {
      header: 'Date',
      cell: (o) => <span className="text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span>,
    },
    {
      header: 'Total Amount',
      cell: (o) => <span className="font-mono font-bold text-foreground">₹{Number(o.total_amount || o.total || 0).toLocaleString()}</span>,
    },
    {
      header: 'Status',
      cell: (o) => <AdminStatusBadge status={o.status} />,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminPageHeader
        title={`Customer Profile: ${customer.name}`}
        description={`Registered user since ${new Date(customer.created_at).toLocaleDateString()}`}
        actions={
          <div className="flex items-center gap-2">
            <AdminStatusBadge status={customer.status || 'active'} />
            <button
              onClick={() => navigate({ to: '/admin/customers' })}
              className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Back to Directory
            </button>
          </div>
        }
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-4 sm:col-span-1">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
            Identity & Contact
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <User className="size-4 text-primary shrink-0" />
              <span className="font-semibold text-foreground">{customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground font-mono">{customer.phone || 'No phone'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/40">
            <button
              onClick={handleToggleStatus}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                customer.status === 'active'
                  ? 'border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
              }`}
            >
              {customer.status === 'active' ? (
                <>
                  <ShieldAlert className="size-3.5" /> Suspend Customer Account
                </>
              ) : (
                <>
                  <CheckCircle className="size-3.5" /> Activate Customer Account
                </>
              )}
            </button>
          </div>
        </div>

        {/* Customer Order History */}
        <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-4 sm:col-span-2">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="size-4 text-primary" /> Order History ({customer.orders?.length || 0})
          </h2>

          <AdminTable
            columns={orderColumns}
            data={customer.orders || []}
            isLoading={false}
            emptyText="Customer has not placed any orders yet."
          />
        </div>
      </div>
    </div>
  );
}
