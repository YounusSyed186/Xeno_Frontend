import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, MessageCircle, Send, Check, Heart, ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/xeno/Reveal";
import { images } from "@/components/xeno/data";

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

const galleryItems = [
  {
    title: "Traditional Elegance",
    desc: "Intricate gold foil motifs, auspicious emblems and rich matte paper stock.",
    image: images.weddingcards,
    badge: "Gold Foil & Letterpress",
  },
  {
    title: "Modern Minimalist",
    desc: "Clean contemporary typography on luxury textured card with vellum overlays.",
    image: images.weddingcards,
    badge: "Minimalist Luxe",
  },
  {
    title: "Floral & Botanical Suite",
    desc: "Hand-illustrated botanical designs with delicate embossed borders.",
    image: images.weddingcards,
    badge: "Floral & Embossed",
  },
  {
    title: "Royal Heritage & Velvet",
    desc: "Opulent velvet touch, deep jewel tones and royal monogram wax seals.",
    image: images.weddingcards,
    badge: "Royal Vintage",
  },
  {
    title: "Animated Digital E-Invites",
    desc: "Interactive, mobile-friendly digital invitations for WhatsApp & web sharing.",
    image: images.weddingcards,
    badge: "Digital & Video",
  },
  {
    title: "Destination Wedding Kits",
    desc: "Matching itinerary cards, luggage tags, welcome notes and ceremony booklets.",
    image: images.weddingcards,
    badge: "Complete Suite",
  },
];

function WeddingCardsPage() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventDate: "",
    approxCount: "",
    style: "Traditional Elegance",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Xeno Craft! I would like to enquire about Custom Wedding Invitations.\n\nName: ${formData.name || "Customer"}\nEvent Date: ${formData.eventDate || "Upcoming"}\nPreferred Style: ${formData.style}\nDetails: ${formData.notes || "Looking for custom design"}`
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
                We create customised wedding invitations designed around your style, theme, colours and celebration.
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
                <p className="text-sm font-semibold text-white mt-1">Gold Foil Typography & Premium Textured Stock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 20. WEDDING CARD GALLERY */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <SectionHeading
          eyebrow="Wedding Card Gallery"
          title={<>Explore Our <span className="text-gradient">Design Concepts</span></>}
          copy="Each design is customized with your names, wedding theme, bespoke colors and custom wording."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5ef046]/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold text-[#5ef046]">
                    {item.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <a
                      href="#enquiry-section"
                      onClick={() => setFormData({ ...formData, style: item.title })}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ef046] hover:underline"
                    >
                      Enquire for this style <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
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
              Share your wedding details, preferred style, colours, theme and references with us. We'll work with you to create an invitation personalised to your celebration.
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
                    Thank you! Our wedding invitation specialist will reach out to you within 24 hours with design inspirations and quote details.
                  </p>
                  <button
                    onClick={() => setFormSent(false)}
                    className="mt-6 text-xs font-bold text-[#5ef046] hover:underline"
                  >
                    Send another enquiry
                  </button>
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
                        Preferred Style
                      </label>
                      <select
                        value={formData.style}
                        onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-[#5ef046] focus:outline-none"
                      >
                        <option>Traditional Elegance</option>
                        <option>Modern Minimalist</option>
                        <option>Floral & Botanical</option>
                        <option>Royal Vintage & Foil</option>
                        <option>Animated Digital E-Invite</option>
                        <option>Destination Wedding Complete Suite</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Approximate Quantity
                      </label>
                      <input
                        type="number"
                        min={10}
                        max={5000}
                        value={formData.approxCount}
                        onChange={(e) => setFormData({ ...formData, approxCount: e.target.value })}
                        placeholder="e.g. 200"
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
                      Enquire for Customisation
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
