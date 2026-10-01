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
    <div className={`flex flex-col sm:flex-row gap-3 p-3.5 bg-surface/60 border border-white/10 rounded-2xl ${className}`}>
      {showSearch && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 bg-background/80 border border-white/15 rounded-full focus:outline-none focus:ring-1 focus:ring-[#5ef046] focus:border-[#5ef046] transition-all"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        {filters.map((filter) => {
          const optionsList = filter.options.filter((opt) => opt.value !== '');
          return (
            <div key={filter.key} className="relative">
              <select
                value={activeFilters[filter.key] || ''}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="appearance-none bg-background/90 text-white border border-white/15 rounded-full pl-3.5 pr-8 py-2 text-xs font-medium focus:outline-none focus:border-[#5ef046] focus:ring-1 focus:ring-[#5ef046] min-w-[130px] cursor-pointer hover:border-white/30 transition-all"
              >
                <option value="" className="bg-zinc-900 text-white">All {filter.label}</option>
                {optionsList.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
            </div>
          );
        })}

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5ef046] hover:text-[#4de035] hover:underline px-2.5 py-1.5 transition-colors cursor-pointer"
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