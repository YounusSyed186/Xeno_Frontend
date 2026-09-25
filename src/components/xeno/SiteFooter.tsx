import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Linkedin, Twitter, MessageCircle, ArrowUp, ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton, MagneticLink } from "./MagneticButton";
import { Logo } from "./Logo";

export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden py-24 lg:py-32 border-t border-white/5">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[150px]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-3xl leading-[1.05] sm:text-5xl lg:text-6xl font-extrabold text-white">
            Ready to create <span className="text-gradient">something amazing?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">
            From custom T-shirts to wedding invitations and creative stickers — let's bring your vision to life.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <MagneticLink to="/custom-t-shirts" className="px-7 py-3.5 text-sm font-extrabold">
              Customise T-Shirts
            </MagneticLink>
            <MagneticLink to="/wedding-cards" variant="outline" className="px-7 py-3.5 text-sm font-bold">
              Explore Wedding Cards
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const exploreLinks = [
  { label: "Custom T-Shirts", to: "/custom-t-shirts", external: false },
  { label: "Wedding Cards", to: "/wedding-cards", external: false },
  { label: "Stickers on Amazon", to: "/stickers", external: false },
  { label: "Bulk Orders", to: "/bulk-orders", external: false },
] as const;

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Help & Support", to: "/support" },
] as const;

export function SiteFooter() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          {/* 25. BRAND & GET IN TOUCH */}
          <div>
            <Link to="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
              <Logo size="lg" glow={true} />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Custom T-shirts, personalised wedding invitations and creative stickers — made for people, events and celebrations.
            </p>
            <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3 items-center">
                <MapPin className="size-4 shrink-0 text-[#5ef046]" aria-hidden="true" />
                <span>Xeno Craft, Hyderabad, India</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="size-4 shrink-0 text-[#5ef046]" aria-hidden="true" />
                <a href="tel:+914040008888" className="hover:text-white transition-colors">+91 40 4000 8888</a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="size-4 shrink-0 text-[#5ef046]" aria-hidden="true" />
                <a href="mailto:hello@xenocraft.in" className="hover:text-white transition-colors">hello@xenocraft.in</a>
              </li>
            </ul>
          </div>

          {/* 25. EXPLORE & COMPANY NAVIGATION */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-2">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#5ef046] font-bold">Explore</h3>
              <ul className="mt-5 space-y-3">
                {exploreLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to as any}
                      className="text-sm text-muted-foreground transition-colors hover:text-[#5ef046] flex items-center gap-1.5"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-[#5ef046] font-bold">Company</h3>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to as any} className="text-sm text-muted-foreground transition-colors hover:text-[#5ef046]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 26. EMAIL SUBSCRIPTION SECTION */}
        <div className="mt-14 grid gap-6 rounded-3xl border border-white/10 bg-card/70 p-6 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:p-8">
          <div>
            <h3 className="text-xl font-bold text-white">Stay in the Loop</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              New designs, products and updates from Xeno Craft.
            </p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-[#5ef046]">
              <Check className="size-4" /> Thank you for subscribing!
            </div>
          ) : (
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="min-h-11 w-full rounded-full border border-white/10 bg-background px-5 text-sm text-white placeholder:text-zinc-600 focus-visible:outline-none focus-visible:border-[#5ef046]"
              />
              <button
                type="submit"
                className="min-h-11 shrink-0 rounded-full bg-[#5ef046] px-6 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_15px_rgba(94,240,70,0.4)] cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500">© {new Date().getFullYear()} Xeno Craft, Hyderabad. All rights reserved.</p>
          <ul className="flex gap-2">
            {[
              { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
              { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
              { Icon: Twitter, label: "X", href: "https://twitter.com" },
            ].map(({ Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-[#5ef046]/40 hover:text-[#5ef046]"
                >
                  <Icon className="size-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className="pointer-events-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 bg-black/80 text-muted-foreground transition-colors hover:text-[#5ef046] backdrop-blur-md"
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
      <MagneticButton
        href="https://wa.me/914040008888"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto size-11 !px-0 bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]"
      >
        <MessageCircle className="size-5 text-black" aria-hidden="true" />
      </MagneticButton>
    </div>
  );
}
