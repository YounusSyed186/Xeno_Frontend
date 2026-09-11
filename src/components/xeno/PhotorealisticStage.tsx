"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

interface PhotorealisticStageProps {
  product: Product | null;
  selectedColor?: ProductColor | any;
  selectedPrintMethod?: PrintingMethod | null;
  artworkFiles?: File[];
  customText?: string;
  className?: string;
}

type AngleView = "front" | "back" | "detail" | "isometric";
type LightingPreset = "studio" | "warm" | "cyber" | "noir";
type PlacementPreset = "center" | "left_chest" | "right_chest" | "full_back" | "bottom_hem";

const DEFAULT_LOGOS = [
  {
    name: "Xeno Craft (Gradient)",
    url: "/logos/Xeno craft trasparent green gradient.png",
  },
  {
    name: "Xeno Craft (White)",
    url: "/logos/Xeno craft trasparent white.png",
  },
  {
    name: "Xeno Craft Emblem",
    url: "/logos/Xeno craft Green.png",
  },
  {
    name: "Geometric Wolf",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
  },
  {
    name: "Cyber Brand",
    url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80",
  },
  {
    name: "Minimalist Crest",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&auto=format&fit=crop&q=80",
  },
];

export function PhotorealisticStage({
  product,
  selectedColor,
  selectedPrintMethod,
  artworkFiles = [],
  customText = "",
  className,
}: PhotorealisticStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // View & Camera States
  const [angle, setAngle] = useState<AngleView>("front");
  const [lighting, setLighting] = useState<LightingPreset>("studio");
  const [zoom, setZoom] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // 3D Parallax Tilt state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Custom Logo Placement & Transforms
  const [placement, setPlacement] = useState<PlacementPreset>("center");
  const [posX, setPosX] = useState(50); // percentage
  const [posY, setPosY] = useState(42); // percentage
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.95);
  const [activeTab, setActiveTab] = useState<"artwork" | "typography" | "effects" | "lighting">("artwork");

  // Custom Typography State
  const [textVal, setTextVal] = useState(customText || "XENO CRAFT");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(24);
  const [letterSpacing, setLetterSpacing] = useState(2);
  const [showText, setShowText] = useState(true);

  // Selected artwork preview URL
  const [customArtworkUrl, setCustomArtworkUrl] = useState<string | null>(null);

  // Sync artwork file if user uploaded via standard file input
  useEffect(() => {
    if (artworkFiles && artworkFiles.length > 0) {
      const file = artworkFiles[artworkFiles.length - 1];
      const objUrl = URL.createObjectURL(file);
      setCustomArtworkUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    }
  }, [artworkFiles]);

  // Sync customText if parent prop changes
  useEffect(() => {
    if (customText) {
      setTextVal(customText);
    }
  }, [customText]);

  // Preset Placement updates
  const handlePlacementChange = (newPlacement: PlacementPreset) => {
    setPlacement(newPlacement);
    switch (newPlacement) {
      case "center":
        setPosX(50);
        setPosY(42);
        setScale(1);
        break;
      case "left_chest":
        setPosX(62);
        setPosY(34);
        setScale(0.55);
        break;
      case "right_chest":
        setPosX(38);
        setPosY(34);
        setScale(0.55);
        break;
      case "full_back":
        setPosX(50);
        setPosY(44);
        setScale(1.25);
        break;
      case "bottom_hem":
        setPosX(50);
        setPosY(72);
        setScale(0.65);
        break;
    }
  };

  // 3D Parallax Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 18);
    setRotateY(x * 22);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotateX(0);
    setRotateY(0);
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
  const isLightGarment = useMemo(() => {
    if (!colorHex) return false;
    const c = colorHex.replace("#", "");
    if (c.length !== 6) return false;
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  }, [colorHex]);

  // Lighting Filter Styles
  const lightingStyles = useMemo(() => {
    switch (lighting) {
      case "warm":
        return "filter drop-shadow-[0_20px_35px_rgba(234,179,8,0.25)] brightness-105 sepia-[0.12]";
      case "cyber":
        return "filter drop-shadow-[0_20px_40px_rgba(6,182,212,0.3)] hue-rotate-[15deg] contrast-105";
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

  // High-Resolution Canvas Mockup Downloader
  const handleDownloadRender = () => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize canvas context");

      // Draw background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1600);
      bgGrad.addColorStop(0, "#0e0f12");
      bgGrad.addColorStop(1, "#181a20");
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
          ctx.font = `bold ${textSize * 2.2}px Inter, sans-serif`;
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
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-black p-4 sm:p-6 shadow-2xl transition-all duration-300",
        isFullscreen && "fixed inset-4 z-50 rounded-2xl",
        className
      )}
    >
      {/* Ambient Atmospheric Glow */}
      <div
        className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full blur-3xl opacity-30 transition-all duration-700"
        style={{ background: colorHex || "#5ef046" }}
      />
      <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-primary/10 blur-3xl" />

      {/* Top Header Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-2.5 items-center justify-center">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <span className="absolute size-2 rounded-full bg-emerald-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                Live 3D Studio Stage
              </span>
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-neutral-300 border border-white/10">
                Photorealistic
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {product?.name || "Product Showcase"} • {selectedColor?.name || "Original Color"}
            </p>
          </div>
        </div>

        {/* View Angle Switchers */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-white/5 p-1 border border-white/10">
          {(["front", "back", "detail", "isometric"] as AngleView[]).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => {
                setAngle(a);
                if (a === "detail") setZoom(1.8);
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
                "rounded-xl px-2.5 py-1 text-xs font-medium capitalize transition-all duration-200",
                angle === a
                  ? "bg-primary text-primary-foreground shadow-md font-semibold"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              )}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Utility Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Toggle Grid Alignment"
            onClick={() => setShowGrid(!showGrid)}
            className={cn(
              "rounded-xl p-2 text-xs transition-colors border",
              showGrid
                ? "bg-primary/20 text-primary border-primary/30"
                : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10"
            )}
          >
            <Layers className="size-4" />
          </button>
          <button
            type="button"
            title="Download High-Res Render"
            onClick={handleDownloadRender}
            className="rounded-xl bg-white/5 p-2 text-xs text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Download className="size-4" />
          </button>
          <button
            type="button"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Stage"}
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="rounded-xl bg-white/5 p-2 text-xs text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive 3D Canvas Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        className="relative mt-4 flex flex-1 min-h-[380px] sm:min-h-[460px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-radial from-neutral-900/60 to-black select-none cursor-grab active:cursor-grabbing perspective-[1200px]"
      >
        {/* Alignment Grid Overlay */}
        {showGrid && (
          <div className="pointer-events-none absolute inset-0 z-20 grid grid-cols-6 grid-rows-6 opacity-25">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="border border-dashed border-emerald-400/40" />
            ))}
          </div>
        )}

        {/* 3D Garment Platform / Shadow */}
        <div
          className="absolute bottom-6 h-12 w-3/4 rounded-[100%] bg-black/60 blur-2xl transition-all duration-300 pointer-events-none"
          style={{
            transform: `scale(${zoom}) translateX(${rotateY * 1.5}px)`,
          }}
        />

        {/* 3D Transformable Garment / Mockup Container */}
        <div
          className="relative size-full max-w-[480px] max-h-[480px] flex items-center justify-center transition-transform duration-200 ease-out will-change-transform"
          style={{
            transform: `scale(${zoom}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Base Product Photographic Image from Cloudinary */}
          {currentDisplayImage ? (
            <div className="relative size-full flex items-center justify-center p-4">
              <img
                src={currentDisplayImage}
                alt={product?.name || "Product Mockup"}
                className={cn(
                  "relative max-h-full max-w-full object-contain pointer-events-none transition-all duration-500",
                  lightingStyles
                )}
                draggable={false}
              />

              {/* Dynamic Realistic Color Tint Shader Overlay */}
              {selectedColor && colorHex && (
                <div
                  className="pointer-events-none absolute inset-4 rounded-xl mix-blend-color opacity-70 transition-all duration-300"
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

              {/* Realistic Fabric / Material Specular Highlight */}
              <div
                className="pointer-events-none absolute inset-4 mix-blend-overlay opacity-30 transition-all duration-300"
                style={{
                  background: `linear-gradient(${120 + rotateY * 2}deg, rgba(255,255,255,0.7) 0%, transparent 60%)`,
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500 gap-3">
              <Sparkles className="size-12 animate-pulse text-primary/60" />
              <p className="text-sm font-medium">Select a product to view 3D stage</p>
            </div>
          )}

          {/* Interactive Artwork & Logo Overlay on Garment */}
          <div
            className="absolute pointer-events-auto transition-transform duration-150 ease-out"
            style={{
              top: `${posY}%`,
              left: `${posX}%`,
              transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
              opacity: opacity,
            }}
          >
            {/* User Uploaded Logo or Default Graphic */}
            {customArtworkUrl ? (
              <div className={cn("relative group cursor-pointer", printShaderClass)}>
                <img
                  src={customArtworkUrl}
                  alt="Custom Artwork"
                  className="max-h-28 max-w-28 object-contain transition-all"
                  draggable={false}
                />
                <div className="absolute -inset-1 rounded border border-dashed border-primary/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ) : (
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center text-center select-none group cursor-pointer p-2",
                  printShaderClass
                )}
              >
                {/* Fallback Graphic Icon */}
                <svg viewBox="0 0 100 100" className="size-14 text-white/90 drop-shadow-md">
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
                    className="mt-1.5 font-bold tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                  >
                    {textVal}
                  </span>
                )}
                <div className="absolute -inset-1.5 rounded-lg border border-dashed border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Interactive Floating Zoom Controls */}
        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 rounded-xl bg-black/70 backdrop-blur-md px-2 py-1.5 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setZoom(Math.max(0.7, zoom - 0.2))}
            className="p-1 text-neutral-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="size-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-neutral-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(Math.min(2.5, zoom + 0.2))}
            className="p-1 text-neutral-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="size-3.5" />
          </button>
          <div className="h-3 w-px bg-white/20 mx-1" />
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setRotateX(0);
              setRotateY(0);
            }}
            className="p-1 text-neutral-300 hover:text-white transition-colors"
            title="Reset View"
          >
            <RefreshCw className="size-3.5" />
          </button>
        </div>

        {/* Live Shader Method Badge */}
        {selectedPrintMethod && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-xl bg-black/70 backdrop-blur-md px-3 py-1.5 border border-white/10 text-xs">
            <span className="size-2 rounded-full bg-primary" />
            <span className="font-medium text-neutral-200">{selectedPrintMethod.name} Shader</span>
          </div>
        )}
      </div>

      {/* Bottom Toolset Controls Tray */}
      <div className="mt-4 border-t border-white/10 pt-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {[
            { id: "artwork", label: "Logo & Placement", icon: ImageIcon },
            { id: "typography", label: "Typography", icon: Type },
            { id: "lighting", label: "Lighting Environment", icon: Sun },
            { id: "effects", label: "Shader Properties", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all",
                  activeTab === tab.id
                    ? "bg-white/15 text-white border border-white/20 shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                )}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Logo & Placement */}
        {activeTab === "artwork" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl bg-white/5 p-3.5 border border-white/10 text-xs">
            <div>
              <label className="text-neutral-400 font-medium block mb-1.5">Preset Placement</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "center", label: "Chest Center" },
                  { id: "left_chest", label: "Left Pocket" },
                  { id: "right_chest", label: "Right Pocket" },
                  { id: "full_back", label: "Full Back" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => handlePlacementChange(pos.id as any)}
                    className={cn(
                      "rounded-lg px-2 py-1 text-[11px] font-medium border text-center transition-all",
                      placement === pos.id
                        ? "bg-primary/20 text-primary border-primary/40"
                        : "bg-black/40 text-neutral-300 border-white/10 hover:border-white/20"
                    )}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Position Fine Tuning */}
            <div>
              <div className="flex justify-between text-neutral-400 font-medium mb-1">
                <span>Vertical Position (Y)</span>
                <span className="font-mono text-neutral-300">{posY}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={85}
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-neutral-400 font-medium mt-2 mb-1">
                <span>Horizontal Position (X)</span>
                <span className="font-mono text-neutral-300">{posX}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={80}
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Scale & Rotation */}
            <div>
              <div className="flex justify-between text-neutral-400 font-medium mb-1">
                <span>Scale Size</span>
                <span className="font-mono text-neutral-300">{scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={2.2}
                step={0.05}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-neutral-400 font-medium mt-2 mb-1">
                <span>Angle Rotation</span>
                <span className="font-mono text-neutral-300">{rotation}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sample Graphics Switcher */}
            <div>
              <label className="text-neutral-400 font-medium block mb-1.5">Sample Vectors</label>
              <div className="flex gap-2">
                {DEFAULT_LOGOS.map((logo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomArtworkUrl(logo.url)}
                    className="size-10 rounded-xl border border-white/10 overflow-hidden hover:border-primary transition-all p-0.5 bg-black/60"
                  >
                    <img src={logo.url} alt={logo.name} className="size-full object-cover rounded-lg" />
                  </button>
                ))}
                {customArtworkUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomArtworkUrl(null)}
                    className="px-2 py-1 rounded-xl border border-rose-500/30 text-rose-400 text-[10px] hover:bg-rose-500/10"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Typography */}
        {activeTab === "typography" && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl bg-white/5 p-3.5 border border-white/10 text-xs">
            <div>
              <label className="text-neutral-400 font-medium block mb-1.5">Custom Slogan / Text</label>
              <input
                type="text"
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                placeholder="Enter custom text..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1.5">Font Style</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-white focus:outline-none focus:border-primary"
              >
                <option value="Inter, sans-serif">Modern Sans (Inter)</option>
                <option value="'Impact', sans-serif">Bold Streetwear (Impact)</option>
                <option value="'Georgia', serif">Editorial Serif (Georgia)</option>
                <option value="'Courier New', monospace">Technical Mono (Courier)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-neutral-400 font-medium mb-1">
                <span>Text Size</span>
                <span className="font-mono text-neutral-300">{textSize}px</span>
              </div>
              <input
                type="range"
                min={12}
                max={48}
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-neutral-400 font-medium mt-2 mb-1">
                <span>Letter Spacing</span>
                <span className="font-mono text-neutral-300">{letterSpacing}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="text-neutral-400 font-medium block mb-1.5">Text Color</label>
              <div className="flex items-center gap-2">
                {["#ffffff", "#000000", "#eab308", "#dc2626", "#2563eb", "#5ef046"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTextColor(c)}
                    className={cn(
                      "size-7 rounded-full border transition-all",
                      textColor === c ? "border-primary scale-110 shadow-lg" : "border-white/20"
                    )}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Lighting Environment */}
        {activeTab === "lighting" && (
          <div className="grid gap-3 sm:grid-cols-4 rounded-2xl bg-white/5 p-3.5 border border-white/10 text-xs">
            {[
              { id: "studio", name: "Clean Daylight Studio", desc: "Balanced crisp lighting" },
              { id: "warm", name: "Golden Sunset Warm", desc: "Warm ambient key light" },
              { id: "cyber", name: "Cyberpunk Rim Glow", desc: "High vibrancy dual tone" },
              { id: "noir", name: "Dramatic Dark Noir", desc: "High contrast luxury shadows" },
            ].map((light) => (
              <button
                key={light.id}
                type="button"
                onClick={() => setLighting(light.id as any)}
                className={cn(
                  "rounded-xl p-3 text-left border transition-all",
                  lighting === light.id
                    ? "bg-primary/15 border-primary/40 text-white"
                    : "bg-black/40 border-white/10 text-neutral-300 hover:border-white/20"
                )}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Sun className="size-4 text-primary" />
                  <span>{light.name}</span>
                </div>
                <p className="mt-1 text-[11px] text-neutral-400">{light.desc}</p>
              </button>
            ))}
          </div>
        )}

        {/* Tab 4: Shader Properties */}
        {activeTab === "effects" && (
          <div className="grid gap-3 sm:grid-cols-3 rounded-2xl bg-white/5 p-3.5 border border-white/10 text-xs">
            <div>
              <div className="flex justify-between text-neutral-400 font-medium mb-1">
                <span>Ink / Thread Opacity</span>
                <span className="font-mono text-neutral-300">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.3}
                max={1.0}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-neutral-400 font-medium">Applied Simulation Technique</span>
              <span className="font-semibold text-emerald-400 mt-1">
                {selectedPrintMethod?.name || "Direct-to-Garment"} Displacement
              </span>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleDownloadRender}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Download className="size-3.5" />
                Download High-Res Spec Render
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
