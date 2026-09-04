import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/stores/auth.store';
import { useSupportTickets, useSupportTicket } from '@/hooks/useSupport';
import { supportApi } from '@/api/support.api';
import { useEffect, useState } from 'react';
import { MessageSquare, Plus, ArrowLeft, Send, X, Paperclip, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageContainer } from '@/components/ui';
import { StatusBadge } from '@/components/data-display/StatusBadge';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Skeleton } from '@/components/feedback/Skeleton';
import { toast } from 'sonner';

export const Route = createFileRoute("/support")({
  component: SupportComponent,
});

function SupportComponent() {
  const { status, initialized } = useAuthStore();
  const navigate = useNavigate();
  const { tickets, isLoading, isError, error, refetch, createTicket, isCreating, reply, isReplying, closeTicket, isClosing } = useSupportTickets({ page: 1, per_page: 10 });
  
  const [activeTicketId, setActiveTicketId] = useState<number | null>(null);
  const [activeTicket, setActiveTicket] = useState<any>(null);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketOrderId, setNewTicketOrderId] = useState('');
  const [newTicketPriority, setNewTicketPriority] = useState('normal');
  const [replyMessage, setReplyMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (initialized && status === 'unauthenticated') {
      navigate({ to: '/login' });
    }
  }, [initialized, status, navigate]);

  const loadTicket = async (ticketId: number) => {
    setActiveTicketId(ticketId);
    try {
      const res = await supportApi.getTicket(ticketId);
      if (res.success && res.data?.ticket) {
        setActiveTicket(res.data.ticket);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load ticket details');
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: { subject: string; description: string; order_id?: number; priority?: string } = {
      subject: newTicketSubject,
      description: newTicketDescription,
      priority: newTicketPriority,
    };
    if (newTicketOrderId) {
      payload.order_id = parseInt(newTicketOrderId);
    }
    createTicket(payload, {
      onSuccess: () => {
        setShowCreateModal(false);
        setNewTicketSubject('');
        setNewTicketDescription('');
        setNewTicketOrderId('');
        setNewTicketPriority('normal');
        toast.success('Support ticket created');
      },
    });
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicketId || !replyMessage.trim()) return;
    reply({
      ticketId: activeTicketId,
      message: replyMessage,
    }, {
      onSuccess: () => {
        setReplyMessage('');
        toast.success('Reply sent');
        loadTicket(activeTicketId);
      },
    });
  };

  const handleClose = () => {
    if (!activeTicketId) return;
    closeTicket(activeTicketId, {
      onSuccess: () => {
        setActiveTicket(null);
        setActiveTicketId(null);
        toast.success('Ticket closed');
      },
    });
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'urgent': return 'Urgent';
      case 'high': return 'High';
      case 'low': return 'Low';
      default: return 'Normal';
    }
  };

  if (status === 'loading' || !initialized) {
    return (
      <PageContainer breadcrumbs={[{ label: "Home", to: "/" }, { label: "Account", to: "/account" }, { label: "Support" }]}>
        <div className="space-y-4 text-center py-12">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-xs font-semibold text-muted-foreground">Loading support...</p>
        </div>
      </PageContainer>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Main render
  return (
    <PageContainer
      breadcrumbs={[
        { label: "Home", to: "/" },
        { label: "Account", to: "/account" },
        { label: "Support" }
      ]}
      title="Support Center"
      description="View and manage your support conversations with our dedicated merchandise team"
      actions={
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="size-3.5" /> New Ticket
        </button>
      }
    >

      {activeTicketId && activeTicket && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setActiveTicketId(null); setActiveTicket(null); }}
                className="p-2 rounded-xl border border-border/40 bg-background text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                <ArrowLeft className="size-4" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{activeTicket.subject}</h2>
                <p className="text-xs text-muted-foreground">Created {new Date(activeTicket.created_at).toLocaleDateString('en-IN')} • {getPriorityLabel(activeTicket.priority)} priority</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={activeTicket.status} />
              {activeTicket.status !== 'closed' && (
                <button
                  onClick={handleClose}
                  disabled={isClosing}
                  className="rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20"
                >
                  Close Ticket
                </button>
              )}
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-6">
            {/* Initial message */}
            <div className="p-4 rounded-xl border border-border/40 bg-surface/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span className="font-medium text-foreground">{activeTicket.user?.name || 'You'}</span>
                <span>•</span>
                <span>{new Date(activeTicket.created_at).toLocaleDateString('en-IN')}</span>
              </div>
              <p className="text-foreground whitespace-pre-wrap">{activeTicket.description}</p>
            </div>

            {/* Messages */}
            {activeTicket.messages?.map((msg: any) => (
              <div key={msg.id} className="p-4 rounded-xl border border-border/40 bg-surface/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className={msg.is_staff ? 'font-medium text-primary' : 'font-medium text-foreground'}>
                    {msg.user?.name || (msg.is_staff ? 'Support Team' : 'You')}
                  </span>
                  <span>•</span>
                  <span>{new Date(msg.created_at).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}

            {/* Reply form */}
            <div className="border-t border-border/40 pt-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Reply</h3>
              <form onSubmit={handleReply} className="flex gap-3">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  disabled={isReplying}
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyMessage.trim()}
                  className="rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {!activeTicketId && (
        <>
          {isLoading ? (
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((i) => <Skeleton key={i} variant="rectangular" width="100%" height="100px" />)}
            </div>
          ) : isError ? (
            <EmptyState
              icon="alert"
              title="Failed to load tickets"
              description={error?.message || "Please try again"}
              action={{ label: "Retry", onClick: () => refetch() }}
            />
          ) : tickets.length === 0 ? (
            <EmptyState
              icon="messages"
              title="No support tickets yet"
              description="Create a ticket if you need help with an order or have questions"
              action={{ label: "Create Ticket", onClick: () => setShowCreateModal(true) }}
            />
          ) : (
            <div className="mt-8 space-y-4">
              {tickets.map((ticket: any) => (
                <button
                  key={ticket.id}
                  onClick={() => loadTicket(ticket.id)}
                  className="w-full glass-panel rounded-3xl p-6 border border-border/40 text-left hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{ticket.subject}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{ticket.description?.substring(0, 100)}...</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Created {new Date(ticket.created_at).toLocaleDateString('en-IN')}</span>
                        <span>•</span>
                        <span>{getPriorityLabel(ticket.priority)} priority</span>
                      </div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Create Ticket Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
              <div className="bg-background rounded-3xl border border-border/40 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur-sm rounded-t-3xl z-10">
                  <h2 className="text-lg font-semibold text-foreground">Create Support Ticket</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateTicket} className="p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Subject</label>
                    <input
                      type="text"
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      placeholder="Brief summary of your issue"
                      required
                      className="w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">Description</label>
                    <textarea
                      value={newTicketDescription}
                      onChange={(e) => setNewTicketDescription(e.target.value)}
                      placeholder="Describe your issue in detail..."
                      rows={5}
                      required
                      className="w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Related Order ID (optional)</label>
                      <input
                        type="number"
                        value={newTicketOrderId}
                        onChange={(e) => setNewTicketOrderId(e.target.value)}
                        placeholder="Order ID"
                        className="w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1.5">Priority</label>
                      <select
                        value={newTicketPriority}
                        onChange={(e) => setNewTicketPriority(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background/50 px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="rounded-xl border border-border/40 bg-surface px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-surface/80"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isCreating ? 'Creating...' : 'Create Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}

function getPriorityLabel(p: string) {
  switch (p) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'low': return 'Low';
    default: return 'Normal';
  }
}