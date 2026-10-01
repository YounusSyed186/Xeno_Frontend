import React, { useState } from 'react';
import { X, Filter, ChevronDown, Search, SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';

export interface FilterOption {
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Record<string, string>>(activeFilters);

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  const handleOpenDrawer = () => {
    setTempFilters(activeFilters);
    setMobileDrawerOpen(true);
  };

  const handleApplyDrawerFilters = () => {
    Object.entries(tempFilters).forEach(([k, v]) => {
      onFilterChange(k, v);
    });
    // For keys removed
    Object.keys(activeFilters).forEach((k) => {
      if (!tempFilters[k]) {
        onFilterChange(k, '');
      }
    });
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Main Filter Bar */}
      <div className={`flex flex-col gap-3 p-3 sm:p-4 bg-surface/60 border border-white/10 rounded-2xl ${className}`}>
        {/* Search Input */}
        {showSearch && (
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-zinc-500 bg-background/80 border border-white/15 rounded-full focus:outline-none focus:ring-1 focus:ring-[#5ef046] focus:border-[#5ef046] transition-all min-h-[44px]"
            />
          </div>
        )}

        {/* Mobile Action Buttons (< 640px) */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={handleOpenDrawer}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs font-bold transition-all min-h-[44px] ${
              activeFilterCount > 0
                ? 'bg-[#5ef046] text-black shadow-sm'
                : 'bg-white/5 border border-white/15 text-white hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-black text-[#5ef046] px-1.5 py-0.2 text-[10px] font-extrabold ml-1">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center justify-center gap-1 rounded-xl bg-white/5 border border-white/15 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white min-h-[44px]"
            >
              <X className="size-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Desktop Inline Select Filters (>= 640px) */}
        <div className="hidden sm:flex flex-wrap items-center gap-2.5 pt-1">
          {filters.map((filter) => {
            const optionsList = filter.options.filter((opt) => opt.value !== '');
            return (
              <div key={filter.key} className="relative">
                <select
                  value={activeFilters[filter.key] || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="appearance-none bg-background/90 text-white border border-white/15 rounded-full pl-3.5 pr-8 py-2 text-xs font-medium focus:outline-none focus:border-[#5ef046] focus:ring-1 focus:ring-[#5ef046] min-w-[130px] cursor-pointer hover:border-white/30 transition-all min-h-[38px]"
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

          {activeFilterCount > 0 && (
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

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] flex flex-col rounded-t-3xl bg-zinc-950 border-t border-white/15 shadow-2xl overflow-hidden pb-[env(safe-area-inset-bottom,1rem)] animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-[#5ef046]" />
                <h3 className="text-base font-bold text-white">Filter & Sort</h3>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {filters.map((filter) => {
                const selectedVal = tempFilters[filter.key] || '';
                return (
                  <div key={filter.key} className="space-y-2.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {filter.label}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {filter.options.map((opt) => {
                        const isSelected = selectedVal === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setTempFilters({
                                ...tempFilters,
                                [filter.key]: opt.value,
                              });
                            }}
                            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all min-h-[40px] ${
                              isSelected
                                ? 'bg-[#5ef046] text-black shadow-sm font-bold'
                                : 'bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10'
                            }`}
                          >
                            {isSelected && <Check className="size-3 stroke-[3]" />}
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Action Buttons */}
            <div className="p-4 border-t border-white/10 bg-zinc-950/90 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  const cleared: Record<string, string> = {};
                  filters.forEach(f => { cleared[f.key] = ''; });
                  setTempFilters(cleared);
                  onClearAll();
                  setMobileDrawerOpen(false);
                }}
                className="flex-1 rounded-xl bg-white/10 py-3 text-xs font-bold text-white hover:bg-white/15 transition-all min-h-[44px]"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleApplyDrawerFilters}
                className="flex-1 rounded-xl bg-[#5ef046] py-3 text-xs font-extrabold text-black hover:bg-[#4de035] transition-all min-h-[44px] shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ActiveFilters: React.FC<{
  activeFilters: Record<string, string>;
  filterLabels: Record<string, string>;
  optionLabels: Record<string, Record<string, string>>;
  onRemove: (key: string) => void;
  onClearAll: () => void;
}> = ({ activeFilters, filterLabels, optionLabels, onRemove, onClearAll }) => {
  const entries = Object.entries(activeFilters).filter(([_, v]) => Boolean(v));
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 bg-primary/5 border-t border-primary/10 rounded-b-2xl">
      <span className="text-xs font-medium text-primary mr-1">Active:</span>
      {entries.map(([key, value]) => (
        <span key={key} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary border border-primary/20">
          <span className="font-semibold">{filterLabels[key] || key}: </span>
          <span>{optionLabels[key]?.[value] || value}</span>
          <button
            onClick={() => onRemove(key)}
            className="p-0.5 hover:bg-primary/20 rounded-full transition-colors ml-0.5"
            aria-label={`Remove ${filterLabels[key] || key} filter`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-primary/70 hover:underline ml-1 cursor-pointer"
      >
        Clear all
      </button>
    </div>
  );
};