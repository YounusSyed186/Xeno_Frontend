"use client";

import React, { useRef } from "react";
import { StudioToolTab } from "./StudioToolbar";
import { Product, PrintingMethod, CustomizationOption } from "@/types/product";
import { cn } from "@/lib/utils";
import {
  X,
  Upload,
  Trash2,
  Plus,
  Type,
  Move,
  Layers,
  Sparkles,
  Sliders,
  Palette,
  Check,
  Eye,
  EyeOff,
  ChevronRight,
  Info,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";

export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  tagline: string;
  text: string;
  fontFamily: string;
  textColor: string;
  placement: "center" | "left_chest" | "right_chest" | "full_back";
  scale: number;
}

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: "cyber-punk",
    name: "Cyber Brand Emblem",
    category: "Streetwear",
    previewUrl: "/logos/Xeno craft trasparent green gradient.png",
    tagline: "High-voltage neo Tokyo aesthetic",
    text: "XENO / NEURAL",
    fontFamily: "'Impact', sans-serif",
    textColor: "#5ef046",
    placement: "center",
    scale: 1.1,
  },
  {
    id: "minimal-crest",
    name: "Minimalist Crest",
    category: "Luxury",
    previewUrl: "/logos/Xeno craft trasparent white.png",
    tagline: "Subtle architectural luxury",
    text: "ARCHIVE 2026",
    fontFamily: "'Georgia', serif",
    textColor: "#ffffff",
    placement: "left_chest",
    scale: 0.65,
  },
  {
    id: "monochrome-wolf",
    name: "Geometric Beast",
    category: "Artistic",
    previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
    tagline: "Bold geometric vector graphic",
    text: "WOLF OF XENO",
    fontFamily: "Inter, sans-serif",
    textColor: "#ffffff",
    placement: "full_back",
    scale: 1.3,
  },
  {
    id: "tech-mono",
    name: "Spec Blueprint",
    category: "Technical",
    previewUrl: "/logos/Xeno craft Green.png",
    tagline: "Industrial blueprint specifications",
    text: "SYS.V1 // OVERSIZED",
    fontFamily: "'Courier New', monospace",
    textColor: "#5ef046",
    placement: "center",
    scale: 0.9,
  },
];

export const SAMPLE_GRAPHICS = [
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

interface StudioToolPanelProps {
  activeTab: StudioToolTab | null;
  onClose: () => void;
  product: Product | null;
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
  placement: "center" | "left_chest" | "right_chest" | "full_back" | "bottom_hem";
  onPlacementChange: (p: any) => void;
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
  className?: string;
}

export function StudioToolPanel({
  activeTab,
  onClose,
  product,
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
  className,
}: StudioToolPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!activeTab) return null;

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter((f) => {
        if (f.size > 10 * 1024 * 1024) {
          toast.error(`File "${f.name}" exceeds 10MB limit.`);
          return false;
        }
        return true;
      });
      if (validFiles.length > 0) {
        onUploadArtwork(validFiles);
        toast.success(`Uploaded ${validFiles.length} file(s)`);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      onUploadArtwork(files);
      toast.success(`Uploaded ${files.length} file(s)`);
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case "templates":
        return "Starter Templates";
      case "upload":
        return "Upload Artwork";
      case "text":
        return "Typography & Slogan";
      case "graphics":
        return "Graphics & Vectors";
      case "colors":
        return "Apparel Specifications";
      case "print":
        return "Print Technique";
      case "placement":
        return "Position & Layout";
      case "layers":
        return "Design Layers";
      case "options":
        return "Custom Specifications";
      default:
        return "Tool Controls";
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case "templates":
        return "One-click curated design foundations";
      case "upload":
        return "Vector or high-res artwork files";
      case "text":
        return "Add customizable slogans and branding text";
      case "graphics":
        return "XenoCraft vector emblems and icons";
      case "colors":
        return "Choose garment color, size, and fabric";
      case "print":
        return "Select print simulation method";
      case "placement":
        return "Adjust position, scale, and alignment";
      case "layers":
        return "Manage visual elements and stacking";
      case "options":
        return "Tailored garment manufacturing details";
      default:
        return "";
    }
  };

  return (
    <aside
      className={cn(
        "w-80 sm:w-88 shrink-0 border-r border-white/10 bg-neutral-950/90 backdrop-blur-2xl flex flex-col z-20 transition-all duration-300 select-none overflow-hidden",
        className
      )}
    >
      {/* Panel Header */}
      <div className="h-14 shrink-0 px-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase font-bold tracking-wider text-foreground">
            {getTitle()}
          </h3>
          <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
            {getSubtitle()}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="size-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Close panel"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Panel Body (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* ========================================================================= */}
        {/* 1. TEMPLATES */}
        {/* ========================================================================= */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-primary/10 border border-primary/20 p-3 text-xs text-primary leading-relaxed flex items-start gap-2.5">
              <Sparkles className="size-4 shrink-0 mt-0.5" />
              <span>
                Select a starter style to instantly populate artwork, typography, and placements.
              </span>
            </div>

            <div className="grid gap-3">
              {DESIGN_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="group relative rounded-2xl border border-white/10 bg-white/5 p-3 hover:border-primary/50 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    onApplyTemplate(tmpl);
                    toast.success(`Applied "${tmpl.name}" template`);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-14 rounded-xl bg-black/60 border border-white/10 p-1.5 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/40 transition-colors">
                      <img
                        src={tmpl.previewUrl}
                        alt={tmpl.name}
                        className="size-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                          {tmpl.category}
                        </span>
                        <ChevronRight className="size-3.5 text-neutral-500 group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="text-xs font-semibold text-foreground truncate mt-0.5">
                        {tmpl.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {tmpl.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. UPLOAD ARTWORK */}
        {/* ========================================================================= */}
        {activeTab === "upload" && (
          <div className="space-y-5">
            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/60 bg-white/5 hover:bg-primary/5 p-6 text-center transition-all duration-200 cursor-pointer group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/40 transition-all duration-200">
                <Upload className="size-5 text-neutral-400 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-xs font-semibold text-foreground mt-3">
                Click or drag artwork here
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                PNG, JPG, SVG, PDF, AI, EPS • Max 10MB
              </p>
              <button
                type="button"
                className="mt-4 rounded-xl bg-white/10 group-hover:bg-primary group-hover:text-neutral-950 px-3.5 py-1.5 text-xs font-semibold text-neutral-200 transition-all cursor-pointer"
              >
                Browse Files
              </button>
            </div>

            {/* Uploaded Files List */}
            {artworkFiles.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
                  <span>Uploaded Files ({artworkFiles.length})</span>
                </div>
                <div className="space-y-2">
                  {artworkFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shrink-0">
                          <ImageIcon className="size-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-foreground max-w-[150px]">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveArtwork(idx);
                        }}
                        className="size-7 rounded-lg text-neutral-400 hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-white/5 bg-white/5 p-3.5 text-center text-xs text-neutral-400">
                <p>No custom files uploaded yet.</p>
                <p className="text-[11px] text-neutral-500 mt-1">
                  You can also use sample vectors from the Graphics tool.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. TEXT & TYPOGRAPHY */}
        {/* ========================================================================= */}
        {activeTab === "text" && (
          <div className="space-y-5 text-xs">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
              <span className="font-medium text-foreground">Display Custom Text</span>
              <button
                type="button"
                onClick={() => setShowText(!showText)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  showText ? "bg-primary" : "bg-neutral-800"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block size-4 transform rounded-full bg-neutral-950 shadow-sm transition duration-200 ease-in-out",
                    showText ? "translate-x-4" : "translate-x-0 bg-neutral-400"
                  )}
                />
              </button>
            </div>

            {/* Slogan Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Text / Slogan
              </label>
              <input
                type="text"
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                placeholder="Type your slogan or text..."
                className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Typography Font
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="Inter, sans-serif">Modern Sans (Inter)</option>
                <option value="'Impact', sans-serif">Bold Streetwear (Impact)</option>
                <option value="'Georgia', serif">Editorial Serif (Georgia)</option>
                <option value="'Courier New', monospace">Technical Mono (Courier)</option>
              </select>
            </div>

            {/* Font Size & Spacing */}
            <div className="space-y-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
              <div>
                <div className="flex justify-between text-neutral-400 mb-1.5">
                  <span className="font-medium">Font Size</span>
                  <span className="font-mono text-neutral-200">{textSize}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={48}
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1.5">
                  <span className="font-medium">Letter Spacing</span>
                  <span className="font-mono text-neutral-200">{letterSpacing}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Text Color Swatches */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Text Color
              </label>
              <div className="flex flex-wrap gap-2.5">
                {[
                  { name: "White", hex: "#ffffff" },
                  { name: "Black", hex: "#000000" },
                  { name: "Neon Green", hex: "#5ef046" },
                  { name: "Cyber Amber", hex: "#eab308" },
                  { name: "Electric Blue", hex: "#2563eb" },
                  { name: "Crimson Red", hex: "#dc2626" },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setTextColor(c.hex)}
                    className={cn(
                      "size-8 rounded-full border transition-all cursor-pointer relative flex items-center justify-center",
                      textColor === c.hex
                        ? "border-primary ring-2 ring-primary/40 scale-110"
                        : "border-white/20 hover:border-white/50"
                    )}
                    style={{ background: c.hex }}
                    title={c.name}
                  >
                    {textColor === c.hex && (
                      <Check
                        className={cn(
                          "size-3.5",
                          c.hex === "#ffffff" || c.hex === "#5ef046" || c.hex === "#eab308"
                            ? "text-neutral-950"
                            : "text-white"
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. GRAPHICS & SAMPLE VECTORS */}
        {/* ========================================================================= */}
        {activeTab === "graphics" && (
          <div className="space-y-4">
            <p className="text-xs text-neutral-400 leading-relaxed">
              Choose from official XenoCraft brand assets and geometric vectors.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {SAMPLE_GRAPHICS.map((g, idx) => {
                const isSelected = customArtworkUrl === g.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectSampleGraphic(g.url);
                      toast.success(`Selected ${g.name}`);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "bg-primary/15 border-primary text-primary shadow-sm"
                        : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10 text-neutral-300"
                    )}
                  >
                    <div className="size-14 rounded-xl bg-black/70 border border-white/10 p-2 flex items-center justify-center overflow-hidden mb-2">
                      <img
                        src={g.url}
                        alt={g.name}
                        className="size-full object-contain"
                      />
                    </div>
                    <span className="text-[11px] font-semibold truncate max-w-full">
                      {g.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {customArtworkUrl && (
              <button
                type="button"
                onClick={() => onSelectSampleGraphic(null)}
                className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 py-2.5 text-xs font-semibold text-rose-400 transition-colors cursor-pointer"
              >
                Clear Selected Graphic
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. APPAREL SPECS (COLOR, SIZE, FABRIC) */}
        {/* ========================================================================= */}
        {activeTab === "colors" && (
          <div className="space-y-5 text-xs">
            {/* Color Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Garment Color
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {selectedColor?.name || "Standard"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => {
                  const isSelected = selectedColor?.id === c.id;
                  const bg = c.hex || c.css || "#000000";
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() =>
                        onSelectVariant(c.id, selectedSize?.id, selectedMaterial?.id)
                      }
                      className={cn(
                        "size-9 rounded-full border transition-all cursor-pointer relative flex items-center justify-center",
                        isSelected
                          ? "border-primary ring-2 ring-primary/40 scale-110 shadow-lg"
                          : "border-white/20 hover:border-white/40"
                      )}
                      style={{ background: bg }}
                      title={c.name}
                    >
                      {isSelected && (
                        <Check
                          className={cn(
                            "size-4",
                            bg === "#ffffff" || bg === "#fff"
                              ? "text-neutral-950"
                              : "text-white"
                          )}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Size
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {selectedSize?.name || "M"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => {
                  const isSelected = selectedSize?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() =>
                        onSelectVariant(selectedColor?.id, s.id, selectedMaterial?.id)
                      }
                      className={cn(
                        "min-w-11 h-9 rounded-xl px-3 text-xs font-semibold transition-all cursor-pointer border",
                        isSelected
                          ? "bg-primary text-neutral-950 border-primary shadow-sm"
                          : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Material / Fabric Selector */}
            {materials.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Fabric & Material
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {selectedMaterial?.name || "Cotton"}
                  </span>
                </div>
                <div className="space-y-2">
                  {materials.map((m) => {
                    const isSelected = selectedMaterial?.id === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          onSelectVariant(selectedColor?.id, selectedSize?.id, m.id)
                        }
                        className={cn(
                          "w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-all cursor-pointer border",
                          isSelected
                            ? "bg-primary/15 border-primary text-primary font-semibold"
                            : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10"
                        )}
                      >
                        <span>{m.name}</span>
                        {isSelected && <Check className="size-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. PRINT TECHNIQUE */}
        {/* ========================================================================= */}
        {activeTab === "print" && (
          <div className="space-y-4 text-xs">
            <p className="text-neutral-400 leading-relaxed">
              Different printing techniques alter the physical texture and live shader simulation on the garment.
            </p>

            <div className="space-y-2.5">
              {printingMethods.map((pm) => {
                const isSelected = selectedPrintMethod?.id === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      onSelectPrintMethod(pm);
                      toast.success(`Selected "${pm.name}" print method`);
                    }}
                    className={cn(
                      "w-full rounded-2xl p-3.5 text-left border transition-all duration-200 cursor-pointer",
                      isSelected
                        ? "bg-primary/15 border-primary text-white shadow-sm"
                        : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-foreground">
                        {pm.name}
                      </h4>
                      {isSelected && <Check className="size-4 text-primary" />}
                    </div>
                    {pm.description && (
                      <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                        {pm.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. POSITION & LAYOUT */}
        {/* ========================================================================= */}
        {activeTab === "placement" && (
          <div className="space-y-5 text-xs">
            {/* Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Preset Placement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "center", label: "Center Chest" },
                  { id: "left_chest", label: "Left Pocket" },
                  { id: "right_chest", label: "Right Pocket" },
                  { id: "full_back", label: "Full Back" },
                  { id: "bottom_hem", label: "Bottom Hem" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => onPlacementChange(pos.id as any)}
                    className={cn(
                      "rounded-xl px-3 py-2 text-xs font-medium border text-center transition-all cursor-pointer",
                      placement === pos.id
                        ? "bg-primary text-neutral-950 font-bold border-primary shadow-xs"
                        : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
                    )}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fine Tuning Offsets */}
            <div className="space-y-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
              <div>
                <div className="flex justify-between text-neutral-400 mb-1.5">
                  <span className="font-medium">Vertical Y-Offset</span>
                  <span className="font-mono text-neutral-200">{posY}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={85}
                  value={posY}
                  onChange={(e) => setPosY(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1.5">
                  <span className="font-medium">Horizontal X-Offset</span>
                  <span className="font-mono text-neutral-200">{posX}%</span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={85}
                  value={posX}
                  onChange={(e) => setPosX(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Scale, Rotation & Opacity */}
            <div className="space-y-3 rounded-xl bg-white/5 border border-white/10 p-3.5">
              <div>
                <div className="flex justify-between text-neutral-400 mb-1.5">
                  <span className="font-medium">Scale Size</span>
                  <span className="font-mono text-neutral-200">{scale.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={2.5}
                  step={0.05}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-neutral-400 mb-1.5">
                  <span className="font-medium">Angle Rotation</span>
                  <span className="font-mono text-neutral-200">{rotation}°</span>
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

              <div>
                <div className="flex justify-between text-neutral-400 mb-1.5">
                  <span className="font-medium">Shader Opacity</span>
                  <span className="font-mono text-neutral-200">{Math.round(opacity * 100)}%</span>
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
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. LAYERS */}
        {/* ========================================================================= */}
        {activeTab === "layers" && (
          <div className="space-y-4 text-xs">
            <p className="text-neutral-400 leading-relaxed">
              Review and manage all visual design layers on your customizable garment.
            </p>

            <div className="space-y-2">
              {/* Layer 1: Garment Base */}
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="size-4 rounded-full border border-white/20 shrink-0"
                    style={{ background: selectedColor?.hex || "#000000" }}
                  />
                  <div>
                    <p className="font-semibold text-foreground">Apparel Base</p>
                    <p className="text-[10px] text-neutral-400">
                      {product?.name || "Garment"} ({selectedColor?.name || "Original"})
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-neutral-500">
                  Base
                </span>
              </div>

              {/* Layer 2: Graphic/Artwork */}
              {(customArtworkUrl || artworkFiles.length > 0) && (
                <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ImageIcon className="size-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        Custom Artwork / Vector
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {scale.toFixed(1)}x • {rotation}° • {placement}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectSampleGraphic(null)}
                    className="size-7 rounded-lg text-neutral-400 hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove graphic"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Layer 3: Typography */}
              {showText && textVal && (
                <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Type className="size-4 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        "{textVal}"
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {textSize}px • {textColor}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowText(false)}
                    className="size-7 rounded-lg text-neutral-400 hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                    title="Hide text"
                  >
                    <EyeOff className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Layer 4: Simulation Shader */}
              <div className="flex items-center justify-between rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex items-center gap-2.5">
                  <Sliders className="size-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedPrintMethod?.name || "Direct-to-Garment"} Shader
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Displacement blend @ {Math.round(opacity * 100)}%
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">
                  Shader
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 9. CUSTOM OPTIONS (API DYNAMIC) */}
        {/* ========================================================================= */}
        {activeTab === "options" && (
          <div className="space-y-4 text-xs">
            {customizationOptions.length > 0 ? (
              <div className="space-y-4">
                {customizationOptions.map((opt) => (
                  <div key={opt.id} className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      {opt.name}
                    </label>
                    {opt.type === "select" && (opt as any).values && (
                      <select
                        value={selectedOptions[opt.code] || ""}
                        onChange={(e) => onOptionChange(opt.code, e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        <option value="">Select option...</option>
                        {(opt as any).values.map((v: any) => (
                          <option key={v.value || v} value={v.value || v}>
                            {v.label || v.value || v}
                          </option>
                        ))}
                      </select>
                    )}
                    {opt.type === "text" && (
                      <input
                        type="text"
                        value={selectedOptions[opt.code] || ""}
                        onChange={(e) => onOptionChange(opt.code, e.target.value)}
                        placeholder={(opt as any).description || `Enter ${opt.name}`}
                        className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary transition-colors"
                      />
                    )}
                    {opt.type === "boolean" && (
                      <label className="flex items-center gap-2.5 cursor-pointer rounded-xl bg-white/5 border border-white/10 p-3">
                        <input
                          type="checkbox"
                          checked={selectedOptions[opt.code] === "true"}
                          onChange={(e) =>
                            onOptionChange(opt.code, e.target.checked ? "true" : "false")
                          }
                          className="size-4 rounded border-white/20 bg-black text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-medium text-foreground">
                          Enable {opt.name}
                        </span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/5 bg-white/5 p-4 text-center text-xs text-neutral-400">
                <Info className="size-5 mx-auto mb-2 text-neutral-500" />
                <p>No additional dynamic custom fields for this product catalog entry.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
