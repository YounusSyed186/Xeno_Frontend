import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthContext } from '@/stores/auth.store';
import { useAdminDashboard, useAdminOrders, useAdminProducts, useAdminAnalytics } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import {
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  LifeBuoy,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboardComponent,
});

function AdminDashboardComponent() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const { data: metrics, isLoading: isMetricsLoading, refetch } = useAdminDashboard();
  const { data: analytics } = useAdminAnalytics('30d');
  const { data: ordersData, isLoading: isOrdersLoading } = useAdminOrders({ per_page: 5 });
  const { data: productsData } = useAdminProducts({ per_page: 5 });

  const recentOrders = ordersData?.items || [];
  const lowStockCount = (metrics as any)?.low_stock_products || (metrics as any)?.low_stock_count || 0;

  const revenueChartData = (analytics as any)?.revenue_by_day?.map((d: any) => ({
    date: d.date,
    revenue: Number(d.revenue || 0),
  })) || [];

  const ordersByStatus = (analytics as any)?.orders_by_status || {};
  const ordersStatusData = Object.entries(ordersByStatus).map(([status, count]) => ({
    status,
    count: Number(count || 0),
  }));

  const topProducts = (analytics as any)?.top_products?.slice(0, 5) || [];

  const handleDrillDown = (path: string) => {
    navigate({ to: path as any });
  };

  const orderColumns: Column<any>[] = [
    {
      header: 'Order Number',
      cell: (order) => (
        <span className="font-semibold text-foreground">{order.order_number}</span>
      ),
    },
    {
      header: 'Customer',
      cell: (order) => (
        <div>
          <p className="font-medium text-foreground">{order.user?.name || 'Guest'}</p>
          <p className="text-[10px] text-muted-foreground">{order.user?.email}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: (order) => (
        <span className="font-mono font-medium text-foreground">
          ₹{Number(order.total_amount || order.total || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (order) => <AdminStatusBadge status={order.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (order) => (
        <button
          onClick={() => navigate({ to: `/admin/orders/${order.id}` as any })}
          className="p-1 text-muted-foreground hover:text-primary transition-colors"
          title="View Details"
        >
          <ArrowUpRight className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Good morning, ${user?.name || 'Admin'}`}
        description="Overview of store operations, revenue metrics, orders, and stock alerts."
        actions={
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </button>
        }
      />

      {/* KPI Cards with Drill-down */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className="glass-panel rounded-3xl p-6 border border-border/40 relative overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => handleDrillDown('/admin/analytics')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
            <div className="size-8 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-foreground">
            ₹{Number(metrics?.total_revenue || 0).toLocaleString()}
          </h3>
          <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
            <TrendingUp className="size-3 text-emerald-400" /> Operational lifetime total
            <ExternalLink className="size-3 ml-1 opacity-50" />
          </p>
        </div>

        <div
          className="glass-panel rounded-3xl p-6 border border-border/40 relative overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => handleDrillDown('/admin/orders')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Orders</span>
            <div className="size-8 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <ShoppingBag className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-foreground">
            {metrics?.total_orders || 0}
          </h3>
          <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
            Completed & active orders
            <ExternalLink className="size-3 ml-1 opacity-50" />
          </p>
        </div>

        <div
          className="glass-panel rounded-3xl p-6 border border-border/40 relative overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => handleDrillDown('/admin/users')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Customers</span>
            <div className="size-8 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-foreground">
            {metrics?.total_customers || 0}
          </h3>
          <p className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
            Registered platform users
            <ExternalLink className="size-3 ml-1 opacity-50" />
          </p>
        </div>

        <div
          className="glass-panel rounded-3xl p-6 border border-border/40 relative overflow-hidden cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => handleDrillDown('/admin/inventory?low_stock=true')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Low Stock Warnings</span>
            <div className="size-8 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-foreground">
            {lowStockCount}
          </h3>
          <p className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
            Products requiring restock
            <ExternalLink className="size-3 ml-1 opacity-50" />
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="glass-panel rounded-3xl p-6 border border-border/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Revenue Trend (30 days)</h2>
            <button
              onClick={() => handleDrillDown('/admin/analytics')}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View details <ExternalLink className="size-3" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
                  labelFormatter={(v) => new Date(v).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="glass-panel rounded-3xl p-6 border border-border/40">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Orders by Status</h2>
            <button
              onClick={() => handleDrillDown('/admin/orders')}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ExternalLink className="size-3" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersStatusData} layout="vertical" margin={{ top: 10, right: 20, bottom: 0, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <YAxis
                  type="category"
                  dataKey="status"
                  width={80}
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(v: string) => v.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(v: number) => [v, 'Orders']}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#3b82f6">
                  {ordersStatusData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Top Selling Products</h2>
            <button
              onClick={() => handleDrillDown('/admin/products')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View all <ExternalLink className="size-3" />
            </button>
          </div>
          <div className="glass-panel rounded-3xl p-4 border border-border/40 space-y-3 max-h-96 overflow-y-auto">
            {topProducts.length > 0 ? (
              topProducts.map((product: any, idx: number) => (
                <div key={product.id ?? idx} className="flex items-center gap-3 p-2 hover:bg-surface/50 rounded-xl transition-colors cursor-pointer" onClick={() => handleDrillDown(`/admin/products/${product.id}`)}>
                  <span className="text-xs font-bold text-muted-foreground w-6 text-center">#{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">{product.orders_count || product.sold_count || 0} sold</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No sales data available</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Recent Orders</h2>
            <button
              onClick={() => navigate({ to: '/admin/orders' })}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View all orders <ExternalLink className="size-3" />
            </button>
          </div>
          <AdminTable
            columns={orderColumns}
            data={recentOrders}
            isLoading={isOrdersLoading}
            emptyText="No recent orders."
          />
        </div>
      </div>

      {/* Quick Operational Tasks */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-sm font-bold text-foreground">Quick Actions</h2>
          <div className="glass-panel rounded-3xl p-6 border border-border/40 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <button
              onClick={() => navigate({ to: '/admin/products/create' })}
              className="col-span-1 rounded-xl bg-primary px-4 py-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors flex flex-col items-center gap-1"
            >
              <Package className="size-5" />
              <span>Add Product</span>
            </button>
            <button
              onClick={() => navigate({ to: '/admin/inventory' })}
              className="col-span-1 rounded-xl border border-border/40 bg-surface px-4 py-4 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors flex flex-col items-center gap-1"
            >
              <Package className="size-5" />
              <span>Manage Inventory</span>
            </button>
            <button
              onClick={() => navigate({ to: '/admin/orders', search: { status: 'pending_payment' } })}
              className="col-span-1 rounded-xl border border-border/40 bg-surface px-4 py-4 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors flex flex-col items-center gap-1"
            >
              <ShoppingBag className="size-5" />
              <span>Pending Orders</span>
            </button>
            <button
              onClick={() => navigate({ to: '/admin/production' })}
              className="col-span-1 rounded-xl border border-border/40 bg-surface px-4 py-4 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors flex flex-col items-center gap-1"
            >
              <Package className="size-5" />
              <span>Production Queue</span>
            </button>
            <button
              onClick={() => navigate({ to: '/admin/shipments' })}
              className="col-span-1 rounded-xl border border-border/40 bg-surface px-4 py-4 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors flex flex-col items-center gap-1"
            >
              <Package className="size-5" />
              <span>Shipments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
