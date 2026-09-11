import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useAuthContext } from '@/stores/auth.store';
import {
  LayoutDashboard,
  Package,
  Layers,
  Grid,
  Tag,
  Palette,
  Ruler,
  Boxes,
  ShoppingBag,
  CreditCard,
  Truck,
  FileText,
  Users,
  Star,
  LifeBuoy,
  Printer,
  SlidersHorizontal,
  FolderKanban,
  Image as ImageIcon,
  Ticket,
  FileCode,
  Newspaper,
  HelpCircle,
  UserCheck,
  ShieldCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Factory,
  BookOpen,
  Cpu,
} from 'lucide-react';

interface SidebarNavGroup {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const navGroups: SidebarNavGroup[] = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'COMMERCE',
    items: [
      { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
      { label: 'Payments', href: '/admin/payments', icon: CreditCard },
      { label: 'Customers', href: '/admin/customers', icon: Users },
    ],
  },
  {
    title: 'CATALOG',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: Layers },
      { label: 'Brands', href: '/admin/brands', icon: Tag },
      { label: 'Collections', href: '/admin/collections', icon: Grid },
      { label: 'Variants', href: '/admin/variants', icon: Boxes },
      { label: 'Sizes', href: '/admin/sizes', icon: Ruler },
      { label: 'Colors', href: '/admin/colors', icon: Palette },
      { label: 'Materials', href: '/admin/materials', icon: FolderKanban },
    ],
  },
  {
    title: 'CATALOG FILTERS',
    items: [
      { label: 'All Products', href: '/admin/catalog', icon: Package },
      { label: 'College Merchandise', href: '/admin/catalog?category=1', icon: Sparkles },
      { label: 'Merchandise', href: '/admin/catalog?category=2', icon: ShoppingBag },
      { label: 'Books', href: '/admin/catalog?category=3', icon: BookOpen },
      { label: 'Electronics', href: '/admin/catalog?category=4', icon: Cpu },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Production', href: '/admin/production', icon: Factory },
      { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
      { label: 'Shipments', href: '/admin/shipments', icon: Truck },
      { label: 'Suppliers', href: '/admin/inventory/suppliers', icon: Truck },
      { label: 'Purchase Orders', href: '/admin/inventory/purchase-orders', icon: FileText },
      { label: 'Invoices', href: '/admin/invoices', icon: FileText },
    ],
  },
  {
    title: 'PROMOTIONS',
    items: [
      { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
      { label: 'Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'CUSTOMIZATION',
    items: [
      { label: 'Printing Methods', href: '/admin/customization/printing-methods', icon: Printer },
      { label: 'Options', href: '/admin/customization/options', icon: SlidersHorizontal },
      { label: 'Artwork Uploads', href: '/admin/customization/artworks', icon: ImageIcon },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Admin Users', href: '/admin/admin-users', icon: UserCheck },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: ShieldCheck },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: History },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuthContext();

  const isNavActive = (href: string) => {
    if (href === '/admin/dashboard') {
      return pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`flex flex-col border-r border-border/40 bg-background/95 backdrop-blur-md transition-all duration-300 ${
        isMobileDrawer
          ? 'w-72 h-full'
          : isCollapsed
          ? 'w-16 h-screen sticky top-0'
          : 'w-64 h-screen sticky top-0'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/40 px-4">
        <Link
          to="/admin/dashboard"
          onClick={onCloseMobileDrawer}
          className="flex items-center gap-2.5 overflow-hidden"
        >
          <img
            src="/favicon.png"
            alt="Xeno Craft"
            className="size-8 shrink-0 rounded-lg object-contain drop-shadow-[0_0_8px_rgba(94,240,70,0.4)]"
          />
          {(!isCollapsed || isMobileDrawer) && (
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-wider text-foreground uppercase">
                Xeno Craft
              </span>
              <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                <Sparkles className="size-2.5" /> Operations Console
              </span>
            </div>
          )}
        </Link>

        {!isMobileDrawer && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface border border-border/40 transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {(!isCollapsed || isMobileDrawer) && (
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase">
                {group.title}
              </h3>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href as any}
                    onClick={onCloseMobileDrawer}
                    title={isCollapsed && !isMobileDrawer ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                    } ${isCollapsed && !isMobileDrawer ? 'justify-center px-2' : ''}`}
                  >
                    <Icon className={`size-4 shrink-0 ${active ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    {(!isCollapsed || isMobileDrawer) && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border/40 p-3 bg-surface/30">
        <div className={`flex items-center ${isCollapsed && !isMobileDrawer ? 'justify-center' : 'justify-between'} gap-2`}>
          {(!isCollapsed || isMobileDrawer) && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex flex-col overflow-hidden text-xs">
                <span className="font-semibold text-foreground truncate">{user?.name || 'Admin'}</span>
                <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => logout()}
            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Logout"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
