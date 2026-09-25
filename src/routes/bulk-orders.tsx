import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Check, Upload, Send, Shirt, Users, Building, GraduationCap, Trophy, PartyPopper } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/xeno/Reveal";

const T = "Bulk Custom T-Shirts for Events, Teams & Organisations | Xeno Craft";
const D = "Need T-shirts for a college fest, corporate event, sports tournament, or company gifting? Get transparent bulk pricing and 24-hour quotes from Xeno Craft.";

export const Route = createFileRoute("/bulk-orders")({
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
  component: BulkPage,
});

const suitableFor = [
  {
    icon: Building,
    title: "Corporate Events",
    desc: "Custom branded T-shirts for conferences, launches, team events and company activities.",
  },
  {
    icon: Users,
    title: "Corporate Gifting",
    desc: "Personalised T-shirts for employee gifting, client gifting and promotional requirements.",
  },
  {
    icon: GraduationCap,
    title: "College Fests",
    desc: "Custom T-shirts for college festivals, clubs, departments and student teams.",
  },
  {
    icon: Trophy,
    title: "Sports Events & Teams",
    desc: "Customised T-shirts for tournaments, sports events, teams and participants.",
  },
  {
    icon: PartyPopper,
    title: "Events & Celebrations",
    desc: "Personalised T-shirts for trips, reunions, celebrations and group occasions.",
  },
  {
    icon: Shirt,
    title: "Brands & Communities",
    desc: "Custom merchandise for brands, campaigns, creators and communities.",
  },
];

const faqs = [
  {
    q: "What is the minimum bulk order quantity?",
    a: "Our bulk custom T-shirt program begins at 25 pieces per design. For larger orders (100+, 500+, 2000+), tiered wholesale pricing applies.",
  },
  {
    q: "Can we mix sizes and colors in a single order?",
    a: "Yes, you can mix standard sizes (S to 3XL) and garment colours within your total quantity.",
  },
  {
    q: "How fast can you deliver bulk orders?",
    a: "Standard turnaround is 5–7 business days after design approval. Rush slots are available for urgent fests and corporate events.",
  },
  {
    q: "Do you offer physical samples before bulk production?",
    a: "Yes, pre-production sample mockups and strike-offs can be arranged for large organizational orders.",
  },
];

function BulkPage() {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    phone: "",
    email: "",
    eventType: "Corporate Events",
    quantity: "",
    tshirtType: "Classic Cotton T-Shirt",
    customizationReq: "Front Print (DTF/Screen)",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="pt-28 pb-20 sm:pt-36">
      {/* 22. HERO SECTION */}
      <section className="grain relative overflow-hidden pb-16 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_80%)]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
              Bulk Custom T-Shirts
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl font-extrabold tracking-tight text-white">
              Custom T-Shirts for <span className="text-gradient">Events, Teams & Organisations</span>
            </h1>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
              Need T-shirts for a college fest, corporate event, sports event, gifting requirement or large group? Share your design, quantity and requirements with us, and we'll help you take it forward.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-9 flex justify-center">
              <a
                href="#quote-form"
                className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-8 py-4 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_25px_rgba(94,240,70,0.5)] active:scale-95"
              >
                <Sparkles className="size-4" />
                Request a Bulk Quote
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 22. SUITABLE FOR */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <SectionHeading
          eyebrow="Suitable For"
          title={<>Built for Every <span className="text-gradient">Team & Group</span></>}
          copy="Tailored bulk production with dedicated account managers and strict quality inspection."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suitableFor.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="group rounded-3xl border border-white/10 bg-card/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#5ef046]/40 hover:bg-card">
                <div className="size-12 rounded-2xl bg-[#5ef046]/10 flex items-center justify-center text-[#5ef046] mb-5 group-hover:scale-110 transition-transform">
                  <item.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 22. BULK ENQUIRY FORM */}
      <section id="quote-form" className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <div className="rounded-3xl border border-white/15 bg-card/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">Quick Quote</span>
            <h2 className="mt-2 text-3xl font-extrabold text-white">Bulk Enquiry Form</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your details below and receive a detailed quote within 24 hours.
            </p>
          </div>

          {formSent ? (
            <div className="text-center py-10">
              <div className="mx-auto size-14 rounded-full bg-[#5ef046]/20 border border-[#5ef046]/40 flex items-center justify-center text-[#5ef046] mb-4">
                <Check className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-white">Quote Request Received!</h3>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
                Thank you! Our bulk order team is preparing your custom quote and digital mockup. We will get back to you shortly.
              </p>
              <button
                onClick={() => setFormSent(false)}
                className="mt-6 text-xs font-bold text-[#5ef046] hover:underline cursor-pointer"
              >
                Submit another request
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
                    placeholder="Full name"
                    className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Company / Organisation / College *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.org}
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    placeholder="e.g. Acme Corp / IIT Hyderabad"
                    className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Phone Number *
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
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@company.com"
                    className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Requirement / Event Type
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-[#5ef046] focus:outline-none"
                  >
                    <option>Corporate Events</option>
                    <option>Corporate Gifting</option>
                    <option>College Fests & Batch Tees</option>
                    <option>Sports Events & Tournaments</option>
                    <option>Events & Celebrations</option>
                    <option>Brands & Communities</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Approximate Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    max={100000}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="e.g. 150"
                    className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    T-Shirt Type
                  </label>
                  <select
                    value={formData.tshirtType}
                    onChange={(e) => setFormData({ ...formData, tshirtType: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-[#5ef046] focus:outline-none"
                  >
                    <option>Classic Cotton T-Shirt</option>
                    <option>Oversized Heavyweight T-Shirt</option>
                    <option>Dry-Fit / Sports Jersey T-Shirt</option>
                    <option>Polo T-Shirt</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Customisation Requirement
                  </label>
                  <select
                    value={formData.customizationReq}
                    onChange={(e) => setFormData({ ...formData, customizationReq: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-[#5ef046] focus:outline-none"
                  >
                    <option>Front Print Only</option>
                    <option>Front + Back Print</option>
                    <option>Chest Embroidery</option>
                    <option>All-Over Sublimation</option>
                    <option>Need Design Assistance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Upload Design / Reference (Optional)
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background px-4 py-3">
                  <Upload className="size-4 text-[#5ef046] shrink-0" />
                  <input
                    type="file"
                    multiple
                    accept=".png,.jpg,.jpeg,.pdf,.ai,.eps,.svg"
                    className="w-full text-xs text-zinc-400 file:mr-3 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-xs file:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Additional Message / Deadline
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention delivery deadlines, specific garment colors, or any special instructions..."
                  className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-full bg-[#5ef046] py-4 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="size-4" />
                  Request Quote
                </button>
                <p className="mt-3 text-center text-xs text-zinc-500">
                  We reply within 24 business hours with transparent pricing and mockups.
                </p>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 border-t border-white/10">
        <SectionHeading eyebrow="FAQ" title={<>Frequently Asked <span className="text-gradient">Questions</span></>} />
        <div className="mt-8 divide-y divide-white/10 rounded-3xl border border-white/10 bg-card/50">
          {faqs.map((f) => (
            <div key={f.q} className="p-6">
              <h3 className="text-base font-bold text-white">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
