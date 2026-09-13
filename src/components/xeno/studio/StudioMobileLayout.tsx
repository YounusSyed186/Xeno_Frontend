"use client";

import React, { useState } from "react";
import { StudioTopBar } from "./StudioTopBar";
import { StudioToolbar, StudioToolTab } from "./StudioToolbar";
import { StudioToolPanel, DesignTemplate } from "./StudioToolPanel";
import { StudioCanvas, PlacementPreset } from "./StudioCanvas";
import { StudioOrderSummary } from "./StudioOrderSummary";
import { StudioPreviewModal } from "./StudioPreviewModal";
import { Product, PrintingMethod, CustomizationOption } from "@/types/product";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  SlidersHorizontal,
  ChevronUp,
  X,
  Plus,
  Minus,
  Layers,
  Sparkles,
} from "lucide-react";

interface StudioMobileLayoutProps {
  products: Product[];
  currentProduct: Product | null;
  onSelectProduct: (p: Product) => void;
  // Variants
  selectedVariant: any;
  selectedColor: any;
  selectedSize: any;
  selectedMaterial: any;
  colors: any[];
  sizes: any[];
  materials: any[];
  onSelectVariant: (colorId: number, sizeId: number, materialId: number) => void;
  // Printing Method
  printingMethods: PrintingMethod[];
  selectedPrintMethod: PrintingMethod | null;
  onSelectPrintMethod: (method: PrintingMethod) => void;
  // Custom Options
  customizationOptions: CustomizationOption[];
  selectedOptions: Record<string, string>;
  onOptionChange: (code: string, value: string) => void;
  // Artwork
  artworkFiles: File[];
  onUploadArtwork: (files: File[]) => void;
  onRemoveArtwork: (index: number) => void;
  customArtworkUrl: string | null;
  onSelectSampleGraphic: (url: string | null) => void;
  onClearArtwork: () => void;
  // Typography
  textVal: string;
  setTextVal: (v: string) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  textColor: string;
  setTextColor: (v: string) => void;
  textSize: number;
  setTextSize: (v: number) => void;
  letterSpacing: number;
  setLetterSpacing: (v: number) => void;
  showText: boolean;
  setShowText: (v: boolean) => void;
  // Placement & Transform
  placement: PlacementPreset;
  onPlacementChange: (p: PlacementPreset) => void;
  posX: number;
  setPosX: (v: number) => void;
  posY: number;
  setPosY: (v: number) => void;
  scale: number;
  setScale: (v: number) => void;
  rotation: number;
  setRotation: (v: number) => void;
  opacity: number;
  setOpacity: (v: number) => void;
  // Template apply
  onApplyTemplate: (template: DesignTemplate) => void;
  // Quantity & Pricing
  qty: number;
  setQty: (q: number) => void;
  tiers: number[];
  priceData: any;
  isPricing: boolean;
  isAdding: boolean;
  onAddToCart: () => void;
}

export function StudioMobileLayout({
  products,
  currentProduct,
  onSelectProduct,
  selectedVariant,
  selectedColor,
  selectedSize,
  selectedMaterial,
  colors,
  sizes,
  materials,
  onSelectVariant,
  printingMethods,
  selectedPrintMethod,
  onSelectPrintMethod,
  customizationOptions,
  selectedOptions,
  onOptionChange,
  artworkFiles,
  onUploadArtwork,
  onRemoveArtwork,
  customArtworkUrl,
  onSelectSampleGraphic,
  onClearArtwork,
  textVal,
  setTextVal,
  fontFamily,
  setFontFamily,
  textColor,
  setTextColor,
  textSize,
  setTextSize,
  letterSpacing,
  setLetterSpacing,
  showText,
  setShowText,
  placement,
  onPlacementChange,
  posX,
  setPosX,
  posY,
  setPosY,
  scale,
  setScale,
  rotation,
  setRotation,
  opacity,
  setOpacity,
  onApplyTemplate,
  qty,
  setQty,
  tiers,
  priceData,
  isPricing,
  isAdding,
  onAddToCart,
}: StudioMobileLayoutProps) {
  const [activeTab, setActiveTab] = useState<StudioToolTab | null>(null);
  const [showOrderSheet, setShowOrderSheet] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const moq = currentProduct?.moq || 1;
  const pricing = (priceData as any)?.data || (priceData as any);
  const unitPrice = pricing?.unit_price || currentProduct?.base_price || 0;
  const totalPrice = pricing?.line_total || unitPrice * qty;

  const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-background text-foreground select-none relative">
      {/* Top Header */}
      <StudioTopBar
        products={products}
        currentProduct={currentProduct}
        onSelectProduct={onSelectProduct}
        onOpenPreview={() => setShowPreviewModal(true)}
        saveStatus="saved"
      />

      {/* Main Canvas Viewport */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <StudioCanvas
          product={currentProduct}
          selectedColor={selectedColor}
          selectedPrintMethod={selectedPrintMethod}
          customArtworkUrl={customArtworkUrl}
          onClearArtwork={onClearArtwork}
          showText={showText}
          textVal={textVal}
          fontFamily={fontFamily}
          textColor={textColor}
          textSize={textSize}
          letterSpacing={letterSpacing}
          placement={placement}
          onPlacementChange={onPlacementChange}
          posX={posX}
          setPosX={setPosX}
          posY={posY}
          setPosY={setPosY}
          scale={scale}
          setScale={setScale}
          rotation={rotation}
          setRotation={setRotation}
          opacity={opacity}
          setOpacity={setOpacity}
          onOpenPreview={() => setShowPreviewModal(true)}
          className="size-full"
        />
      </div>

      {/* Horizontal Bottom Tool Rail (Mobile Only) */}
      <div className="shrink-0 border-t border-white/10 bg-neutral-950/95 backdrop-blur-xl px-2 py-2 flex items-center justify-around z-30">
        {[
          { id: "colors" as StudioToolTab, label: "Color / Size" },
          { id: "templates" as StudioToolTab, label: "Templates" },
          { id: "upload" as StudioToolTab, label: "Upload" },
          { id: "text" as StudioToolTab, label: "Text" },
          { id: "placement" as StudioToolTab, label: "Position" },
          { id: "print" as StudioToolTab, label: "Print" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTab(activeTab === item.id ? null : item.id)}
            className={cn(
              "px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all cursor-pointer",
              activeTab === item.id
                ? "bg-primary text-neutral-950 font-bold shadow-xs"
                : "text-neutral-400 hover:text-white bg-white/5"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Sticky Bottom Order Bar */}
      <div className="shrink-0 border-t border-white/10 bg-neutral-950 px-3 py-2.5 flex items-center justify-between gap-2 z-30">
        <div
          onClick={() => setShowOrderSheet(true)}
          className="flex flex-col cursor-pointer"
        >
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-foreground font-display">
              {inr(totalPrice)}
            </span>
            <ChevronUp className="size-3 text-primary animate-bounce" />
          </div>
          <span className="text-[10px] text-muted-foreground">
            {qty} units • {inr(unitPrice)}/ea
          </span>
        </div>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={isAdding || isPricing || qty < moq}
          className="rounded-xl bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-950 flex items-center gap-1.5 shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50"
        >
          <ShoppingBag className="size-3.5 text-neutral-950" />
          <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
        </button>
      </div>

      {/* Bottom Sheet for Active Tool Controls */}
      {activeTab && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setActiveTab(null)}
          />
          <div className="relative z-50 max-h-[75vh] w-full rounded-t-3xl border-t border-white/15 bg-neutral-950 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            <StudioToolPanel
              activeTab={activeTab}
              onClose={() => setActiveTab(null)}
              product={currentProduct}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              selectedMaterial={selectedMaterial}
              colors={colors}
              sizes={sizes}
              materials={materials}
              onSelectVariant={onSelectVariant}
              printingMethods={printingMethods}
              selectedPrintMethod={selectedPrintMethod}
              onSelectPrintMethod={onSelectPrintMethod}
              customizationOptions={customizationOptions}
              selectedOptions={selectedOptions}
              onOptionChange={onOptionChange}
              artworkFiles={artworkFiles}
              onUploadArtwork={onUploadArtwork}
              onRemoveArtwork={onRemoveArtwork}
              customArtworkUrl={customArtworkUrl}
              onSelectSampleGraphic={onSelectSampleGraphic}
              textVal={textVal}
              setTextVal={setTextVal}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              textColor={textColor}
              setTextColor={setTextColor}
              textSize={textSize}
              setTextSize={setTextSize}
              letterSpacing={letterSpacing}
              setLetterSpacing={setLetterSpacing}
              showText={showText}
              setShowText={setShowText}
              placement={placement}
              onPlacementChange={onPlacementChange}
              posX={posX}
              setPosX={setPosX}
              posY={posY}
              setPosY={setPosY}
              scale={scale}
              setScale={setScale}
              rotation={rotation}
              setRotation={setRotation}
              opacity={opacity}
              setOpacity={setOpacity}
              onApplyTemplate={onApplyTemplate}
              className="w-full max-w-full border-r-0 rounded-t-3xl"
            />
          </div>
        </div>
      )}

      {/* Bottom Sheet for Full Order Summary */}
      {showOrderSheet && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowOrderSheet(false)}
          />
          <div className="relative z-50 max-h-[85vh] w-full rounded-t-3xl border-t border-white/15 bg-neutral-950 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Order Configuration & Price
              </span>
              <button
                type="button"
                onClick={() => setShowOrderSheet(false)}
                className="size-7 rounded-lg bg-white/5 flex items-center justify-center text-neutral-400"
              >
                <X className="size-4" />
              </button>
            </div>
            <StudioOrderSummary
              product={currentProduct}
              selectedVariant={selectedVariant}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              selectedMaterial={selectedMaterial}
              selectedPrintMethod={selectedPrintMethod}
              artworkFiles={artworkFiles}
              customArtworkUrl={customArtworkUrl}
              showText={showText}
              textVal={textVal}
              qty={qty}
              setQty={setQty}
              tiers={tiers}
              priceData={priceData}
              isPricing={isPricing}
              isAdding={isAdding}
              onAddToCart={() => {
                setShowOrderSheet(false);
                onAddToCart();
              }}
              className="w-full border-l-0"
            />
          </div>
        </div>
      )}

      {/* Fullscreen Preview Modal */}
      <StudioPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        product={currentProduct}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        selectedMaterial={selectedMaterial}
        selectedPrintMethod={selectedPrintMethod}
        customArtworkUrl={customArtworkUrl}
        showText={showText}
        textVal={textVal}
        fontFamily={fontFamily}
        textColor={textColor}
        textSize={textSize}
        letterSpacing={letterSpacing}
        posX={posX}
        posY={posY}
        scale={scale}
        rotation={rotation}
        opacity={opacity}
        onDownloadRender={() => {}}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
