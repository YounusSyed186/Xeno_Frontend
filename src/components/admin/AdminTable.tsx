import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Inbox, Loader2, AlertCircle, Search, Filter, ChevronsUpDown, X, Check, Minus, Square } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface AdminTableProps<T> {
  columns: Column<T>[];
  data?: T[] | undefined;
  isLoading?: boolean | undefined;
  isError?: boolean | undefined;
  errorMessage?: string | undefined;
  emptyText?: string | undefined;
  onRowClick?: ((item: T) => void) | undefined;
  pagination?: {
    currentPage: number;
    lastPage: number;
    total: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
  } | undefined;
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  filters?: Record<string, any>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  stickyHeader?: boolean;
  rowSelection?: {
    selectedIds: (string | number)[];
    onSelectionChange: (ids: (string | number)[]) => void;
  } | undefined;
  density?: 'compact' | 'normal' | 'comfortable';
}

const densityClasses = {
  compact: 'py-2',
  normal: 'py-4',
  comfortable: 'py-5',
};

const densityHeaderClasses = {
  compact: 'py-2',
  normal: 'py-4',
  comfortable: 'py-5',
};

function SkeletonRow({ columns, density }: { columns: Column<any>[]; density: keyof typeof densityClasses }) {
  return (
    <tr>
      {columns.map((_, idx) => (
        <td key={idx} className={`p-4 ${densityClasses[density]}`}>
          <div className="h-4 w-3/4 bg-surface/50 animate-pulse rounded" />
        </td>
      ))}
    </tr>
  );
}

function ErrorRow({ columns, message, onRetry }: { columns: Column<any>[]; message: string; onRetry?: () => void }) {
  return (
    <tr>
      <td colSpan={columns.length} className="py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <AlertCircle className="size-8 text-destructive" />
          <span className="text-sm font-medium text-foreground">{message}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-surface px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="size-3.5" />
              Retry
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

import { RefreshCw } from 'lucide-react';

export function AdminTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  isError = false,
  errorMessage = 'Failed to load data',
  emptyText = 'No records found.',
  onRowClick,
  pagination,
  showSearch = false,
  searchPlaceholder = 'Search...',
  onSearch,
  showFilters = false,
  filters = {},
  onFiltersChange,
  stickyHeader = true,
  rowSelection,
  density = 'normal',
}: AdminTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, any>>(filters);

  const safeData: T[] = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      const d = data as any;
      return d.items || d.data || d.users || d.orders || d.products || d.categories || d.brands || [];
    }
    return [];
  }, [data]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onFiltersChange?.({});
  };

  const hasActiveFilters = Object.keys(localFilters).some(k => localFilters[k] !== undefined && localFilters[k] !== '');

  const toggleRowSelection = (id: string | number) => {
    if (!rowSelection) return;
    const newSelection = rowSelection.selectedIds.includes(id)
      ? rowSelection.selectedIds.filter(i => i !== id)
      : [...rowSelection.selectedIds, id];
    rowSelection.onSelectionChange(newSelection);
  };

  const toggleSelectAll = () => {
    if (!rowSelection) return;
    if (rowSelection.selectedIds.length === safeData.length) {
      rowSelection.onSelectionChange([]);
    } else {
      rowSelection.onSelectionChange(safeData.map(item => item.id!).filter(Boolean) as (string | number)[]);
    }
  };

  const areAllSelected = rowSelection && safeData.length > 0 && rowSelection.selectedIds.length === safeData.length;
  const areSomeSelected = rowSelection && rowSelection.selectedIds.length > 0 && rowSelection.selectedIds.length < safeData.length;

  return (
    <div className="glass-panel rounded-2xl border border-border/40 overflow-hidden flex flex-col">
      {/* Toolbar */}
      {(showSearch || showFilters) && (
        <div className="px-4 py-3 border-b border-border/40 bg-surface/30 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {showSearch && (
              <div className="relative flex-1 max-w-xs sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
            {showFilters && hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <X className="size-3" /> Clear filters
              </button>
            )}
          </div>
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-1.5 rounded-xl border border-border/40 bg-background px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
            >
              <Filter className="size-3.5" />
              Filters
              <ChevronsUpDown className={`size-3.5 transition-transform ${showFilterPanel ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      )}

      {showFilters && showFilterPanel && (
        <div className="px-4 py-3 border-b border-border/40 bg-surface/30">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(localFilters).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                <select
                  value={value ?? ''}
                  onChange={(e) => handleFilterChange(key, e.target.value || undefined)}
                  className="w-full text-xs bg-background border border-border/40 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-muted-foreground">
          <thead className={`bg-surface/80 text-foreground font-semibold uppercase tracking-wider text-[11px] border-b border-border/40 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {rowSelection && (
                <th className={`p-4 ${densityHeaderClasses[density]} w-12 text-center`}>
                  <input
                    type="checkbox"
                    checked={areAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary"
                    ref={(el) => { if (el) el.indeterminate = areSomeSelected ?? false; }}
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`p-4 ${densityHeaderClasses[density]} ${col.className || ''} ${col.sortable ? 'cursor-pointer hover:text-primary select-none' : ''}`}
                  onClick={col.sortable ? () => {} : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable && <ChevronsUpDown className="size-3.5 text-muted-foreground/40" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} columns={columns} density={density} />
              ))
            ) : isError ? (
              <ErrorRow columns={columns} message={errorMessage} />
            ) : safeData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (rowSelection ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="size-8 text-muted-foreground/40" />
                    <span className="text-xs font-medium text-muted-foreground">{emptyText}</span>
                  </div>
                </td>
              </tr>
            ) : (
              safeData.map((item, rowIdx) => (
                <tr
                  key={item?.id ?? rowIdx}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-surface/60' : 'hover:bg-surface/30'}`}
                >
                  {rowSelection && (
                    <td className={`p-4 ${densityClasses[density]} text-center`}>
                      <input
                        type="checkbox"
                        checked={rowSelection.selectedIds.includes(item.id!)}
                        onChange={() => toggleRowSelection(item.id!)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-border/40 text-primary focus:ring-primary"
                      />
                    </td>
                  )}
                  {columns.map((col, idx) => (
                    <td key={idx} className={`p-4 ${densityClasses[density]} ${col.className || ''}`}>
                      {col.cell ? col.cell(item) : col.accessorKey ? (item[col.accessorKey] as React.ReactNode) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-surface/40 border-t border-border/40 text-xs flex-wrap gap-2">
          <span className="text-muted-foreground">
            Showing {((pagination.currentPage - 1) * (pagination.pageSize || 25)) + 1} to {Math.min(pagination.currentPage * (pagination.pageSize || 25), pagination.total)} of {pagination.total} entries
          </span>
          <div className="flex items-center gap-2">
            {pagination.onPageSizeChange && (
              <select
                value={pagination.pageSize || 25}
                onChange={(e) => pagination.onPageSizeChange!(Number(e.target.value))}
                className="text-xs bg-background border border-border/40 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            )}
            <button
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="p-1.5 rounded-lg border border-border/40 bg-background text-muted-foreground disabled:opacity-40 hover:text-foreground hover:bg-surface"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="font-semibold text-foreground px-2">
              {pagination.currentPage} / {pagination.lastPage}
            </span>
            <button
              disabled={pagination.currentPage >= pagination.lastPage}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="p-1.5 rounded-lg border border-border/40 bg-background text-muted-foreground disabled:opacity-40 hover:text-foreground hover:bg-surface"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Row Selection Indicator */}
      {rowSelection && rowSelection.selectedIds.length > 0 && (
        <div className="px-4 py-2 bg-primary/5 border-t border-primary/20 flex items-center justify-between text-xs">
          <span className="text-primary font-medium">
            {rowSelection.selectedIds.length} item(s) selected
          </span>
          <button
            onClick={() => rowSelection.onSelectionChange([])}
            className="text-primary hover:underline flex items-center gap-1"
          >
            <X className="size-3" /> Clear selection
          </button>
        </div>
      )}
    </div>
  );
}