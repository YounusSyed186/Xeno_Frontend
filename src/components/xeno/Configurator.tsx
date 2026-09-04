"use client";

import { useMemo, useState, useEffect } from "react";
import { Reveal, SectionHeading } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { cn } from "@/lib/utils";
import { useCustomizationOptions, usePreviewPrice } from "@/hooks/useCustomization";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product";
import { CustomizationOption, PrintingMethod } from "@/types/product";
import { toast } from "sonner";

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
  const { data: optionsData } = useCustomizationOptions();
  const { mutate: previewPrice, data: priceData, isPending: isPricing } = usePreviewPrice();
  const { addItem, isAdding } = useCart();

  // Product state with deep-link resolution
  const [product, setProduct] = useState<Product | null>(() => {
    if (initialProductSlug && products.length > 0) {
      const matched = products.find(
        (p) => p.slug === initialProductSlug || String(p.id) === initialProductSlug
      );
      if (matched) return matched;
    }
    return products[0] || null;
  });
  
  // Selected variant (color + size + material)
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  
  // Customization selections
  const [selectedPrintMethod, setSelectedPrintMethod] = useState<PrintingMethod | null>(printingMethods[0] || null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(50);
  
  // Artwork uploads
  const [artworkFiles, setArtworkFiles] = useState<File[]>([]);

  // Sync initial product if changed or loaded asynchronously
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

  // Get available variants for current product
  const variants = product?.variants || [];
  
  // Get unique colors, sizes, materials from variants
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

  // Auto-select first variant when product changes or match initialVariantId
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

  // Calculate price tiers from product
  const tiers = useMemo(() => {
    const priceTiers = product?.price_tiers || [];
    if (priceTiers.length > 0) {
      return priceTiers.map((t: any) => t.min_quantity).sort((a: number, b: number) => a - b);
    }
    // Fallback to standard tiers if no price tiers
    return [25, 50, 100, 250, 500, 1000];
  }, [product]);

  // Auto-adjust qty to nearest valid tier
  useEffect(() => {
    if (tiers.length > 0 && !tiers.includes(qty)) {
      const nearest = tiers.reduce((prev, curr) => 
        Math.abs(curr - qty) < Math.abs(prev - qty) ? curr : prev
      );
      setQty(nearest);
    }
  }, [tiers, qty]);

  // Fetch live price from backend
  useEffect(() => {
    if (!product || !selectedVariant || !selectedPrintMethod) return;
    
    const payload = {
      product_id: product.id,
      variant_id: selectedVariant.id,
      printing_method_id: selectedPrintMethod.id,
      quantity: qty,
    };
    
    previewPrice(payload);
  }, [product, selectedVariant, selectedPrintMethod, qty, previewPrice]);

  // Handle variant selection (color + size + material combo)
  const handleVariantSelect = (colorId: number, sizeId: number, materialId: number) => {
    const variant = variants.find((v: any) => 
      v.color_id === colorId && v.size_id === sizeId && v.material_id === materialId
    );
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  // Handle customization option change
  const handleOptionChange = (optionCode: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionCode]: value }));
  };

  // Handle artwork upload
  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setArtworkFiles(prev => [...prev, ...files]);
  };

  // Remove artwork
  const removeArtwork = (index: number) => {
    setArtworkFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedPrintMethod) {
      toast.error("Please complete all selections");
      return;
    }

    addItem(
      {
        product_id: product.id,
        variant_id: selectedVariant.id,
        quantity: qty,
        customization: {
          product: product.name,
          variant: `${selectedVariant.color?.name || ''} / ${selectedVariant.size?.name || ''}`,
          print_method: selectedPrintMethod.name,
          color: selectedVariant.color?.name,
          size: selectedVariant.size?.name,
          material: selectedVariant.material?.name,
          options: selectedOptions,
          artwork_count: artworkFiles.length,
        },
      },
      {
        onSuccess: () => {
          toast.success(`Customised ${qty} × ${product.name} added to cart!`);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to add customised item to cart");
        },
      }
    );
  };

  const pricing = (priceData as any)?.data || (priceData as any);
  const unitPrice = pricing?.unit_price || product?.base_price || 0;
  const totalPrice = pricing?.line_total || (unitPrice * qty);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  // Get selected color/size/material for display
  const selectedColor = selectedVariant?.color;
  const selectedSize = selectedVariant?.size;
  const selectedMaterial = selectedVariant?.material;

  return (
    <section id="configurator" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <SectionHeading
        eyebrow="Configurator"
        title={<>Build it, <span className="text-gradient">price it, instantly</span></>}
        copy="Pick your spec and see a live preview with an indicative quote before you talk to us."
      />

      <Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          {/* controls */}
          <div className="rounded-3xl hairline bg-card p-6 sm:p-8">
            {/* Product Selector */}
            <Field label="Product">
              <div className="flex flex-wrap gap-2">
                {products.map((p) => (
                  <Chip
                    key={p.id}
                    active={product?.id === p.id}
                    onClick={() => setProduct(p)}
                  >
                    {p.name}
                  </Chip>
                ))}
              </div>
            </Field>

            {/* Variant Selector - Color, Size, Material */}
            {variants.length > 0 && (
              <>
                <Field label="Colour">
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-label={c.name}
                        aria-pressed={selectedColor?.id === c.id}
                        onClick={() => handleVariantSelect(c.id, selectedSize?.id, selectedMaterial?.id)}
                        className={cn(
                          "size-11 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          selectedColor?.id === c.id
                            ? "border-primary shadow-[var(--glow-accent)]"
                            : "border-border hover:border-primary/40",
                        )}
                        style={{ background: c.hex || c.css || "#000" }}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Size">
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <Chip
                        key={s.id}
                        active={selectedSize?.id === s.id}
                        onClick={() => handleVariantSelect(selectedColor?.id, s.id, selectedMaterial?.id)}
                      >
                        {s.name}
                      </Chip>
                    ))}
                  </div>
                </Field>

                <Field label="Material / Fabric">
                  <div className="flex flex-wrap gap-2">
                    {materials.map((m) => (
                      <Chip
                        key={m.id}
                        active={selectedMaterial?.id === m.id}
                        onClick={() => handleVariantSelect(selectedColor?.id, selectedSize?.id, m.id)}
                      >
                        {m.name}
                      </Chip>
                    ))}
                  </div>
                </Field>
              </>
            )}

            {/* Print Method */}
            <Field label="Print Type">
              <div className="flex flex-wrap gap-2">
                {printingMethods.map((p) => (
                  <Chip
                    key={p.id}
                    active={selectedPrintMethod?.id === p.id}
                    onClick={() => setSelectedPrintMethod(p)}
                  >
                    {p.name}
                  </Chip>
                ))}
              </div>
            </Field>

            {/* Customization Options */}
            {customizationOptions.length > 0 && (
              <Field label="Custom Options">
                <div className="space-y-3">
                  {customizationOptions.map((opt) => (
                    <div key={opt.id} className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">{opt.name}</label>
                      {opt.type === "select" && (opt as any).values && (
                        <select
                          value={selectedOptions[opt.code] || ""}
                          onChange={(e) => handleOptionChange(opt.code, e.target.value)}
                          className="w-full rounded-xl border border-border/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">Select...</option>
                          {(opt as any).values.map((v: any) => (
                            <option key={v.value || v} value={v.value || v}>{v.label || v.value || v}</option>
                          ))}
                        </select>
                      )}
                      {opt.type === "text" && (
                        <input
                          type="text"
                          value={selectedOptions[opt.code] || ""}
                          onChange={(e) => handleOptionChange(opt.code, e.target.value)}
                          placeholder={(opt as any).description || `Enter ${opt.name}`}
                          className="w-full rounded-xl border border-border/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      )}
                      {opt.type === "boolean" && (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedOptions[opt.code] === "true"}
                            onChange={(e) => handleOptionChange(opt.code, e.target.checked ? "true" : "false")}
                            className="rounded border-border/40 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">Enable</span>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </Field>
            )}

            {/* Artwork Upload */}
            <Field label="Artwork / Logo">
              <div className="space-y-3">
                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.svg,.pdf,.ai,.eps"
                  onChange={handleArtworkUpload}
                  className="w-full rounded-xl border border-border/40 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {artworkFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {artworkFiles.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs">
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeArtwork(i)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-subtle">PNG, JPG, SVG, PDF, AI, EPS • Max 10MB each</p>
              </div>
            </Field>

            {/* Quantity */}
            <Field label={`Quantity — ${qty} units`}>
              <div className="flex flex-wrap gap-2">
                {tiers.map((t) => (
                  <Chip key={t} active={t === qty} onClick={() => setQty(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </Field>
          </div>

          {/* preview */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl hairline bg-surface p-6 sm:p-8">
            <span aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl" />
            <span className="text-xs uppercase tracking-[0.22em] text-subtle">Live preview</span>

            <div className="relative mt-6 flex flex-1 items-center justify-center rounded-2xl hairline bg-background p-10">
              {selectedColor && (
                <svg viewBox="0 0 200 200" className="h-48 w-48" role="img" aria-label={`${selectedColor.name} ${product?.name} preview`}>
                  <path
                    d="M60 30 L80 22 Q100 40 120 22 L140 30 L160 55 L142 70 L140 175 L60 175 L58 70 L40 55 Z"
                    fill={selectedColor.hex || selectedColor.css || "#000"}
                    stroke="oklch(1 0 0 / 0.14)"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="78"
                    y="78"
                    width="44"
                    height="44"
                    rx="6"
                    fill="var(--primary)"
                    opacity={selectedPrintMethod?.name === "Embroidery" ? 0.85 : 1}
                  />
                </svg>
              )}
            </div>

            <dl className="mt-6 space-y-2.5 text-sm">
              <Row k="Product" v={product?.name || "—"} />
              <Row k="Variant" v={`${selectedColor?.name || "—"} · ${selectedSize?.name || "—"} · ${selectedMaterial?.name || "—"}`} />
              <Row k="Print" v={selectedPrintMethod?.name || "—"} />
              <Row k="Unit price" v={inr(unitPrice)} />
            </dl>

            <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-subtle">Estimated total</span>
                <p className="font-display text-3xl font-extrabold text-gradient">{inr(totalPrice)}</p>
              </div>
            </div>

            <button
              type="button"
              disabled={isAdding || isPricing || !product || !selectedVariant || !selectedPrintMethod}
              onClick={handleAddToCart}
              className="mt-6 w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isAdding ? "Adding to Cart..." : isPricing ? "Calculating Price..." : "Add Customized Spec to Cart"}
            </button>
            <p className="mt-3 text-xs text-subtle">
              Authoritative total verified at checkout. Final quote confirmed after artwork review.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-7 last:mb-0">
      <legend className="mb-3 text-xs uppercase tracking-[0.22em] text-subtle">{label}</legend>
      {children}
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "min-h-11 rounded-full px-4 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-accent-gradient font-semibold text-primary-foreground"
          : "hairline bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-subtle">{k}</dt>
      <dd className="text-right text-foreground">{v}</dd>
    </div>
  );
}

function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}