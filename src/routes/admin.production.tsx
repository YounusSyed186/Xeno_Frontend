import { useState } from 'react';
import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useAdminProduction, useAdminProductionMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminTable, Column } from '@/components/admin/AdminTable';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { ArrowRight, RefreshCw, ChevronRight, Loader2, Truck, PackageCheck, Eye, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/production')({
  component: AdminProductionComponent,
});

const PRODUCTION_STAGES = [
  { key: 'artwork_review', label: 'Artwork Review', icon: '🎨' },
  { key: 'artwork_approved', label: 'Artwork Approved', icon: '✅' },
  { key: 'production', label: 'In Production', icon: '🏭' },
  { key: 'quality_control', label: 'Quality Control', icon: '🔍' },
  { key: 'packed', label: 'Packed', icon: '📦' },
  { key: 'dispatched', label: 'Dispatched', icon: '🚚' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
] as const;

function AdminProductionComponent() {
  const { data: productionData, isLoading, refetch } = useAdminProduction();
  const { data: pipelineData } = useAdminProduction({ stage: 'pipeline' });
  const { advance, setStage } = useAdminProductionMutations();

  const orders = productionData?.items || productionData?.production_orders || [];
  const pipeline = pipelineData?.pipeline || pipelineData?.items || [];

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleAdvance = (orderId: number, currentStage: string) => {
    const currentIndex = PRODUCTION_STAGES.findIndex(s => s.key === currentStage);
    const nextStage = PRODUCTION_STAGES[currentIndex + 1];
    if (currentIndex >= 0 && nextStage) {
      advance({ id: orderId, note: `Advanced to ${nextStage.label}` });
      toast.success(`Advanced to ${nextStage.label}`);
    }
  };

  const handleSetStage = (orderId: number, stage: string) => {
    setStage({ id: orderId, stage, note: `Manually set to ${stage}` });
    toast.success(`Stage set to ${stage}`);
  };

  const getCurrentStageIndex = (stage: string) => PRODUCTION_STAGES.findIndex(s => s.key === stage);

  const renderPipelineVisual = (orderStage: string) => {
    const currentIndex = getCurrentStageIndex(orderStage);
    return (
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {PRODUCTION_STAGES.map((stage, idx) => (
          <React.Fragment key={stage.key}>
            <div className={`flex flex-col items-center ${idx === currentIndex ? 'relative' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                idx < currentIndex
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : idx === currentIndex
                  ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-surface border-border/40 text-muted-foreground/40'
              }`}>
                {idx < currentIndex ? <CheckCircle className="size-4" /> : stage.icon}
              </div>
              <span className={`text-[10px] mt-1 text-center whitespace-nowrap ${idx <= currentIndex ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                {stage.label}
              </span>
            </div>
            {idx < PRODUCTION_STAGES.length - 1 && (
              <div className={`w-12 h-0.5 mx-1 ${idx < currentIndex ? 'bg-emerald-500' : 'bg-border/40'}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const columns: Column<any>[] = [
    {
      header: 'Order',
      cell: (order) => (
        <div>
          <span className="font-bold text-foreground font-mono">{order.order_number}</span>
          <p className="text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      ),
    },
    {
      header: 'Customer',
      cell: (order) => (
        <div>
          <p className="font-semibold text-foreground">{order.user?.name || 'Guest'}</p>
          <p className="text-[10px] text-muted-foreground">{order.user?.email}</p>
        </div>
      ),
    },
    {
      header: 'Pipeline',
      cell: (order) => renderPipelineVisual(order.stage || order.status),
    },
    {
      header: 'Current Stage',
      cell: (order) => {
        const stage = PRODUCTION_STAGES.find(s => s.key === (order.stage || order.status));
        return stage ? (
          <AdminStatusBadge status={stage.key} />
        ) : (
          <AdminStatusBadge status={order.stage || 'artwork_review'} />
        );
      },
    },
    {
      header: 'Items',
      cell: (order) => <span className="text-xs text-muted-foreground">{order.items_count || order.items?.length || 1} item(s)</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (order) => {
        const currentIndex = getCurrentStageIndex(order.stage || order.status);
        const isFinal = currentIndex === PRODUCTION_STAGES.length - 1;
        const canAdvance = currentIndex >= 0 && currentIndex < PRODUCTION_STAGES.length - 1;

        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
              title={expandedId === order.id ? 'Collapse' : 'Expand'}
            >
              <ChevronRight className={`size-3.5 transition-transform ${expandedId === order.id ? 'rotate-90' : ''}`} />
            </button>
            {canAdvance && (
              <button
                onClick={() => handleAdvance(order.id, order.stage || order.status)}
                className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                title="Advance to Next Stage"
              >
                <ArrowRight className="size-3.5" />
              </button>
            )}
            <button
              onClick={() => handleSetStage(order.id, 'artwork_review')}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-400 hover:bg-sky-500/10"
              title="Reset to Artwork Review"
            >
              <RefreshCw className="size-3.5" />
            </button>
            <button
              onClick={() => window.open(`/admin/orders/${order.id}`, '_blank')}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
              title="View Order"
            >
              <Eye className="size-3.5" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Production Queue"
        description="Track and advance orders through the manufacturing pipeline."
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

      {/* Pipeline Overview */}
      <div className="glass-panel rounded-3xl p-6 border border-border/40">
        <h2 className="text-sm font-bold text-foreground mb-4">Production Pipeline Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
          {PRODUCTION_STAGES.map((stage) => {
            const count = pipeline.find((p: any) => p.stage === stage.key)?.count || 0;
            return (
              <div key={stage.key} className="p-4 rounded-2xl bg-surface/50 border border-border/40 text-center">
                <div className="text-3xl font-bold text-foreground">{count}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{stage.label.replace(/_/g, ' ')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Production Orders Table */}
      <AdminTable
        columns={columns}
        data={orders}
        isLoading={isLoading}
        emptyText="No production orders found."
        showSearch={false}
      />

      {/* Expanded Detail Rows */}
      {expandedId && (
        <div className="glass-panel rounded-3xl p-6 border border-border/40 border-t-0 bg-surface/30">
          {orders.find((o: any) => o.id === expandedId) && (
            <div>
              <h3 className="text-sm font-bold text-foreground mb-4">Order Details & Stage History</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                <div className="p-3 rounded-xl bg-surface/50">
                  <p className="text-[10px] text-muted-foreground">Order</p>
                  <p className="font-mono font-bold text-foreground">{orders.find((o: any) => o.id === expandedId)?.order_number}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface/50">
                  <p className="text-[10px] text-muted-foreground">Customer</p>
                  <p className="font-semibold text-foreground">{orders.find((o: any) => o.id === expandedId)?.user?.name}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface/50">
                  <p className="text-[10px] text-muted-foreground">Total</p>
                  <p className="font-mono font-bold text-primary">₹{Number(orders.find((o: any) => o.id === expandedId)?.total_amount || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface/50">
                  <p className="text-[10px] text-muted-foreground">Current Stage</p>
                  <AdminStatusBadge status={orders.find((o: any) => o.id === expandedId)?.stage || 'artwork_review'} />
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stage History</h4>
                {orders.find((o: any) => o.id === expandedId)?.stageHistory?.map((h: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-surface/50 border border-border/30">
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground capitalize">{h.stage?.replace(/_/g, ' ') || 'Unknown'}</p>
                      <p className="text-[10px] text-muted-foreground">{h.note || 'No notes'}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{h.created_at ? new Date(h.created_at).toLocaleString() : ''}</span>
                  </div>
                ))}
              </div>

              {/* Manual Stage Selector */}
              <div className="pt-4 border-t border-border/20">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Set Stage Manually</h4>
                <div className="flex flex-wrap gap-2">
                  {PRODUCTION_STAGES.map((stage) => (
                    <button
                      key={stage.key}
                      onClick={() => handleSetStage(expandedId, stage.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                        (orders.find((o: any) => o.id === expandedId)?.stage === stage.key)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface border border-border/40 text-muted-foreground hover:bg-surface hover:text-foreground'
                      }`}
                    >
                      {stage.icon} {stage.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}