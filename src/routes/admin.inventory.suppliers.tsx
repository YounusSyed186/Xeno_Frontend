import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminSuppliers, useAdminInventoryMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { Plus, Edit, Trash2, Search, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/inventory/suppliers')({
  component: AdminSuppliersComponent,
});

function AdminSuppliersComponent() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [isActive, setIsActive] = useState(true);

  const { data, isLoading } = useAdminSuppliers({
    search: search || undefined,
    page,
    per_page: pageSize,
  });

  const { createSupplier, updateSupplier } = useAdminInventoryMutations();

  const suppliers = (data as any)?.suppliers || (data as any)?.items || [];
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

  const handleOpenCreate = () => {
    setEditingId(null);
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setPaymentTerms('');
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (supplier: any) => {
    setEditingId(supplier.id);
    setName(supplier.name);
    setContactName(supplier.contact_name || '');
    setEmail(supplier.email || '');
    setPhone(supplier.phone || '');
    setAddress(supplier.address || '');
    setPaymentTerms(supplier.payment_terms || '');
    setIsActive(supplier.is_active !== false);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      contact_name: contactName,
      email,
      phone,
      address,
      payment_terms: paymentTerms,
      is_active: isActive,
    };
    if (editingId) {
      updateSupplier({ id: editingId, payload });
      toast.success('Supplier updated');
    } else {
      createSupplier(payload);
      toast.success('Supplier created');
    }
    setShowModal(false);
  };

  const columns: Column<any>[] = [
    {
      header: 'Supplier',
      cell: (s) => (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Building2 className="size-4" />
          </div>
          <div>
            <p className="font-bold text-foreground">{s.name}</p>
            <p className="text-[10px] text-muted-foreground">{s.contact_name || 'No contact person'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      cell: (s) => (
        <div className="space-y-1 text-xs">
          {s.email && <div className="flex items-center gap-1 text-muted-foreground"><Mail className="size-3" /><span>{s.email}</span></div>}
          {s.phone && <div className="flex items-center gap-1 text-muted-foreground"><Phone className="size-3" /><span>{s.phone}</span></div>}
          {s.address && <div className="flex items-center gap-1 text-muted-foreground"><MapPin className="size-3" /><span className="truncate max-w-xs">{s.address}</span></div>}
        </div>
      ),
    },
    {
      header: 'Payment Terms',
      cell: (s) => <span className="text-xs text-muted-foreground font-mono">{s.payment_terms || '—'}</span>,
    },
    {
      header: 'Status',
      cell: (s) => (
        <span className={`px-2 py-0.5 text-[10px] rounded-full ${s.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {s.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (s) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(s)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
            title="Edit Supplier"
          >
            <Edit className="size-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this supplier?')) {
                // No delete mutation available yet
                toast.error('Delete not implemented');
              }
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Delete Supplier"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Suppliers"
        description="Manage supplier accounts, contact information, and payment terms."
        actions={
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="size-4" /> Add Supplier
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border/40 bg-surface/40 pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={suppliers}
        isLoading={isLoading}
        pagination={pagination}
        emptyText="No suppliers found."
        showSearch={false}
      />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 border border-border/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-foreground">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cotton Mills India Ltd"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <input
                    type="email"
                    placeholder="procurement@supplier.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Address</label>
                <textarea
                  rows={3}
                  placeholder="Complete address for purchase orders"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Payment Terms</label>
                <input
                  type="text"
                  placeholder="e.g. Net 30, Net 45, COD"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full rounded-xl border border-border/40 bg-surface/60 px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary"
                  />
                  Active Supplier
                </label>
              </div>

              <div className="pt-4 border-t border-border/40 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border/40 bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="size-4" /> {editingId ? 'Update Supplier' : 'Create Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}