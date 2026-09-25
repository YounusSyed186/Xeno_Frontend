import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Clock, MessageCircle, Send, Check } from "lucide-react";
import { PageHero, Section } from "@/components/xeno/ui";
import { Reveal } from "@/components/xeno/Reveal";

const T = "Contact Xeno Craft — Hyderabad Custom T-Shirts & Invitations";
const D = "Get in touch with Xeno Craft in Hyderabad, India for custom T-shirts, wedding invitations, and sticker enquiries.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

const cards = [
  { Icon: Phone, title: "Phone", value: "+91 40 4000 8888", href: "tel:+914040008888" },
  { Icon: MessageCircle, title: "WhatsApp", value: "+91 40 4000 8888", href: "https://wa.me/914040008888" },
  { Icon: Mail, title: "Email", value: "hello@xenocraft.in", href: "mailto:hello@xenocraft.in" },
  { Icon: MapPin, title: "Studio", value: "Hyderabad, Telangana, India", href: "https://maps.google.com/?q=Hyderabad" },
];

const enquiryOptions = [
  "Custom T-Shirts",
  "Bulk T-Shirt Order",
  "Wedding Invitations",
  "Stickers / Amazon",
  "General Enquiry",
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enquiryType: "Custom T-Shirts",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact Xeno Craft"
        title={<>Let's Talk About <span className="text-gradient">Your Project</span></>}
        copy="Reach out directly to our team in Hyderabad for custom orders, quotes, or questions."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-3xl border border-white/10 bg-card/50 p-7 transition-all duration-300 hover:border-[#5ef046]/40 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <c.Icon className="size-5 text-[#5ef046]" aria-hidden="true" />
                <h2 className="mt-5 text-lg font-bold text-white">{c.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{c.value}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Business Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-card/50 p-8">
              <Clock className="size-5 text-[#5ef046]" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-bold text-white">Business Hours</h2>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                <li className="flex justify-between gap-4"><span>Monday – Friday</span><span className="text-white font-medium">9:30 – 19:00</span></li>
                <li className="flex justify-between gap-4"><span>Saturday</span><span className="text-white font-medium">10:00 – 17:00</span></li>
                <li className="flex justify-between gap-4"><span>Sunday</span><span className="text-zinc-400">Closed</span></li>
              </ul>
              <p className="mt-6 border-t border-white/10 pt-4 text-xs text-muted-foreground">
                Located in Hyderabad, India. Custom orders shipped pan-India.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title="Xeno Craft studio location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=78.30%2C17.32%2C78.60%2C17.52&layer=mapnik"
                loading="lazy"
                className="h-[18rem] w-full border-0 grayscale-[0.4]"
              />
            </div>
          </div>

          {/* 24. CONTACT FORM WITH ENQUIRY TYPE DROPDOWN */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/15 bg-card p-8 sm:p-10 shadow-2xl">
              <h3 className="text-2xl font-bold text-white">Send Us a Message</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select your enquiry type and share your details. We will respond promptly.
              </p>

              {sent ? (
                <div className="mt-8 text-center py-8">
                  <div className="mx-auto size-12 rounded-full bg-[#5ef046]/20 border border-[#5ef046]/40 flex items-center justify-center text-[#5ef046] mb-3">
                    <Check className="size-6" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Message Sent!</h4>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thank you for contacting Xeno Craft. Our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-5 text-xs font-bold text-[#5ef046] hover:underline cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                      {/* 24. EXACT ENQUIRY TYPE DROPDOWN */}
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                        Enquiry Type *
                      </label>
                      <select
                        value={formData.enquiryType}
                        onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                        className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white focus:border-[#5ef046] focus:outline-none"
                      >
                        {enquiryOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                      Message / Project Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your requirements, timeline, or enquiry details..."
                      className="w-full rounded-2xl border border-white/10 bg-background px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-[#5ef046] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#5ef046] py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="size-4" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
