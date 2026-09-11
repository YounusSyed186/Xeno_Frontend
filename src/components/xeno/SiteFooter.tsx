import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Instagram, Linkedin, Twitter, MessageCircle, ArrowUp } from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticButton, MagneticLink } from "./MagneticButton";
import { Logo } from "./Logo";
import { megaMenu, productBySlug } from "@/content/site";

export function FinalCta() {
  return (
    <section className="grain relative overflow-hidden py-28 lg:py-40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[150px]" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Ready to create <span className="text-gradient">something amazing?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            Share your product, quantity and timeline. You will have a detailed quote and a
            mockup within 24 hours.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <MagneticLink to="/bulk-orders" className="px-8 py-4 text-base">
              Get Free Quote
            </MagneticLink>
            <MagneticLink to="/studio" variant="outline" className="px-8 py-4 text-base">
              Configure a Product
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const company = [
  { label: "About Us", to: "/about" },
  { label: "Bulk Orders", to: "/bulk-orders" },
  { label: "Contact Us", to: "/contact" },
  { label: "Help & Support", to: "/support" },
] as const;

const resources = [
  { label: "Design Studio", to: "/studio" },
  { label: "All Products", to: "/products" },
  { label: "Request a Quote", to: "/bulk-orders" },
  { label: "Customer Account", to: "/account" },
] as const;

export function SiteFooter() {
  const featured = [...(megaMenu[0]?.items ?? []), ...(megaMenu[2]?.items ?? []).slice(0, 2)];
  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link to="/" className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
              <Logo size="lg" glow={true} />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Premium custom merchandise, apparel and corporate branding products —
              designed, printed and packed in-house in Hyderabad.
            </p>
            <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                Xeno Craft Studio, Hyderabad, India
              </li>
              <li className="flex gap-3">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href="tel:+919000000000" className="hover:text-foreground">+91 90000 00000</a>
              </li>
              <li className="flex gap-3">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href="mailto:hello@xenocraft.in" className="hover:text-foreground">hello@xenocraft.in</a>
              </li>
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-subtle">Products</h3>
              <ul className="mt-5 space-y-3">
                {featured.map((slug) => (
                  <li key={slug}>
                    <Link
                      to="/products/$slug"
                      params={{ slug }}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {productBySlug(slug)?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {[
              { title: "Company", items: company },
              { title: "Resources", items: resources },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-sm uppercase tracking-[0.2em] text-subtle">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.items.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 rounded-3xl hairline bg-card p-6 sm:grid-cols-[1.2fr_1fr] sm:items-center sm:p-8">
          <div>
            <h3 className="text-xl">Merch drops & production notes</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Occasional emails on new fabrics, print tech and bulk pricing.
            </p>
          </div>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@company.com"
              className="min-h-11 w-full rounded-full hairline bg-background px-5 text-sm text-foreground placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="min-h-11 shrink-0 rounded-full bg-accent-gradient px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-subtle">© {new Date().getFullYear()} Xeno Craft. All rights reserved.</p>
          <ul className="flex gap-2">
            {[
              { Icon: Instagram, label: "Instagram" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Twitter, label: "X" },
            ].map(({ Icon, label }) => (
              <li key={label}>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full hairline text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
        className="pointer-events-auto inline-flex min-h-11 min-w-11 items-center justify-center rounded-full glass-panel text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowUp className="size-4" aria-hidden="true" />
      </button>
      <MagneticButton
        href="https://wa.me/919000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto size-11 !px-0"
      >
        <MessageCircle className="size-5" aria-hidden="true" />
      </MagneticButton>
    </div>
  );
}
