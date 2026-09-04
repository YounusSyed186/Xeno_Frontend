import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSize = true,
  className = '',
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  if (lastPage <= 1) return null;

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-surface/40 border-t border-border/40 text-xs flex-wrap gap-2 ${className}`}>
      <span className="text-muted-foreground">
        Showing {startItem} to {endItem} of {total} entries
      </span>
      <div className="flex items-center gap-2">
        {showPageSize && onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-xs bg-background border border-border/40 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        )}
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-1.5 rounded-lg border border-border/40 bg-background text-muted-foreground disabled:opacity-40 hover:text-foreground hover:bg-surface"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="font-semibold text-foreground px-2">
          {currentPage} / {lastPage}
        </span>
        <button
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-1.5 rounded-lg border border-border/40 bg-background text-muted-foreground disabled:opacity-40 hover:text-foreground hover:bg-surface"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
};