import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Sparkles, MessageCircle, Send, Check, Heart, ArrowRight, ExternalLink, Filter, CheckCircle2 } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/xeno/Reveal";
import { images } from "@/components/xeno/data";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

const T = "Custom Wedding Cards & Invitations — Made for Your Story | Xeno Craft";
const D = "Custom wedding invitations designed around your wedding style, theme, colours and celebration. Luxury foil, embossed, modern and digital wedding suites in Hyderabad.";

export const Route = createFileRoute("/wedding-cards")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingCardsPage,
});

export interface WeddingCardItem {
  id?: number | undefined;
  slug: string;
  title: string;
  desc: string;
  image: string;
  badge: string;
  price: number;
  compareAtPrice?: number | undefined;
  moq: number;
  isDigital?: boolean | undefined;
  material?: string | undefined;
  categorySlug?: string | undefined;
}

// Authentic production-grade fallback items matching the backend database seed
const fallbackWeddingProducts: WeddingCardItem[] = [
  {
    id: 1,
    slug: "royal-heritage-gold-foil-wedding-suite",
    title: "Royal Heritage Gold Foil Wedding Suite",
    desc: "350 GSM textured cotton cardstock with 24K hot foil stamped calligraphy, ornate royal borders, and custom monogram wax seal.",
    image: "https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?w=1000&auto=format&fit=crop&q=80",
    badge: "Gold Foil & Letterpress",
    price: 180,
    compareAtPrice: 240,
    moq: 50,
    material: "350 GSM Textured Cotton Stock",
    categorySlug: "traditional",
  },
  {
    id: 2,
    slug: "modern-minimalist-vellum-letterpress-suite",
    title: "Modern Minimalist Vellum & Letterpress Suite",
    desc: "Crisp architectural typography with blind debossing, translucent vellum jacket, and botanical pressed floral seal.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1000&auto=format&fit=crop&q=80",
    badge: "Minimalist Luxe",
    price: 165,
    compareAtPrice: 210,
    moq: 50,
    material: "Translucent Vellum & Wax Seal",
    categorySlug: "modern",
  },
  {
    id: 3,
    slug: "deckle-edge-botanical-floral-suite",
    title: "Handmade Deckle Edge Botanical Floral Suite",
    desc: "100% artisanal cotton deckled edge paper with soft watercolor floral illustration and delicate gold leaf brushing.",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
    badge: "Handmade Deckle Edge",
    price: 195,
    compareAtPrice: 260,
    moq: 50,
    material: "Handmade Deckle Edge (300 GSM)",
    categorySlug: "traditional",
  },
  {
    id: 4,
    slug: "opulent-velvet-monogram-suite",
    title: "Opulent Velvet Touch & Monogram Seal Suite",
    desc: "400 GSM velvet touch cardstock in jewel tones with gold-gilded beveled edges and metal alloy monogram emblem.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1000&auto=format&fit=crop&q=80",
    badge: "Royal Velvet Luxe",
    price: 240,
    compareAtPrice: 320,
    moq: 50,
    material: "400 GSM Royal Velvet Matte",
    categorySlug: "traditional",
  },
  {
    id: 5,
    slug: "frosted-acrylic-gold-foil-invitation",
    title: "Frosted Acrylic Glass & Metallic Foil Invitation",
    desc: "2mm heavy-gauge shatterproof frosted acrylic with screen-printed metallic gold calligraphy and custom hardbound folio.",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1000&auto=format&fit=crop&q=80",
    badge: "Frosted Acrylic Glass",
    price: 280,
    compareAtPrice: 380,
    moq: 25,
    material: "Frosted Acrylic Glass (2mm)",
    categorySlug: "modern",
  },
  {
    id: 6,
    slug: "animated-digital-video-wedding-suite",
    title: "Animated Digital E-Invite & Video Suite",
    desc: "4K ultra-smooth motion graphics digital wedding invitation with custom music, interactive itinerary, and WhatsApp sharing.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&auto=format&fit=crop&q=80",
    badge: "Digital & Video",
    price: 2999,
    compareAtPrice: 4499,
    moq: 1,
    isDigital: true,
    material: "Ultra-HD Motion Digital Asset",
    categorySlug: "digital",
  },
  {
    id: 7,
    slug: "destination-wedding-passport-boarding-kit",
    title: "Destination Wedding Passport & Boarding Pass Kit",
    desc: "Custom foil-stamped passport booklet, metallic gold boarding pass ceremony ticket, and matching luggage tags.",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1000&auto=format&fit=crop&q=80",
    badge: "Destination Kit",
    price: 220,
    compareAtPrice: 290,
    moq: 50,
    material: "350 GSM Textured Cotton Stock",
    categorySlug: "traditional",
  },
];

const categoryFilterTabs = [
  { id: "all", label: "All Suites" },
  { id: "traditional", label: "Traditional & Foil" },
  { id: "modern", label: "Modern & Minimalist" },
  { id: "digital", label: "Digital & Video" },
];

function WeddingCardsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    approxCount: "100",
    style: "Royal Heritage Gold Foil Wedding Suite",
    notes: "",
  });

  // Dynamic Query from backend API
  const { data: apiResponse, isLoading, isError } = useProducts({
    category: "wedding-cards",
    per_page: 50,
  });

  // Transform dynamic database products or use authentic seeded fallback
  const allItems: WeddingCardItem[] = useMemo(() => {
    const products: Product[] = apiResponse?.products || [];
    if (products.length > 0) {
      return products.map((p) => {
        const primaryImg = p.images?.find((img) => img.is_primary)?.url || p.images?.[0]?.url || images.weddingcards;
        const anyP = p as any;
        const badge = (Array.isArray(anyP.tags) && anyP.tags[0]?.name) || p.variants?.[0]?.material?.name || "Bespoke Suite";
        const catSlug = p.category?.slug?.includes("traditional")
          ? "traditional"
          : p.category?.slug?.includes("modern")
          ? "modern"
          : p.category?.slug?.includes("digital") || p.slug.includes("digital")
          ? "digital"
          : "traditional";

        const item: WeddingCardItem = {
          id: p.id,
          slug: p.slug,
          title: p.name,
          desc: p.short_description || p.description || "Custom wedding invitation suite handcrafted in Hyderabad.",
          image: primaryImg,
          badge,
          price: Number(p.base_price) || 180,
          compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
          moq: p.moq || 50,
          isDigital: p.slug.includes("digital") || p.moq === 1,
          material: p.variants?.[0]?.material?.name || undefined,
          categorySlug: catSlug,
        };
        return item;
      });
    }
    return fallbackWeddingProducts;
  }, [apiResponse]);

  // Filter items by selected tab
  const filteredItems = useMemo(() => {
    if (activeTab === "all") return allItems;
    return allItems.filter((item) => item.categorySlug === activeTab);
  }, [allItems, activeTab]);

  const handleSelectStyle = (item: WeddingCardItem) => {
    setFormData((prev) => ({
      ...prev,
      style: item.title,
      approxCount: item.isDigital ? "1" : prev.approxCount || String(item.moq),
    }));

    const el = document.getElementById("enquiry-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Xeno Craft! I would like to enquire about Custom Wedding Invitations.\n\n` +
      `*Name:* ${formData.name || "Customer"}\n` +
      `*Preferred Style:* ${formData.style}\n` +
      `*Event Date:* ${formData.eventDate || "Upcoming"}\n` +
      `*Quantity:* ${formData.approxCount} units\n` +
      `*Notes / Custom Requests:* ${formData.notes || "Looking for custom design, colors & quote"}`
  );

  return (
    <div className="pt-28 pb-20 sm:pt-36">
      {/* 20. HERO SECTION */}
      <section className="grain relative overflow-hidden pb-16 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[36rem] w-[36rem] rounded-full bg-emerald-500/15 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_80%)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-emerald-500/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                <Heart className="size-3.5 text-[#5ef046]" /> Custom Wedding Invitations
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl font-extrabold tracking-tight text-white">
                Invitations Made for <span className="text-gradient">Your Story</span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
                Your wedding is personal. Your invitation should be too.
              </p>
              <p className="mt-2 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-xl">
                We craft bespoke wedding invitation suites tailored to your wedding style, color palette, auspicious emblems, and celebration.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#enquiry-section"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-7 py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  <Sparkles className="size-4" />
                  Start Your Wedding Card Enquiry
                </a>
                <a
                  href={`https://wa.me/914040008888?text=${encodeURIComponent("Hi Xeno Craft! I'd like to enquire about Custom Wedding Cards.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-6 py-3.5 text-sm font-bold text-emerald-400 transition-all hover:bg-emerald-900/30"
                >
                  <MessageCircle className="size-4 text-emerald-400" />
                  WhatsApp Enquiry
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-4/3 overflow-hidden rounded-[2.5rem] border border-white/15 bg-card shadow-2xl">
              <img
                src={images.weddingcards}
                alt="Luxury Wedding Invitations Suite"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-bold text-[#5ef046] uppercase tracking-wider">Custom Bespoke Suite</span>
                <p className="text-sm font-semibold text-white mt-1">24K Gold Foil Typography & 350 GSM Textured Stock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 20. WEDDING CARD DYNAMIC GALLERY */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <SectionHeading
            eyebrow="Wedding Card Catalog"
            title={<>Explore Our <span className="text-gradient">Bespoke Suites</span></>}
            copy="Handcrafted physical invitations, luxury box suites and interactive digital e-invites tailored to your celebration."
          />
          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-[#5ef046]/40 hover:text-[#5ef046]"
            >
              <span>Explore All Products</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          {categoryFilterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#5ef046] text-black shadow-[0_0_15px_rgba(94,240,70,0.4)]"
                  : "bg-card border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.06}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5ef046]/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/80 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold text-[#5ef046]">
                    {item.badge}
                  </span>
                  {item.compareAtPrice && (
                    <span className="absolute top-3 right-3 rounded-full bg-red-950/80 backdrop-blur-md border border-red-500/30 px-2.5 py-0.5 text-[10px] font-bold text-red-300">
                      Save ₹{item.compareAtPrice - item.price}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-emerald-400">
                        {item.isDigital ? "Flat Package" : `From ₹${item.price} / piece`}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium">
                        {item.isDigital ? "Instant 4K Asset" : `MOQ: ${item.moq} pcs`}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug">{item.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                    {item.material && (
                      <p className="mt-2.5 text-[11px] text-zinc-400 font-medium">
                        <span className="text-zinc-500">Stock:</span> {item.material}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectStyle(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ef046] hover:underline cursor-pointer"
                    >
                      Enquire for this style <ArrowRight className="size-3.5" />
                    </button>
                    <Link
                      to="/products/$slug"
                      params={{ slug: item.slug } as any}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-white transition-colors"
                    >
                      <span>Specs</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#5ef046] hover:text-black hover:border-transparent hover:shadow-[0_0_20px_rgba(94,240,70,0.4)]"
          >
            <Sparkles className="size-4 text-[#5ef046]" />
            <span>Explore All Products & Catalog</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* 20. CUSTOMISATION / ENQUIRY SECTION */}
      <section id="enquiry-section" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
              Customisation Journey
            </span>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white tracking-tight leading-[1.15]">
              Tell Us What You <span className="text-gradient">Have in Mind</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Share your wedding details, preferred suite style, color theme, and custom requests. Our Hyderabad design studio will work with you to craft an invitation suite that wows your guests.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card/60 p-4">
                <div className="size-8 rounded-full bg-[#5ef046]/10 flex items-center justify-center text-[#5ef046] shrink-0 font-bold text-xs">1</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Share Your Inspiration</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Colors, motifs, themes, or existing samples you love.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card/60 p-4">
                <div className="size-8 rounded-full bg-[#5ef046]/10 flex items-center justify-center text-[#5ef046] shrink-0 font-bold text-xs">2</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Design & Proofing</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Our designers craft digital drafts and refinements until you are 100% happy.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card/60 p-4">
                <div className="size-8 rounded-full bg-[#5ef046]/10 flex items-center justify-center text-[#5ef046] shrink-0 font-bold text-xs">3</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Handcrafted Production</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Precision foil, letterpress, premium envelopes and careful packaging.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/914040008888?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-6 py-3.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all"
              >
                <MessageCircle className="size-4 text-emerald-400" />
                <span>Need quick assistance? Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/15 bg-card/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              {formSent ? (
                <div className="text-center py-10">
                  <div className="mx-auto size-14 rounded-full bg-[#5ef046]/20 border border-[#5ef046]/40 flex items-center justify-center text-[#5ef046] mb-4">
                    <Check className="size-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Enquiry Received</h3>
                  <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                    Thank you! Our wedding invitation specialist will reach out to you within 24 hours with design inspirations and quote details for <span className="text-white font-medium">{formData.style}</span>.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/914040008888?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-6 py-3 text-xs font-extrabold text-black hover:bg-[#4de035] transition-all"
                    >
                      <MessageCircle className="size-4" />
                      Forward via WhatsApp
                    </a>
                    <button
                      onClick={() => setFormSent(false)}
                      className="text-xs font-bold text-zinc-400 hover:text-white px-4 py-3 cursor-pointer"
                    >
                      Send another enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul & Sneha"
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Wedding / Event Date
                      </label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-[#5ef046] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Preferred Style (Dynamic Catalog)
                      </label>
                      <select
                        value={formData.style}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-[#5ef046] focus:outline-none"
                      >
                        {allItems.map((item) => (
                          <option key={item.slug} value={item.title}>
                            {item.title} ({item.isDigital ? "Digital" : `From ₹${item.price}`})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Approximate Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={5000}
                        value={formData.approxCount}
                        onChange={(e) => setFormData({ ...formData, approxCount: e.target.value })}
                        placeholder="e.g. 100"
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Tell Us About Your Theme, Colors & Preferences
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Share your color palette (e.g., emerald green & gold), functions (Sangeet, Mehendi, Reception), or special custom requests..."
                      className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#5ef046] py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="size-4" />
                      Submit Wedding Card Enquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
