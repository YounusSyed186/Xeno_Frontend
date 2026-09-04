import React, { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useAdminSupportTicket, useAdminSupportMutations } from '@/hooks/useAdmin';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { ArrowLeft, Send, Loader2, LifeBuoy, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/support/$id')({
  component: AdminSupportDetailComponent,
});

function AdminSupportDetailComponent() {
  const { id } = useParams({ from: '/admin/support/$id' });
  const navigate = useNavigate();
  const ticketId = Number(id);

  const { data: ticket, isLoading, error } = useAdminSupportTicket(ticketId);
  const { reply, close } = useAdminSupportMutations();

  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSending(true);
    reply({ id: ticketId, message: replyText });
    toast.success('Reply sent to customer!');
    setReplyText('');
    setIsSending(false);
  };

  const handleCloseTicket = () => {
    close(ticketId);
    toast.success('Ticket closed');
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground">
        Support ticket not found.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <AdminPageHeader
        title={`Ticket ${ticket.ticket_number}: ${ticket.subject}`}
        description={`Opened by ${ticket.user?.name || 'Customer'} on ${new Date(ticket.created_at).toLocaleString()}`}
        actions={
          <div className="flex items-center gap-2">
            <AdminStatusBadge status={ticket.status || 'open'} />
            <button
              onClick={handleCloseTicket}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/20"
            >
              <CheckCircle className="size-3.5" /> Close Ticket
            </button>
            <button
              onClick={() => navigate({ to: '/admin/support' })}
              className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Inbox
            </button>
          </div>
        }
      />

      {/* Message Thread */}
      <div className="space-y-4">
        <div className="glass-panel rounded-3xl p-6 border border-border/40 space-y-4">
          <h2 className="text-xs font-bold text-foreground uppercase tracking-wider text-muted-foreground">
            Message Thread
          </h2>

          <div className="space-y-3">
            {ticket.messages?.map((msg: any) => (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border text-xs space-y-1 ${
                  msg.is_admin
                    ? 'bg-primary/10 border-primary/30 text-foreground ml-6'
                    : 'bg-surface/60 border-border/40 text-foreground mr-6'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <User className="size-3 text-primary" /> {msg.sender?.name || (msg.is_admin ? 'Support Agent' : 'Customer')}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="leading-relaxed pt-1 whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Box */}
        <form onSubmit={handleSendReply} className="glass-panel rounded-3xl p-6 border border-border/40 space-y-3">
          <label className="text-xs font-bold text-foreground">Reply to Customer</label>
          <textarea
            rows={4}
            required
            placeholder="Type your official administrative response..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full rounded-2xl border border-border/40 bg-surface/60 p-3 text-xs text-foreground focus:outline-none focus:border-primary"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="size-3.5" /> Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
