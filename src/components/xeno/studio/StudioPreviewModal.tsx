"use client";

import React, { useState } from "react";
import { Product, PrintingMethod } from "@/types/product";
import { cn } from "@/lib/utils";
import {
  X,
  Download,
  Eye,
  Sparkles,
  ShoppingBag,
  Rotate3d,
} from "lucide-react";

interface StudioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  selectedColor: any;
  selectedSize: any;
  selectedMaterial: any;
  selectedPrintMethod: PrintingMethod | null;
  customArtworkUrl: string | null;
  showText: boolean;
  textVal: string;
  fontFamily: string;
  textColor: string;
  textSize: number;
  letterSpacing: number;
  posX: number;
  posY: number;
  scale: number;
  rotation: number;
  opacity: number;
  onDownloadRender: () => void;
  onAddToCart: () => void;
}

export function StudioPreviewModal({
  isOpen,
  onClose,
  product,
  selectedColor,
  selectedSize,
  selectedMaterial,
  selectedPrintMethod,
  customArtworkUrl,
  showText,
  textVal,
  fontFamily,
  textColor,
  textSize,
  letterSpacing,
  posX,
  posY,
  scale,
  rotation,
  opacity,
  onDownloadRender,
  onAddToCart,
}: StudioPreviewModalProps) {
  const [angle, setAngle] = useState<"front" | "back">("front");

  if (!isOpen) return null;

  const primaryImage = product?.images?.find((img) => img.is_primary)?.url || product?.images?.[0]?.url;
  const secondaryImage = product?.images?.find((img) => !img.is_primary)?.url || primaryImage;
  const currentImage = angle === "back" ? secondaryImage : primaryImage;
  const colorHex = selectedColor?.hex || selectedColor?.hex_code || "#000000";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border border-white/15 bg-neutral-950/95 shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Photorealistic Preview Showcase
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Main Viewport */}
        <div className="flex-1 overflow-y-auto p-6 grid lg:grid-cols-[1fr_320px] gap-6 items-center">
          {/* Canvas Display */}
          <div className="relative min-h-[380px] sm:min-h-[460px] rounded-2xl border border-white/10 bg-gradient-radial from-neutral-900 to-black flex items-center justify-center p-6 overflow-hidden">
            {/* Ambient Lighting */}
            <div
              className="pointer-events-none absolute size-72 rounded-full blur-[100px] opacity-35"
              style={{ background: colorHex }}
            />

            {/* View angle toggle */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 rounded-xl bg-black/60 backdrop-blur-md p-1 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setAngle("front")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer",
                  angle === "front" ? "bg-primary text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                )}
              >
                Front
              </button>
              <button
                type="button"
                onClick={() => setAngle("back")}
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all cursor-pointer",
                  angle === "back" ? "bg-primary text-neutral-950 font-bold" : "text-neutral-400 hover:text-white"
                )}
              >
                Back
              </button>
            </div>

            {/* Product Image + Graphic */}
            <div className="relative size-full max-w-[420px] max-h-[420px] flex items-center justify-center">
              {currentImage && (
                <>
                  <img
                    src={currentImage}
                    alt={product?.name || "Product"}
                    className="max-h-full max-w-full object-contain"
                  />
                  {colorHex && (
                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-color opacity-75"
                      style={{
                        backgroundColor: colorHex,
                        maskImage: `url(${currentImage})`,
                        WebkitMaskImage: `url(${currentImage})`,
                        maskSize: "contain",
                        WebkitMaskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                      }}
                    />
                  )}
                </>
              )}

              {/* Artwork overlay */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: `${posY}%`,
                  left: `${posX}%`,
                  transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                  opacity: opacity,
                }}
              >
                {customArtworkUrl ? (
                  <img
                    src={customArtworkUrl}
                    alt="Custom Artwork"
                    className="max-h-28 max-w-28 object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <svg viewBox="0 0 100 100" className="size-14 text-white/90">
                      <polygon
                        points="50,10 90,85 10,85"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                      />
                    </svg>
                    {showText && textVal && (
                      <span
                        style={{
                          fontFamily,
                          color: textColor,
                          fontSize: `${textSize}px`,
                          letterSpacing: `${letterSpacing}px`,
                        }}
                        className="font-bold tracking-widest uppercase mt-1 drop-shadow-md"
                      >
                        {textVal}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Specs & Actions Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-primary tracking-widest">
                Render Specifications
              </span>
              <h4 className="text-base font-bold text-foreground">
                {product?.name || "Custom Apparel"}
              </h4>

              <div className="space-y-2 text-xs pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Color / Variant</span>
                  <span className="font-semibold text-neutral-200">
                    {selectedColor?.name || "Original"} ({selectedSize?.name || "M"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Fabric</span>
                  <span className="font-semibold text-neutral-200 truncate max-w-[150px]">
                    {selectedMaterial?.name || "Heavyweight Cotton"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Print Method</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedPrintMethod?.name || "DTG Print"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={onDownloadRender}
                className="w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 py-3 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="size-4 text-primary" />
                Download High-Res Mockup PNG
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAddToCart();
                }}
                className="w-full rounded-xl bg-primary hover:bg-primary/90 py-3 text-xs font-bold uppercase tracking-wider text-neutral-950 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary/20"
              >
                <ShoppingBag className="size-4" />
                Proceed with Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
