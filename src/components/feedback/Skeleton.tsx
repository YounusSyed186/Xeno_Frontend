import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width = '100%',
  height = '1rem',
  count = 1,
}) => {
  const baseClasses = `animate-pulse bg-surface/70 border border-border/30 ${
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'rectangular'
      ? 'rounded-2xl'
      : 'rounded-md'
  } ${className}`;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={baseClasses}
          style={{ width, height }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-2xl border border-border/40 bg-card/60 p-6 ${className}`}>
    <div className="space-y-4">
      <Skeleton variant="rectangular" width="40%" height="1.5rem" />
      <Skeleton variant="rectangular" width="60%" height="1rem" />
      <Skeleton variant="rectangular" width="100%" height="1rem" />
      <Skeleton variant="rectangular" width="80%" height="1rem" />
    </div>
  </div>
);

export const SkeletonTableRow: React.FC<{ columns?: number; className?: string }> = ({
  columns = 4,
  className = '',
}) => (
  <tr className={`border-b border-border/40 ${className}`}>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton variant="text" width={`${Math.max(40, 85 - i * 12)}%`} height="1.25rem" />
      </td>
    ))}
  </tr>
);