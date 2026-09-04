import React from 'react';
import { Inbox, Package, Users, MessageSquare, Star, Search, ShoppingBag, Mail, Heart, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'inbox' | 'package' | 'users' | 'messages' | 'star' | 'search' | 'cart' | 'mail' | 'heart' | 'alert';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'outline';
  };
  className?: string;
}

const iconMap = {
  inbox: Inbox,
  package: Package,
  users: Users,
  messages: MessageSquare,
  star: Star,
  search: Search,
  cart: ShoppingBag,
  mail: Mail,
  heart: Heart,
  alert: AlertCircle,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  action,
  className = '',
}) => {
  const Icon = iconMap[icon];

  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 px-4 text-center ${className}`}>
      <Icon className="size-12 text-muted-foreground/40" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
            action.variant === 'outline'
              ? 'border border-border/40 bg-surface text-foreground hover:bg-surface/80'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};