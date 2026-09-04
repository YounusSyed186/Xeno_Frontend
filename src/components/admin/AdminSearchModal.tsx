import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Loader2, Package, ShoppingBag, User, Ticket, Tag, X } from 'lucide-react';
import { useAdminSearch } from '@/hooks/useAdmin';

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSearchModal: React.FC<AdminSearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data, isLoading } = useAdminSearch(searchTerm);

  if (!isOpen) return null;

  const handleSelectResult = (path: string) => {
    onClose();
    navigate({ to: path as any });
  };

  const hasResults =
    data &&
    (data.orders?.length ||
      data.products?.length ||
      data.customers?.length ||
      data.coupons?.length ||
      data.tickets?.length);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-border/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 border-b border-border/40 px-4 py-3 bg-surface/40">
          <Search className="size-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            placeholder="Search orders (ORD-...), products, customer email, coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {isLoading && <Loader2 className="size-4 animate-spin text-primary" />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {searchTerm.length < 2 && (
            <p className="text-xs text-center text-muted-foreground py-8">
              Type at least 2 characters to search across orders, catalog, customers, and support tickets...
            </p>
          )}

          {searchTerm.length >= 2 && !isLoading && !hasResults && (
            <p className="text-xs text-center text-muted-foreground py-8">
              No matching records found for "{searchTerm}"
            </p>
          )}

          {hasResults && (
            <div className="space-y-4 text-xs">
              {/* Orders */}
              {data?.orders && data.orders.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShoppingBag className="size-3.5 text-primary" /> Orders
                  </h4>
                  <div className="space-y-1">
                    {data.orders.map((order: any) => (
                      <button
                        key={order.id}
                        onClick={() => handleSelectResult(`/admin/orders/${order.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface/80 text-left transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-foreground">{order.order_number}</span>
                          <span className="ml-2 text-muted-foreground">({order.user?.name || 'Guest'})</span>
                        </div>
                        <span className="font-mono text-emerald-400">₹{Number(order.total_amount).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {data?.products && data.products.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Package className="size-3.5 text-primary" /> Products
                  </h4>
                  <div className="space-y-1">
                    {data.products.map((product: any) => (
                      <button
                        key={product.id}
                        onClick={() => handleSelectResult(`/admin/products/${product.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface/80 text-left transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-foreground">{product.name}</span>
                          <span className="ml-2 font-mono text-muted-foreground">SKU: {product.sku}</span>
                        </div>
                        <span className="font-mono text-foreground">₹{Number(product.base_price).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers */}
              {data?.customers && data.customers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="size-3.5 text-primary" /> Customers
                  </h4>
                  <div className="space-y-1">
                    {data.customers.map((cust: any) => (
                      <button
                        key={cust.id}
                        onClick={() => handleSelectResult(`/admin/customers/${cust.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface/80 text-left transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-foreground">{cust.name}</span>
                          <span className="ml-2 text-muted-foreground">{cust.email}</span>
                        </div>
                        <span className="capitalize text-muted-foreground">{cust.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Coupons */}
              {data?.coupons && data.coupons.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" /> Coupons
                  </h4>
                  <div className="space-y-1">
                    {data.coupons.map((coupon: any) => (
                      <button
                        key={coupon.id}
                        onClick={() => handleSelectResult(`/admin/coupons`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface/80 text-left transition-colors"
                      >
                        <span className="font-mono font-bold text-primary">{coupon.code}</span>
                        <span className="text-muted-foreground">{coupon.discount_value}% off</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Support Tickets */}
              {data?.tickets && data.tickets.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Ticket className="size-3.5 text-primary" /> Support Tickets
                  </h4>
                  <div className="space-y-1">
                    {data.tickets.map((ticket: any) => (
                      <button
                        key={ticket.id}
                        onClick={() => handleSelectResult(`/admin/support/${ticket.id}`)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-surface/80 text-left transition-colors"
                      >
                        <div>
                          <span className="font-semibold text-foreground">{ticket.ticket_number}</span>
                          <span className="ml-2 text-muted-foreground">{ticket.subject}</span>
                        </div>
                        <span className="capitalize text-amber-400">{ticket.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
