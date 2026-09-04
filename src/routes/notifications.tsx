import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useNotifications, useUnreadNotificationCount } from '@/hooks/useNotifications';
import { useEffect } from 'react';
import { Bell, Mail, Check, X, Shield, Truck, Package, CreditCard, Info } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/feedback/Skeleton';

export const Route = createFileRoute("/notifications")({
  component: NotificationsComponent,
});

function NotificationsComponent() {
  const { status, initialized } = useAuthStore();
  const navigate = useNavigate();
  const { notifications, isLoading, isError, error, refetch, markAsRead, isMarkingRead, markAllAsRead, isMarkingAllRead } = useNotifications({ page: 1, per_page: 20 });
  const { data: unreadCount } = useUnreadNotificationCount();

  useEffect(() => {
    if (initialized && status === 'unauthenticated') {
      navigate({ to: '/login' });
    }
  }, [initialized, status, navigate]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_created': return <Package className="size-4 text-primary" />;
      case 'order_confirmed': return <Check className="size-4 text-green-500" />;
      case 'order_shipped': return <Truck className="size-4 text-blue-500" />;
      case 'order_delivered': return <Package className="size-4 text-green-500" />;
      case 'order_cancelled': return <X className="size-4 text-red-500" />;
      case 'payment_received': return <CreditCard className="size-4 text-primary" />;
      case 'payment_failed': return <X className="size-4 text-red-500" />;
      case 'invoice_generated': return <Mail className="size-4 text-blue-500" />;
      case 'ticket_reply': return <Mail className="size-4 text-purple-500" />;
      default: return <Info className="size-4 text-sky-500" />;
    }
  };

  const formatType = (type: string) => type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (status === 'loading' || !initialized) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Notifications" }]}>
        <div className="space-y-4 text-center py-12">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs font-semibold text-muted-foreground">Loading notifications...</p>
        </div>
      </PageContainer>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Account", to: "/account" },
        { label: "Notifications" }
      ]}
      title="Notifications"
      description={`${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`}
      actions={
        (unreadCount ?? 0) > 0 ? (
          <button
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllRead}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
          >
            <Check className="size-3.5" /> Mark all as read
          </button>
        ) : undefined
      }
    >

      {isLoading ? (
        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} variant="rectangular" width="100%" height="80px" />)}
        </div>
      ) : isError ? (
        <EmptyState
          icon="alert"
          title="Failed to load notifications"
          description={error?.message || "Please try again"}
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="No notifications"
          description="You're all caught up!"
        />
      ) : (
        <div className="mt-8 space-y-3">
          {notifications.map((notification: any) => (
            <button
              key={notification.id}
              onClick={() => !notification.read_at && markAsRead(notification.id)}
              className={`w-full glass-panel rounded-2xl p-4 border border-border/40 text-left transition-colors ${!notification.read_at ? 'border-primary/20 bg-primary/5' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${!notification.read_at ? 'bg-primary/10 text-primary' : 'bg-surface text-muted-foreground'}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={`font-semibold text-foreground ${!notification.read_at ? '' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(notification.created_at).toLocaleDateString('en-IN', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {!notification.read_at && (
                        <StatusBadge status="info" label="New" className="text-[10px]" />
                      )}
                    </div>
                  </div>
                  {notification.data && Object.keys(notification.data).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      {Object.entries(notification.data).map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span>{k.replace('_', ' ')}:</span>
                          <span className="font-medium text-foreground">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </PageContainer>
  );
}