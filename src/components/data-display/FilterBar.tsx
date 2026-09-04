import React from 'react';
import { X, Filter, ChevronDown, SlidersHorizontal, Search } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface FilterBarProps {
  filters: FilterOption[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearAll: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  activeFilters,
  onFilterChange,
  onClearAll,
  searchPlaceholder = 'Search products...',
  searchValue = '',
  onSearchChange,
  showSearch = true,
  className = '',
}) => {
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className={`flex flex-col sm:flex-row gap-4 p-4 bg-surface/50 border border-border/40 rounded-2xl ${className}`}>
      {showSearch && (
        <div className="relative flex-1 max-w-md sm:max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <div key={filter.key} className="relative">
            <select
              value={activeFilters[filter.key] || ''}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="appearance-none bg-background border border-border/40 rounded-xl px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-w-[160px] pr-8"
            >
              <option value="">All {filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
            {activeFilters[filter.key] && (
              <button
                onClick={() => onFilterChange(filter.key, '')}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline px-3 py-2"
          >
            <X className="size-3.5" /> Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export const ActiveFilters: React.FC<{
  activeFilters: Record<string, string>;
  filterLabels: Record<string, string>;
  optionLabels: Record<string, Record<string, string>>;
  onRemove: (key: string) => void;
  onClearAll: () => void;
}> = ({ activeFilters, filterLabels, optionLabels, onRemove, onClearAll }) => {
  const entries = Object.entries(activeFilters);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-primary/5 border-t border-primary/10 rounded-b-2xl">
      <span className="text-xs font-medium text-primary mr-2">Active filters:</span>
      {entries.map(([key, value]) => (
        <span key={key} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
          <span className="font-semibold">{filterLabels[key] || key}: </span>
          <span>{optionLabels[key]?.[value] || value}</span>
          <button
            onClick={() => onRemove(key)}
            className="p-0.5 hover:bg-primary/20 rounded-full transition-colors"
            aria-label={`Remove ${filterLabels[key] || key} filter`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-primary/70 hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  );
};