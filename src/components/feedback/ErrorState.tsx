import React from 'react';
import { AlertCircle, RefreshCw, Home, WifiOff, Server, ShieldAlert, PackageX } from 'lucide-react';
import { AppError } from '@/lib/errors';

export type ErrorType = 'generic' | 'network' | 'server' | 'not_found' | 'unauthorized' | 'product_not_found';

export interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  error?: AppError | Error | string | null;
  onRetry?: () => void;
  retryLabel?: string;
  onGoHome?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const errorConfig: Record<ErrorType, { icon: React.ComponentType<{ className?: string }>; defaultTitle: string; defaultMessage: string }> = {
  generic: { icon: AlertCircle, defaultTitle: 'Something went wrong', defaultMessage: 'An unexpected error occurred. Please try again.' },
  network: { icon: WifiOff, defaultTitle: 'Connection lost', defaultMessage: 'Please check your internet connection and try again.' },
  server: { icon: Server, defaultTitle: 'Server error', defaultMessage: 'Our servers are having trouble. Please try again later.' },
  not_found: { icon: AlertCircle, defaultTitle: 'Page not found', defaultMessage: 'The resource you are looking for does not exist.' },
  product_not_found: { icon: PackageX, defaultTitle: 'Product unavailable', defaultMessage: 'This product is no longer available.' },
  unauthorized: { icon: ShieldAlert, defaultTitle: 'Access restricted', defaultMessage: 'You do not have permission to view this resource.' },
};

export const ErrorState: React.FC<ErrorStateProps> = ({
  type = 'generic',
  title,
  message,
  error,
  onRetry,
  retryLabel = 'Try again',
  onGoHome,
  actionLabel,
  onAction,
  className = '',
}) => {
  let resolvedType = type;
  let resolvedTitle = title;
  let resolvedMessage = message;

  if (error) {
    if (error instanceof AppError) {
      resolvedTitle = title || error.title || 'Error';
      resolvedMessage = message || error.message;
      if (error.code === 'NETWORK_ERROR') resolvedType = 'network';
      else if (error.code === 'PRODUCT_NOT_FOUND') resolvedType = 'product_not_found';
      else if (error.status === 404) resolvedType = 'not_found';
      else if (error.status === 401 || error.status === 403) resolvedType = 'unauthorized';
      else if (error.status >= 500) resolvedType = 'server';
    } else if (typeof error === 'string') {
      resolvedMessage = message || error;
    } else if (error instanceof Error) {
      resolvedMessage = message || error.message;
    }
  }

  const { icon: Icon, defaultTitle, defaultMessage } = errorConfig[resolvedType] || errorConfig.generic;

  return (
    <div
      role="region"
      aria-label="Error announcement"
      className={`flex flex-col items-center justify-center gap-4 py-16 px-4 text-center ${className}`}
    >
      <div className="rounded-full bg-destructive/10 p-4 border border-destructive/20 shadow-xs">
        <Icon className="size-10 text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-lg font-bold text-foreground font-display">{resolvedTitle ?? defaultTitle}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{resolvedMessage ?? defaultMessage}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            {retryLabel}
          </button>
        )}
        {onAction && actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-1.5 rounded-xl border border-input bg-background/60 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
        {onGoHome && (
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-background px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
          >
            <Home className="size-3.5" />
            Go home
          </button>
        )}
      </div>
    </div>
  );
};