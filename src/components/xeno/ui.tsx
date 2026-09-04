import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Plus, ChevronRight, Upload, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { MagneticLink } from "./MagneticButton";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  copy,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden pt-36 pb-16 sm:pt-44 lg:pb-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/3 h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_78%)]" />
      </div>
      <div
        className={cn(
          "relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6",
          image ? "lg:grid-cols-[1.1fr_0.9fr]" : "",
        )}
      >
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/70 px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-primary">
              {eyebrow}
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-7 max-w-3xl text-[2.5rem] leading-[1.03] sm:text-6xl lg:text-[4.25rem]">{title}</h1>
          </Reveal>
          {copy ? (
            <Reveal delay={0.14}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{copy}</p>
            </Reveal>
          ) : null}
          {children ? <Reveal delay={0.2}>{children}</Reveal> : null}
        </div>
        {image ? (
          <Reveal delay={0.18}>
            <div
              className="relative aspect-4/3 overflow-hidden rounded-[2rem] hairline bg-card"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img src={image} alt="" aria-hidden="true" width={1024} height={768} className="size-full object-cover" />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,oklch(1_0_0/0.08)_50%,transparent_60%)]"
              />
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-primary">
      {children}
    </span>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-subtle">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {i > 0 ? <ChevronRight className="size-3" aria-hidden="true" /> : null}
            {it.to ? (
              <Link
                to={it.to}
                params={it.params as never}
                className="transition-colors hover:text-primary"
              >
                {it.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border overflow-hidden rounded-3xl hairline bg-card/50">
      {items.map((item, i) => {
        const active = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(active ? null : i)}
                aria-expanded={active}
                className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-8"
              >
                {item.q}
                <Plus
                  className={cn("size-4 shrink-0 text-primary transition-transform duration-300", active && "rotate-45")}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {active ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:px-8">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div
      onPointerMove={(e) => {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const r = e.currentTarget.getBoundingClientRect();
        setT({
          x: ((e.clientY - (r.top + r.height / 2)) / r.height) * -8,
          y: ((e.clientX - (r.left + r.width / 2)) / r.width) * 8,
        });
      }}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
      style={{
        transform: `perspective(900px) rotateX(${t.x}deg) rotateY(${t.y}deg)`,
        transition: "transform 400ms var(--ease-lux)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

export function StatGrid({ items }: { items: { value: string; label: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.06}>
          <div className="rounded-3xl hairline bg-card/60 p-7">
            <p className="font-display text-4xl font-extrabold text-gradient">{s.value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

const field =
  "min-h-11 w-full rounded-2xl hairline bg-background px-4 py-3 text-sm text-foreground placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function QuoteForm({ product, compact }: { product?: string; compact?: boolean }) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-3xl hairline bg-card p-10 text-center">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-accent-gradient text-primary-foreground">
          <Check className="size-6" aria-hidden="true" />
        </span>
        <h3 className="mt-5 text-2xl">Request received</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          Our team will send a detailed quote and mockup within 24 hours.
        </p>
        <MagneticLink to="/products" variant="outline" className="mt-7 px-6">
          Browse more products
        </MagneticLink>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="grid gap-4 rounded-3xl hairline bg-card p-6 sm:grid-cols-2 sm:p-8"
    >
      <div className="sm:col-span-2">
        <h3 className="text-2xl">Request a quote</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Detailed pricing and a mockup within 24 hours — no obligation.
        </p>
      </div>

      {[
        { id: "q-name", label: "Full name", type: "text", ph: "Your name", req: true },
        { id: "q-company", label: "Company name", type: "text", ph: "Company", req: true },
        { id: "q-email", label: "Email", type: "email", ph: "you@company.com", req: true },
        { id: "q-phone", label: "Phone", type: "tel", ph: "+91 90000 00000", req: true },
      ].map((f) => (
        <div key={f.id}>
          <label htmlFor={f.id} className="text-xs uppercase tracking-[0.16em] text-subtle">{f.label}</label>
          <input id={f.id} name={f.id} type={f.type} required={f.req} placeholder={f.ph} maxLength={120} className={cn(field, "mt-2")} />
        </div>
      ))}

      <div>
        <label htmlFor="q-product" className="text-xs uppercase tracking-[0.16em] text-subtle">Product</label>
        <input id="q-product" name="q-product" type="text" defaultValue={product} placeholder="Custom T-Shirts" maxLength={120} className={cn(field, "mt-2")} />
      </div>
      <div>
        <label htmlFor="q-qty" className="text-xs uppercase tracking-[0.16em] text-subtle">Quantity</label>
        <input id="q-qty" name="q-qty" type="number" min={1} max={1000000} placeholder="250" className={cn(field, "mt-2")} />
      </div>

      {!compact ? (
        <>
          <div>
            <label htmlFor="q-fabric" className="text-xs uppercase tracking-[0.16em] text-subtle">Fabric / material</label>
            <input id="q-fabric" name="q-fabric" type="text" placeholder="240 GSM cotton" maxLength={120} className={cn(field, "mt-2")} />
          </div>
          <div>
            <label htmlFor="q-budget" className="text-xs uppercase tracking-[0.16em] text-subtle">Budget range</label>
            <select id="q-budget" name="q-budget" className={cn(field, "mt-2")} defaultValue="">
              <option value="" disabled>Select a range</option>
              <option>Under ₹50,000</option>
              <option>₹50,000 – ₹2,00,000</option>
              <option>₹2,00,000 – ₹10,00,000</option>
              <option>₹10,00,000+</option>
            </select>
          </div>
          <div>
            <label htmlFor="q-deadline" className="text-xs uppercase tracking-[0.16em] text-subtle">Deadline</label>
            <input id="q-deadline" name="q-deadline" type="date" className={cn(field, "mt-2")} />
          </div>
          <div>
            <label htmlFor="q-files" className="text-xs uppercase tracking-[0.16em] text-subtle">Logo / artwork</label>
            <div className="mt-2 flex items-center gap-3 rounded-2xl hairline bg-background px-4 py-2.5">
              <Upload className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <input
                id="q-files"
                name="q-files"
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf,.ai,.eps,.svg"
                className="w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-xs file:text-foreground"
              />
            </div>
          </div>
        </>
      ) : null}

      <div className="sm:col-span-2">
        <label htmlFor="q-msg" className="text-xs uppercase tracking-[0.16em] text-subtle">Requirements</label>
        <textarea
          id="q-msg"
          name="q-msg"
          rows={4}
          maxLength={1500}
          placeholder="Tell us about print placements, sizes, packaging and delivery locations."
          className={cn(field, "mt-2 resize-y")}
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="min-h-12 w-full rounded-full bg-accent-gradient px-6 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[var(--glow-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Send request
        </button>
        <p className="mt-3 text-center text-xs text-subtle">
          We reply within one business day. Your details are never shared.
        </p>
      </div>
    </form>
  );
}
