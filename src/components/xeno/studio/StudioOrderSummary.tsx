"use client";

import React, { useMemo } from "react";
import { Product, PrintingMethod } from "@/types/product";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  TrendingDown,
  Sparkles,
  Minus,
  Plus,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

interface StudioOrderSummaryProps {
  product: Product | null;
  selectedVariant: any;
  selectedColor: any;
  selectedSize: any;
  selectedMaterial: any;
  selectedPrintMethod: PrintingMethod | null;
  artworkFiles: File[];
  customArtworkUrl: string | null;
  showText: boolean;
  textVal: string;
  qty: number;
  setQty: (qty: number) => void;
  tiers: number[];
  priceData: any;
  isPricing: boolean;
  isAdding: boolean;
  onAddToCart: () => void;
  className?: string;
}

export function StudioOrderSummary({
  product,
  selectedVariant,
  selectedColor,
  selectedSize,
  selectedMaterial,
  selectedPrintMethod,
  artworkFiles,
  customArtworkUrl,
  showText,
  textVal,
  qty,
  setQty,
  tiers,
  priceData,
  isPricing,
  isAdding,
  onAddToCart,
  className,
}: StudioOrderSummaryProps) {
  const moq = product?.moq || 1;
  const isMoqMet = qty >= moq;

  // Pricing calculations
  const pricing = (priceData as any)?.data || (priceData as any);
  const unitPrice = pricing?.unit_price || product?.base_price || 0;
  const totalPrice = pricing?.line_total || unitPrice * qty;

  // Next tier calculation
  const nextTierInfo = useMemo(() => {
    const priceTiers = product?.price_tiers || [];
    if (!priceTiers || priceTiers.length === 0) return null;

    // Sort ascending
    const sorted = [...priceTiers].sort((a: any, b: any) => a.min_quantity - b.min_quantity);
    const next = sorted.find((t: any) => t.min_quantity > qty);
    if (!next) return null;

    const unitsNeeded = next.min_quantity - qty;
    const tierPrice = next.unit_price || next.price || 0;

    return {
      minQty: next.min_quantity,
      unitsNeeded,
      tierPrice,
    };
  }, [product, qty]);

  // Elements count
  const elementsCount = useMemo(() => {
    let count = 0;
    if (customArtworkUrl || artworkFiles.length > 0) count += 1;
    if (showText && textVal.trim().length > 0) count += 1;
    if (selectedPrintMethod) count += 1;
    return count;
  }, [customArtworkUrl, artworkFiles, showText, textVal, selectedPrintMethod]);

  // Readiness Checklist
  const readinessChecks = useMemo(() => {
    return [
      {
        label: "Garment selected",
        valid: Boolean(product),
      },
      {
        label: "Variant & size chosen",
        valid: Boolean(selectedVariant && selectedColor && selectedSize),
      },
      {
        label: "Print method configured",
        valid: Boolean(selectedPrintMethod),
      },
      {
        label: `Quantity meets MOQ (min ${moq})`,
        valid: isMoqMet,
      },
    ];
  }, [product, selectedVariant, selectedColor, selectedSize, selectedPrintMethod, isMoqMet, moq]);

  const isReady = readinessChecks.every((c) => c.valid);

  const handleStepQty = (delta: number) => {
    const newQty = Math.max(moq, qty + delta);
    setQty(newQty);
  };

  const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <aside
      className={cn(
        "w-80 sm:w-92 shrink-0 border-l border-white/10 bg-neutral-950/90 backdrop-blur-2xl flex flex-col z-20 select-none overflow-hidden",
        className
      )}
    >
      {/* Panel Header */}
      <div className="h-14 shrink-0 px-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase font-bold tracking-wider text-foreground">
            Design Summary & Quote
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Dynamic Bulk Tier Order Spec
          </p>
        </div>
        <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
          {elementsCount} custom spec{elementsCount === 1 ? "" : "s"}
        </span>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* Product & Variant Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                Product
              </span>
              <h4 className="text-sm font-bold text-foreground line-clamp-1 mt-0.5">
                {product?.name || "No Product Selected"}
              </h4>
            </div>
            {selectedColor && (
              <div
                className="size-5 rounded-full border border-white/20 shrink-0 mt-1 shadow-sm"
                style={{ background: selectedColor.hex || selectedColor.css || "#000000" }}
                title={`Color: ${selectedColor.name}`}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/5">
            <div>
              <span className="text-[10px] text-neutral-400 block">Color & Size</span>
              <span className="font-semibold text-neutral-200">
                {selectedColor?.name || "—"} / {selectedSize?.name || "—"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 block">Material</span>
              <span className="font-semibold text-neutral-200 truncate block">
                {selectedMaterial?.name || "Cotton Blend"}
              </span>
            </div>
          </div>

          {selectedPrintMethod && (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-[10px] text-neutral-400">Print Technique</span>
              <span className="font-semibold text-emerald-400">
                {selectedPrintMethod.name}
              </span>
            </div>
          )}
        </div>

        {/* Quantity Stepper & Quick Tiers */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-neutral-400 text-[11px]">
              Order Quantity
            </span>
            <span className="text-neutral-400 text-[11px]">
              Min Order: <strong className="text-foreground">{moq} units</strong>
            </span>
          </div>

          {/* Stepper Control */}
          <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-inner">
            <button
              type="button"
              disabled={qty <= moq}
              onClick={() => handleStepQty(-10)}
              className="size-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer border border-white/5"
              title="Decrease by 10"
            >
              <Minus className="size-4" />
            </button>
            <div className="flex-1 flex flex-col items-center justify-center px-3">
              <span className="text-lg font-bold font-display text-foreground leading-none">
                {qty}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
                Units
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleStepQty(10)}
              className="size-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 flex items-center justify-center text-neutral-300 hover:text-white transition-all cursor-pointer border border-white/5"
              title="Increase by 10"
            >
              <Plus className="size-4" />
            </button>
          </div>

          {/* Quick Tier Selection Chips */}
          <div className="flex flex-wrap gap-1.5">
            {tiers.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setQty(t)}
                className={cn(
                  "flex-1 min-w-[50px] py-1.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border text-center",
                  qty === t
                    ? "bg-primary text-neutral-950 border-primary font-bold shadow-xs scale-[1.02]"
                    : "bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200 hover:bg-white/10"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* MOQ Warning if violated */}
          {!isMoqMet && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-300 flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-amber-400" />
              <span>Minimum order quantity is {moq} units for this custom item.</span>
            </div>
          )}
        </div>

        {/* Dynamic Bulk Price Breakdown Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
            Bulk Pricing Breakdown
          </span>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Unit Price</span>
              <span className="font-semibold text-foreground text-sm">
                {inr(unitPrice)} <span className="text-[10px] font-normal text-neutral-400">/ unit</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Quantity</span>
              <span className="font-semibold text-foreground">
                × {qty} units
              </span>
            </div>
          </div>

          {/* Next Tier Unlock Callout */}
          {nextTierInfo && (
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="size-4 text-emerald-400 shrink-0" />
                <span className="leading-tight">
                  Add <strong className="text-white font-bold">{nextTierInfo.unitsNeeded} more</strong> to unlock
                </span>
              </div>
              <span className="font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                {inr(nextTierInfo.tierPrice)}
              </span>
            </div>
          )}

          {/* Total */}
          <div className="pt-3 border-t border-white/10 flex items-end justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Estimated Total
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-gradient font-display leading-tight">
                {inr(totalPrice)}
              </p>
            </div>
            {isPricing && (
              <span className="text-[10px] text-primary animate-pulse font-medium">
                Recalculating...
              </span>
            )}
          </div>
        </div>

        {/* Design Readiness Status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
              Customization Status
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border",
                isReady
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-400"
              )}
            >
              {isReady ? (
                <>
                  <CheckCircle2 className="size-3" />
                  Ready to Order
                </>
              ) : (
                <>
                  <AlertCircle className="size-3" />
                  Action Required
                </>
              )}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            {readinessChecks.map((chk, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px]">
                {chk.valid ? (
                  <Check className="size-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <span className="size-3.5 rounded-full border border-neutral-600 shrink-0" />
                )}
                <span
                  className={cn(
                    chk.valid ? "text-neutral-300" : "text-neutral-500 font-medium"
                  )}
                >
                  {chk.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Bottom CTA Bar */}
      <div className="shrink-0 p-4 sm:p-5 border-t border-white/10 bg-neutral-950 space-y-2">
        <button
          type="button"
          disabled={!isReady || isAdding || isPricing}
          onClick={onAddToCart}
          className={cn(
            "w-full rounded-2xl py-3.5 px-4 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg flex items-center justify-center gap-2",
            isReady
              ? "bg-primary text-neutral-950 hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] shadow-primary/25 glow-ring"
              : "bg-neutral-800 text-neutral-500 border border-white/5 cursor-not-allowed"
          )}
        >
          {isAdding ? (
            <>
              <span className="size-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
              <span>Adding to Cart...</span>
            </>
          ) : isPricing ? (
            <>
              <span className="size-4 rounded-full border-2 border-neutral-950 border-t-transparent animate-spin" />
              <span>Updating Quote...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="size-4 text-neutral-950" />
              <span>Add Customized Product to Cart</span>
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-neutral-500 flex items-center justify-center gap-1">
          <ShieldCheck className="size-3 text-neutral-400" />
          Authoritative pricing confirmed at checkout with artwork audit
        </p>
      </div>
    </aside>
  );
}
