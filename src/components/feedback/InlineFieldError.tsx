import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InlineFieldErrorProps {
  error?: string | null | undefined;
  id?: string | undefined;
  className?: string | undefined;
}

export const InlineFieldError: React.FC<InlineFieldErrorProps> = ({
  error,
  id,
  className = '',
}) => {
  if (!error) return null;

  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive animate-in fade-in-0 slide-in-from-top-1 duration-200 ${className}`}
    >
      <AlertCircle className="size-3.5 shrink-0 text-destructive" aria-hidden="true" />
      <span>{error}</span>
    </p>
  );
};
