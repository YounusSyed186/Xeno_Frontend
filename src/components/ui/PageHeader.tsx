import React from 'react';

export interface PageHeaderProps {
  title: string;
  description?: string | undefined;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  children,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-border/30 pb-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
};