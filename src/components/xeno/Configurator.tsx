"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Product, PrintingMethod, CustomizationOption } from "@/types/product";
import { useCustomizationOptions, usePreviewPrice } from "@/hooks/useCustomization";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { StudioTopBar } from "./studio/StudioTopBar";
import { StudioToolbar, StudioToolTab } from "./studio/StudioToolbar";
import { StudioToolPanel, DesignTemplate } from "./studio/StudioToolPanel";
import { StudioCanvas, PlacementPreset } from "./studio/StudioCanvas";
import { StudioOrderSummary } from "./studio/StudioOrderSummary";
import { StudioPreviewModal } from "./studio/StudioPreviewModal";
import { StudioMobileLayout } from "./studio/StudioMobileLayout";

interface ConfiguratorProps {
  products: Product[];
  printingMethods: PrintingMethod[];
  customizationOptions: CustomizationOption[];
  initialProductSlug?: string | undefined;
  initialVariantId?: number | undefined;
}

export function Configurator({
  products,
  printingMethods,
  customizationOptions,
  initialProductSlug,
  initialVariantId,
}: ConfiguratorProps) {
  const { mutate: previewPrice, data: priceData, isPending: isPricing } = usePreviewPrice();
  const { addItem, isAdding } = useCart();

  // Active Tool state (Default to "colors" or "templates")
  const [activeTab, setActiveTab] = useState<StudioToolTab | null>("colors");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Active Product Selection with deep-link resolution
  const [product, setProduct] = useState<Product | null>(() => {
    if (initialProductSlug && products.length > 0) {
      const matched = products.find(
        (p) => p.slug === initialProductSlug || String(p.id) === initialProductSlug
      );
      if (matched) return matched;
    }
    return products[0] || null;
  });

  // Selected Variant (Color + Size + Material)
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  // Customization Selections
  const [selectedPrintMethod, setSelectedPrintMethod] = useState<PrintingMethod | null>(
    printingMethods[0] || null
  );
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(50);

  // Artwork & Typography States
  const [artworkFiles, setArtworkFiles] = useState<File[]>([]);
  const [customArtworkUrl, setCustomArtworkUrl] = useState<string | null>(null);

  const [showText, setShowText] = useState(true);
  const [textVal, setTextVal] = useState("XENO CRAFT");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(24);
  const [letterSpacing, setLetterSpacing] = useState(2);

  // Placement & Transform States
  const [placement, setPlacement] = useState<PlacementPreset>("center");
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(42);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.95);

  // Responsive Breakpoint check (Mobile vs Desktop)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Sync initial product if changed asynchronously
  useEffect(() => {
    if (initialProductSlug && products.length > 0) {
      const matched = products.find(
        (p) => p.slug === initialProductSlug || String(p.id) === initialProductSlug
      );
      if (matched) {
        setProduct(matched);
      }
    }
  }, [initialProductSlug, products]);

  // Extract variants, colors, sizes, materials
  const variants = product?.variants || [];

  const colors = useMemo(() => {
    const colorMap = new Map();
    variants.forEach((v: any) => {
      if (v.color && !colorMap.has(v.color.id)) {
        colorMap.set(v.color.id, v.color);
      }
    });
    return Array.from(colorMap.values());
  }, [variants]);

  const sizes = useMemo(() => {
    const sizeMap = new Map();
    variants.forEach((v: any) => {
      if (v.size && !sizeMap.has(v.size.id)) {
        sizeMap.set(v.size.id, v.size);
      }
    });
    return Array.from(sizeMap.values());
  }, [variants]);

  const materials = useMemo(() => {
    const materialMap = new Map();
    variants.forEach((v: any) => {
      if (v.material && !materialMap.has(v.material.id)) {
        materialMap.set(v.material.id, v.material);
      }
    });
    return Array.from(materialMap.values());
  }, [variants]);

  // Auto-select first variant or match initialVariantId
  useEffect(() => {
    if (product && variants.length > 0) {
      if (initialVariantId) {
        const matched = variants.find((v: any) => v.id === initialVariantId);
        if (matched) {
          setSelectedVariant(matched);
          return;
        }
      }
      setSelectedVariant(variants[0]);
    }
  }, [product, variants, initialVariantId]);

  // Calculate Price Tiers
  const tiers = useMemo(() => {
    const priceTiers = product?.price_tiers || [];
    if (priceTiers.length > 0) {
      return priceTiers.map((t: any) => t.min_quantity).sort((a: number, b: number) => a - b);
    }
    return [10, 25, 50, 100, 250, 500];
  }, [product]);

  // Ensure initial MOQ is respected
  useEffect(() => {
    const moq = product?.moq || 1;
    if (qty < moq) {
      setQty(moq);
    }
  }, [product, qty]);

  // Sync live price from backend
  useEffect(() => {
    if (!product || !selectedVariant || !selectedPrintMethod) return;

    previewPrice({
      product_id: product.id,
      variant_id: selectedVariant.id,
      printing_method_id: selectedPrintMethod.id,
      quantity: qty,
    });
  }, [product, selectedVariant, selectedPrintMethod, qty, previewPrice]);

  // Sync artwork object URL
  useEffect(() => {
    if (artworkFiles && artworkFiles.length > 0) {
      const file = artworkFiles[artworkFiles.length - 1];
      if (file) {
        const objUrl = URL.createObjectURL(file);
        setCustomArtworkUrl(objUrl);
        return () => URL.revokeObjectURL(objUrl);
      }
    }
    return undefined;
  }, [artworkFiles]);

  // Handle Variant Selection
  const handleVariantSelect = (colorId: number, sizeId: number, materialId: number) => {
    const variant = variants.find(
      (v: any) =>
        (colorId === undefined || v.color_id === colorId) &&
        (sizeId === undefined || v.size_id === sizeId) &&
        (materialId === undefined || v.material_id === materialId)
    );
    if (variant) {
      setSelectedVariant(variant);
    } else {
      // Fallback matching color
      const fallback = variants.find((v: any) => v.color_id === colorId) || variants[0];
      if (fallback) setSelectedVariant(fallback);
    }
  };

  // Placement Change handler
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

  // Apply Template Preset
  const handleApplyTemplate = (template: DesignTemplate) => {
    setCustomArtworkUrl(template.previewUrl);
    setTextVal(template.text);
    setFontFamily(template.fontFamily);
    setTextColor(template.textColor);
    handlePlacementChange(template.placement);
    setScale(template.scale);
    setShowText(true);
  };

  // Upload & Remove Artwork
  const handleUploadArtwork = (files: File[]) => {
    setArtworkFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveArtwork = (index: number) => {
    setArtworkFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setCustomArtworkUrl(null);
      return next;
    });
  };

  // Add To Cart Dispatch
  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedPrintMethod) {
      toast.error("Please complete all product and customization selections");
      return;
    }

    const moq = product.moq || 1;
    if (qty < moq) {
      toast.error(`Minimum order quantity for this item is ${moq} units.`);
      return;
    }

    addItem(
      {
        product_id: product.id,
        variant_id: selectedVariant.id,
        quantity: qty,
        customization: {
          product: product.name,
          variant: `${selectedVariant.color?.name || ""} / ${selectedVariant.size?.name || ""}`,
          print_method: selectedPrintMethod.name,
          color: selectedVariant.color?.name,
          size: selectedVariant.size?.name,
          material: selectedVariant.material?.name,
          options: selectedOptions,
          artwork_count: artworkFiles.length,
          custom_text: showText ? textVal : undefined,
          placement: placement,
          scale: scale,
          rotation: rotation,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Customized ${qty} × ${product.name} added to cart!`);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to add customized item to cart");
        },
      }
    );
  };

  const selectedColor = selectedVariant?.color;
  const selectedSize = selectedVariant?.size;
  const selectedMaterial = selectedVariant?.material;

  // Render Mobile Layout on small screens
  if (isMobile) {
    return (
      <StudioMobileLayout
        products={products}
        currentProduct={product}
        onSelectProduct={(p) => setProduct(p)}
        selectedVariant={selectedVariant}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        selectedMaterial={selectedMaterial}
        colors={colors}
        sizes={sizes}
        materials={materials}
        onSelectVariant={handleVariantSelect}
        printingMethods={printingMethods}
        selectedPrintMethod={selectedPrintMethod}
        onSelectPrintMethod={setSelectedPrintMethod}
        customizationOptions={customizationOptions}
        selectedOptions={selectedOptions}
        onOptionChange={(code, val) =>
          setSelectedOptions((prev) => ({ ...prev, [code]: val }))
        }
        artworkFiles={artworkFiles}
        onUploadArtwork={handleUploadArtwork}
        onRemoveArtwork={handleRemoveArtwork}
        customArtworkUrl={customArtworkUrl}
        onSelectSampleGraphic={(url) => setCustomArtworkUrl(url)}
        onClearArtwork={() => setCustomArtworkUrl(null)}
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
        onPlacementChange={handlePlacementChange}
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
        onApplyTemplate={handleApplyTemplate}
        qty={qty}
        setQty={setQty}
        tiers={tiers}
        priceData={priceData}
        isPricing={isPricing}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
      />
    );
  }

  // Desktop 3-Column Professional Studio Layout
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground select-none">
      {/* Top Bar */}
      <StudioTopBar
        products={products}
        currentProduct={product}
        onSelectProduct={(p) => setProduct(p)}
        onOpenPreview={() => setShowPreviewModal(true)}
        saveStatus="saved"
      />

      {/* Main Workspace (3-Column Layout: Left Tools 20%, Center Canvas 60%, Right Summary 20%) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar (Icons) */}
        <StudioToolbar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(activeTab === tab ? null : tab)}
          artworkCount={artworkFiles.length}
        />

        {/* Left Contextual Tool Controls Panel (Collapsible) */}
        <StudioToolPanel
          activeTab={activeTab}
          onClose={() => setActiveTab(null)}
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          selectedMaterial={selectedMaterial}
          colors={colors}
          sizes={sizes}
          materials={materials}
          onSelectVariant={handleVariantSelect}
          printingMethods={printingMethods}
          selectedPrintMethod={selectedPrintMethod}
          onSelectPrintMethod={setSelectedPrintMethod}
          customizationOptions={customizationOptions}
          selectedOptions={selectedOptions}
          onOptionChange={(code, val) =>
            setSelectedOptions((prev) => ({ ...prev, [code]: val }))
          }
          artworkFiles={artworkFiles}
          onUploadArtwork={handleUploadArtwork}
          onRemoveArtwork={handleRemoveArtwork}
          customArtworkUrl={customArtworkUrl}
          onSelectSampleGraphic={(url) => setCustomArtworkUrl(url)}
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
          onPlacementChange={handlePlacementChange}
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
          onApplyTemplate={handleApplyTemplate}
        />

        {/* Center Hero Canvas (60% dominant visual workspace) */}
        <StudioCanvas
          product={product}
          selectedColor={selectedColor}
          selectedPrintMethod={selectedPrintMethod}
          customArtworkUrl={customArtworkUrl}
          onClearArtwork={() => setCustomArtworkUrl(null)}
          showText={showText}
          textVal={textVal}
          fontFamily={fontFamily}
          textColor={textColor}
          textSize={textSize}
          letterSpacing={letterSpacing}
          placement={placement}
          onPlacementChange={handlePlacementChange}
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
        />

        {/* Right Design Summary & Bulk Order Configuration (20%) */}
        <StudioOrderSummary
          product={product}
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
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Fullscreen Preview Modal */}
      <StudioPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        product={product}
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
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}