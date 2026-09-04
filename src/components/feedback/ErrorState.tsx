import React from 'react';
import { AlertCircle, RefreshCw, Home, WifiOff, Server } from 'lucide-react';

type ErrorType = 'generic' | 'network' | 'server' | 'not_found' | 'unauthorized';

interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  onGoHome?: () => void;
  className?: string;
}

const errorConfig: Record<ErrorType, { icon: React.ComponentType<{ className?: string }>; defaultTitle: string; defaultMessage: string }> = {
  generic: { icon: AlertCircle, defaultTitle: 'Something went wrong', defaultMessage: 'An unexpected error occurred. Please try again.' },
  network: { icon: WifiOff, defaultTitle: 'Connection lost', defaultMessage: 'Please check your internet connection and try again.' },
  server: { icon: Server, defaultTitle: 'Server error', defaultMessage: 'Our servers are having trouble. Please try again later.' },
  not_found: { icon: AlertCircle, defaultTitle: 'Not found', defaultMessage: 'The resource you are looking for does not exist.' },
  unauthorized: { icon: AlertCircle, defaultTitle: 'Access denied', defaultMessage: 'You do not have permission to view this resource.' },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  message,
  onRetry,
  retryLabel = 'Try again',
  onGoHome,
  className = '',
}) => {
  const { icon: Icon, defaultTitle, defaultMessage } = errorConfig[type];

  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 px-4 text-center ${className}`}>
      <Icon className="size-12 text-destructive" />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">{title ?? defaultTitle}</h3>
        <p className="text-sm text-muted-foreground">{message ?? defaultMessage}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface/80 transition-colors"
          >
            <RefreshCw className="size-4" />
            {retryLabel}
          </button>
        )}
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
          >
            <Home className="size-4" />
            Go home
          </button>
        )}
      </div>
    </div>
  );
};