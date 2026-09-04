import React from 'react';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'neutral' | string;

interface AdminStatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({ status, label, className = '' }) => {
  const normalized = (status || 'neutral').toLowerCase();
  
  let variantClasses = 'bg-surface text-muted-foreground border-border/40';

  if (['success', 'active', 'delivered', 'completed', 'paid', 'approved', 'published', 'in_stock'].includes(normalized)) {
    variantClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  } else if (['warning', 'pending', 'processing', 'in_production', 'low_stock', 'under_review'].includes(normalized)) {
    variantClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (['error', 'failed', 'cancelled', 'rejected', 'out_of_stock', 'suspended', 'archived', 'overdue'].includes(normalized)) {
    variantClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  } else if (['info', 'shipped', 'in_transit', 'open', 'draft'].includes(normalized)) {
    variantClasses = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
  }

  const displayText = label || status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-wide ${variantClasses} ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {displayText}
    </span>
  );
};
