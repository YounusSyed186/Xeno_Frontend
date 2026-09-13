"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Product, PrintingMethod, ProductColor } from "@/types/product";
import { cn } from "@/lib/utils";
import {
  Rotate3d,
  Sun,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Eye,
  Type,
  Image as ImageIcon,
  Move,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle2,
  Trash2,
  Copy,
  AlignCenter,
} from "lucide-react";
import { toast } from "sonner";

export type AngleView = "front" | "back" | "detail" | "isometric";
export type LightingPreset = "studio" | "warm" | "cyber" | "noir";
export type PlacementPreset = "center" | "left_chest" | "right_chest" | "full_back" | "bottom_hem";

interface StudioCanvasProps {
  product: Product | null;
  selectedColor?: ProductColor | any;
  selectedPrintMethod?: PrintingMethod | null;
  // Artwork
  customArtworkUrl: string | null;
  onClearArtwork?: () => void;
  // Typography
  showText: boolean;
  textVal: string;
  fontFamily: string;
  textColor: string;
  textSize: number;
  letterSpacing: number;
  // Transform
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
  // Canvas export
  onOpenPreview?: () => void;
  className?: string;
}

export function StudioCanvas({
  product,
  selectedColor,
  selectedPrintMethod,
  customArtworkUrl,
  onClearArtwork,
  showText,
  textVal,
  fontFamily,
  textColor,
  textSize,
  letterSpacing,
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
  onOpenPreview,
  className,
}: StudioCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  // View & Camera States
  const [angle, setAngle] = useState<AngleView>("front");
  const [lighting, setLighting] = useState<LightingPreset>("studio");
  const [zoom, setZoom] = useState<number>(1);
  const [showGrid, setShowGrid] = useState(false);
  const [isSelected, setIsSelected] = useState(true);

  // 3D Parallax Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Dragging state for canvas element
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initPosX: number; initPosY: number }>({
    startX: 0,
    startY: 0,
    initPosX: 50,
    initPosY: 42,
  });

  // 3D Parallax Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;
      const newX = Math.min(85, Math.max(15, dragStartRef.current.initPosX + deltaX));
      const newY = Math.min(85, Math.max(15, dragStartRef.current.initPosY + deltaY));
      setPosX(Math.round(newX));
      setPosY(Math.round(newY));
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 14);
    setRotateY(x * 18);
  };

  const handleMouseLeave = () => {
    if (isDragging) setIsDragging(false);
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleStartDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setIsSelected(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPosX: posX,
      initPosY: posY,
    };
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Product Image Selection
  const primaryImage = useMemo(() => {
    if (!product) return null;
    const images = product.images || [];
    if (images.length === 0) return null;
    const primary = images.find((img) => img.is_primary);
    return primary ? primary.url : images[0]?.url;
  }, [product]);

  const secondaryImage = useMemo(() => {
    if (!product) return null;
    const images = product.images || [];
    if (images.length > 1) {
      const nonPrimary = images.find((img) => !img.is_primary);
      return nonPrimary ? nonPrimary.url : images[1]?.url;
    }
    return primaryImage;
  }, [product, primaryImage]);

  const currentDisplayImage = angle === "back" ? secondaryImage : primaryImage;

  // Selected Color Hex & Filter
  const colorHex = selectedColor?.hex || selectedColor?.hex_code || "#000000";

  // Lighting Filter Styles
  const lightingStyles = useMemo(() => {
    switch (lighting) {
      case "warm":
        return "filter drop-shadow-[0_20px_35px_rgba(234,179,8,0.22)] brightness-105 sepia-[0.12]";
      case "cyber":
        return "filter drop-shadow-[0_20px_40px_rgba(6,182,212,0.28)] hue-rotate-[15deg] contrast-105";
      case "noir":
        return "filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.85)] contrast-125 saturate-90";
      case "studio":
      default:
        return "filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.45)] brightness-100";
    }
  }, [lighting]);

  // Print Method Texture Shader class
  const printShaderClass = useMemo(() => {
    const methodName = selectedPrintMethod?.name?.toLowerCase() || "";
    if (methodName.includes("embroidery")) {
      return "drop-shadow-[1px_2px_0px_rgba(0,0,0,0.7)] drop-shadow-[0px_1px_2px_rgba(255,255,255,0.4)] [filter:contrast(1.15)] ring-1 ring-white/20";
    }
    if (methodName.includes("digital") || methodName.includes("dtg")) {
      return "mix-blend-multiply opacity-90 filter contrast-105";
    }
    if (methodName.includes("screen")) {
      return "mix-blend-luminosity filter contrast-120 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]";
    }
    if (methodName.includes("sublimation")) {
      return "mix-blend-overlay filter saturate-125";
    }
    return "drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]";
  }, [selectedPrintMethod]);

  // High-Resolution Mockup Render Downloader
  const handleDownloadRender = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      // Draw background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1600);
      bgGrad.addColorStop(0, "#0a0b0d");
      bgGrad.addColorStop(1, "#14161a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1600);

      // Load base product image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Draw product
        ctx.drawImage(img, 150, 150, 1300, 1300);

        // Apply tint overlay
        ctx.fillStyle = colorHex;
        ctx.globalAlpha = 0.22;
        ctx.fillRect(150, 150, 1300, 1300);
        ctx.globalAlpha = 1.0;

        // Draw custom text if enabled
        if (showText && textVal) {
          ctx.font = `bold ${textSize * 2.2}px ${fontFamily}`;
          ctx.fillStyle = textColor;
          ctx.textAlign = "center";
          ctx.fillText(textVal, (posX / 100) * 1600, (posY / 100) * 1600);
        }

        // Export PNG
        const link = document.createElement("a");
        link.download = `xenocraft-${product?.slug || "custom"}-mockup.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("High-resolution photorealistic render downloaded!");
      };
      img.onerror = () => {
        toast.error("Error generating mockup render download");
      };
      img.src = currentDisplayImage || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000";
    } catch (err: any) {
      toast.error("Render capture failed: " + err?.message);
    }
  };

  return (
    <main
      className={cn(
        "flex-1 relative flex flex-col bg-gradient-to-b from-neutral-950 via-neutral-900 to-black select-none overflow-hidden min-h-[420px]",
        className
      )}
      onClick={() => setIsSelected(false)}
      onMouseUp={handleMouseUp}
    >
      {/* Dynamic Atmospheric Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full blur-[140px] opacity-25 transition-all duration-700"
        style={{ background: colorHex || "#5ef046" }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-primary/10 blur-[100px]" />

      {/* Top Floating Controls Bar on Canvas */}
      <div className="absolute top-3 inset-x-3 sm:inset-x-5 z-20 flex items-center justify-between pointer-events-none">
        {/* View Angle Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 rounded-2xl bg-neutral-950/80 backdrop-blur-xl p-1 border border-white/10 shadow-lg">
          {(["front", "back", "detail", "isometric"] as AngleView[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAngle(a);
                if (a === "detail") setZoom(1.75);
                else if (a === "isometric") {
                  setRotateX(12);
                  setRotateY(-25);
                } else {
                  setZoom(1);
                  setRotateX(0);
                  setRotateY(0);
                }
              }}
              className={cn(
                "rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200 cursor-pointer",
                angle === a
                  ? "bg-primary text-neutral-950 shadow-md font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Lighting Environments */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1 rounded-2xl bg-neutral-950/80 backdrop-blur-xl p-1 border border-white/10 shadow-lg">
          {[
            { id: "studio", label: "Studio" },
            { id: "warm", label: "Sunset" },
            { id: "cyber", label: "Cyber" },
            { id: "noir", label: "Noir" },
          ].map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLighting(l.id as LightingPreset)}
              className={cn(
                "rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1",
                lighting === l.id
                  ? "bg-white/15 text-white font-semibold border border-white/10"
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
              )}
            >
              <Sun className="size-3" />
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive 3D Canvas Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="relative flex-1 size-full flex items-center justify-center overflow-hidden perspective-[1200px] cursor-grab active:cursor-grabbing"
      >
        {/* Subtle Workspace Grid Overlay */}
        {showGrid && (
          <div className="pointer-events-none absolute inset-0 z-10 grid grid-cols-8 grid-rows-8 opacity-20">
            {[...Array(64)].map((_, i) => (
              <div key={i} className="border border-dashed border-emerald-400/30" />
            ))}
          </div>
        )}

        {/* 3D Garment Ground Shadow */}
        <div
          className="absolute bottom-8 h-16 w-3/5 rounded-[100%] bg-black/70 blur-2xl transition-all duration-300 pointer-events-none"
          style={{
            transform: `scale(${zoom}) translateX(${rotateY * 2}px)`,
          }}
        />

        {/* 3D Transformable Garment Stage Container */}
        <div
          className="relative size-full max-w-[620px] max-h-[620px] flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
          style={{
            transform: `scale(${zoom}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Base Product Photographic Image */}
          {currentDisplayImage ? (
            <div className="relative size-full flex items-center justify-center p-6 sm:p-8">
              <img
                src={currentDisplayImage}
                alt={product?.name || "Product Mockup"}
                className={cn(
                  "relative max-h-full max-w-full object-contain pointer-events-none transition-all duration-500",
                  lightingStyles
                )}
                draggable={false}
              />

              {/* Dynamic Color Tint Shader Overlay */}
              {selectedColor && colorHex && (
                <div
                  className="pointer-events-none absolute inset-6 sm:inset-8 mix-blend-color opacity-75 transition-all duration-300"
                  style={{
                    backgroundColor: colorHex,
                    maskImage: `url(${currentDisplayImage})`,
                    WebkitMaskImage: `url(${currentDisplayImage})`,
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                />
              )}

              {/* Specular Fabric Reflection */}
              <div
                className="pointer-events-none absolute inset-6 sm:inset-8 mix-blend-overlay opacity-25 transition-all duration-300"
                style={{
                  background: `linear-gradient(${120 + rotateY * 2}deg, rgba(255,255,255,0.7) 0%, transparent 60%)`,
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
              <Sparkles className="size-12 animate-pulse text-primary/60" />
              <p className="text-sm font-medium">Select a product to view workspace</p>
            </div>
          )}

          {/* Interactive Artwork & Logo Overlay on Garment */}
          <div
            ref={elementRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsSelected(true);
            }}
            onMouseDown={handleStartDrag}
            className={cn(
              "absolute pointer-events-auto transition-transform duration-75 ease-out select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{
              top: `${posY}%`,
              left: `${posX}%`,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
              opacity: opacity,
            }}
          >
            {/* User Uploaded Logo or Default Graphic */}
            {customArtworkUrl ? (
              <div className={cn("relative group", printShaderClass)}>
                <img
                  src={customArtworkUrl}
                  alt="Custom Artwork"
                  className="max-h-36 max-w-36 object-contain pointer-events-none"
                  draggable={false}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center text-center select-none p-2",
                  printShaderClass
                )}
              >
                {/* Fallback Graphic Icon */}
                <svg viewBox="0 0 100 100" className="size-16 text-white/90 drop-shadow-md pointer-events-none">
                  <polygon
                    points="50,10 90,85 10,85"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinejoin="round"
                  />
                  <circle cx="50" cy="55" r="14" fill="currentColor" opacity="0.8" />
                </svg>

                {/* Live Custom Text Line */}
                {showText && textVal && (
                  <span
                    style={{
                      fontFamily,
                      color: textColor,
                      fontSize: `${textSize}px`,
                      letterSpacing: `${letterSpacing}px`,
                      textTransform: "uppercase",
                    }}
                    className="mt-1.5 font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pointer-events-none"
                  >
                    {textVal}
                  </span>
                )}
              </div>
            )}

            {/* Selection Bounding Box with Resize Handles */}
            {isSelected && (
              <div className="absolute -inset-2 rounded-lg border-2 border-primary ring-1 ring-black/40 pointer-events-none animate-in fade-in duration-150">
                {/* Corner Handles */}
                <span className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-primary border-2 border-neutral-950" />
                <span className="absolute -top-1.5 -right-1.5 size-3 rounded-full bg-primary border-2 border-neutral-950" />
                <span className="absolute -bottom-1.5 -left-1.5 size-3 rounded-full bg-primary border-2 border-neutral-950" />
                <span className="absolute -bottom-1.5 -right-1.5 size-3 rounded-full bg-primary border-2 border-neutral-950" />

                {/* Center Drag Indicator */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary/70 animate-ping" />
              </div>
            )}
          </div>
        </div>

        {/* Floating Contextual Element Actions Bar (When Element is Selected) */}
        {isSelected && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-2xl bg-neutral-950/90 backdrop-blur-xl px-3 py-1.5 border border-white/15 shadow-2xl text-xs animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-1 border-r border-white/10 mr-1">
              {posX}% , {posY}%
            </span>
            <button
              type="button"
              onClick={() => {
                setPosX(50);
                setPosY(42);
              }}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Center Placement"
            >
              <AlignCenter className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setScale(Math.min(2.5, scale + 0.1))}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Scale Up (+10%)"
            >
              <ZoomIn className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setScale(Math.max(0.4, scale - 0.1))}
              className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Scale Down (-10%)"
            >
              <ZoomOut className="size-3.5" />
            </button>
            {customArtworkUrl && onClearArtwork && (
              <button
                type="button"
                onClick={onClearArtwork}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-destructive hover:bg-destructive/10 transition-colors ml-1 border-l border-white/10 pl-2"
                title="Delete Graphic"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Floating Canvas Zoom & View Controls (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-2xl bg-neutral-950/80 backdrop-blur-xl px-2.5 py-1.5 border border-white/10 shadow-lg text-xs">
          <button
            type="button"
            onClick={() => setZoom(Math.max(0.7, zoom - 0.2))}
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] font-semibold text-neutral-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(Math.min(2.5, zoom + 0.2))}
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="size-3.5" />
          </button>
          <div className="h-3 w-px bg-white/15 mx-1" />
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setRotateX(0);
              setRotateY(0);
            }}
            className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Fit / Reset View"
            aria-label="Reset View"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={cn(
              "p-1 rounded-lg transition-colors cursor-pointer ml-0.5",
              showGrid ? "text-primary bg-primary/20" : "text-neutral-400 hover:text-white"
            )}
            title="Toggle Alignment Grid"
            aria-label="Toggle Grid"
          >
            <Layers className="size-3.5" />
          </button>
        </div>

        {/* Live Shader Method Badge (Top Right) */}
        {selectedPrintMethod && (
          <div className="absolute top-14 right-3 z-10 hidden sm:flex items-center gap-2 rounded-xl bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 border border-white/10 text-xs">
            <span className="size-2 rounded-full bg-primary" />
            <span className="font-semibold text-neutral-200">
              {selectedPrintMethod.name} Shader
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
