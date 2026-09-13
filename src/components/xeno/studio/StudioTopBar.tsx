"use client";

import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Product } from "@/types/product";
import { LogoMark } from "@/components/xeno/Logo";
import {
  ChevronDown,
  Check,
  Eye,
  LogOut,
  Download,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudioTopBarProps {
  products: Product[];
  currentProduct: Product | null;
  onSelectProduct: (p: Product) => void;
  onOpenPreview?: () => void;
  onDownloadRender?: () => void;
  saveStatus?: "saved" | "saving" | "unsaved";
  isDirty?: boolean;
}

export function StudioTopBar({
  products,
  currentProduct,
  onSelectProduct,
  onOpenPreview,
  onDownloadRender,
  saveStatus = "saved",
}: StudioTopBarProps) {
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  return (
    <header className="h-14 shrink-0 border-b border-white/10 bg-background/95 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between select-none z-40 relative">
      {/* Left: Brand + Studio Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
          title="Return to XenoCraft Home"
        >
          <LogoMark size="sm" glow={true} />
          <span className="font-display text-sm font-bold tracking-tight text-foreground group-hover:text-primary transition-colors hidden xs:inline">
            XenoCraft
          </span>
        </Link>
        <div className="h-4 w-px bg-white/15 hidden sm:block" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary border border-primary/20">
          <Sparkles className="size-3" />
          <span className="hidden sm:inline">Design Studio</span>
          <span className="sm:hidden">Studio</span>
        </span>
      </div>

      {/* Center: Current Product Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setProductDropdownOpen(!productDropdownOpen)}
          className="flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-[0.98] border border-white/10 px-3 py-1.5 text-xs font-medium text-foreground transition-all max-w-[170px] xs:max-w-[220px] sm:max-w-xs truncate shadow-sm cursor-pointer"
          title="Switch Customizable Product"
          aria-expanded={productDropdownOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate font-semibold text-neutral-100">
            {currentProduct?.name || "Select Product"}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
              productDropdownOpen && "rotate-180"
            )}
          />
        </button>

        {productDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setProductDropdownOpen(false)}
            />
            <div
              role="listbox"
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-72 sm:w-80 max-h-80 overflow-y-auto rounded-2xl border border-white/15 bg-neutral-950/98 backdrop-blur-2xl p-2 shadow-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-2.5 py-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground border-b border-white/5 mb-1">
                Select Customizable Garment ({products.length})
              </div>
              {products.map((p) => {
                const isSelected = p.id === currentProduct?.id;
                const thumb =
                  p.images?.find((img) => img.is_primary)?.url ||
                  p.images?.[0]?.url;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onSelectProduct(p);
                      setProductDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left text-xs transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                        : "text-neutral-300 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={p.name}
                        className="size-9 rounded-lg object-cover bg-black/50 border border-white/10 shrink-0"
                      />
                    ) : (
                      <div className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <ShoppingBag className="size-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        From ₹{p.base_price?.toLocaleString("en-IN") || 0} • MOQ{" "}
                        {p.moq || 1} units
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="size-4 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Right: Actions (Save status, Export, Preview, Exit) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Subtle Save Status */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
          {saveStatus === "saving" ? (
            <>
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] text-amber-300">Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3 text-emerald-400" />
              <span className="text-[11px] text-neutral-300">Saved</span>
            </>
          )}
        </div>

        {/* Download Render */}
        {onDownloadRender && (
          <button
            type="button"
            onClick={onDownloadRender}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Download high-resolution mockup PNG"
            aria-label="Download mockup"
          >
            <Download className="size-3.5" />
            <span className="hidden md:inline">Download</span>
          </button>
        )}

        {/* Fullscreen Preview */}
        {onOpenPreview && (
          <button
            type="button"
            onClick={onOpenPreview}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Preview Fullscreen"
            aria-label="Preview fullscreen"
          >
            <Eye className="size-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        )}

        {/* Exit Studio */}
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 hover:bg-destructive/15 hover:text-destructive hover:border-destructive/30 border border-white/10 px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition-all cursor-pointer"
          title="Exit Studio to Catalog"
        >
          <LogOut className="size-3.5" />
          <span className="hidden sm:inline">Exit</span>
        </Link>
      </div>
    </header>
  );
}
