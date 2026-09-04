import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const stats = [
  { value: 5000, suffix: "+", label: "Orders Delivered" },
  { value: 150, suffix: "+", label: "Corporate Clients" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
  { value: 20, suffix: "+", label: "Product Categories" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-5xl font-extrabold text-gradient sm:text-6xl">
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="border-y border-border bg-surface/40 py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="text-center">
              <Counter value={s.value} suffix={s.suffix} />
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-subtle">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const quotes = [
  {
    quote:
      "The jerseys arrived ahead of schedule and the print held through an entire season of washes. Xeno Craft is now our default kit partner.",
    name: "Rohan Mehta",
    role: "Operations Head, Vertex FC",
  },
  {
    quote:
      "Our welcome kits genuinely changed how new hires feel on day one. The packaging quality is on par with premium consumer brands.",
    name: "Aditi Sharma",
    role: "People Lead, Kairos",
  },
  {
    quote:
      "We ordered 1,200 uniforms across 12 branches. Size-wise packing, zero errors, and a single point of contact throughout.",
    name: "Vikram Nair",
    role: "Admin Director, Northwind",
  },
];

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % quotes.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 lg:py-32">
      <SectionHeading eyebrow="Clients" title={<>What partners <span className="text-gradient">say</span></>} align="center" />

      <Reveal>
        <div className="glass-panel mt-14 rounded-[1.75rem] p-8 sm:p-12" aria-live="polite">
          <div className="flex gap-1" aria-label="Rated 5 out of 5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="size-4 fill-primary text-primary" aria-hidden="true" />
            ))}
          </div>
          <blockquote className="mt-6 font-display text-xl leading-snug font-extrabold sm:text-2xl">
            “{quotes[i]!.quote}”
          </blockquote>
          <footer className="mt-6 text-sm">
            <span className="text-foreground">{quotes[i]!.name}</span>
            <span className="text-subtle"> — {quotes[i]!.role}</span>
          </footer>

          <div className="mt-8 flex gap-2">
            {quotes.map((q, idx) => (
              <button
                key={q.name}
                type="button"
                onClick={() => setI(idx)}
                aria-label={`Show testimonial from ${q.name}`}
                aria-current={idx === i}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-10 bg-accent-gradient" : "w-4 bg-border hover:bg-muted"}`}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
