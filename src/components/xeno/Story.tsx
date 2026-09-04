import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal, SectionHeading } from "./Reveal";
import { Section } from "./ui";
import { printTech, fabrics, timeline, stats } from "@/content/site";
import { images } from "./data";
import { cn } from "@/lib/utils";

export function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <Section>
      <div ref={ref} className="grid items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <SectionHeading
            eyebrow="Brand Philosophy"
            title={<>Merchandise is the only <span className="text-gradient">advertising people choose to wear</span></>}
            copy="We build products good enough that people keep them. That is the entire strategy — no filler items, no cracked prints, no shade that drifts between reorders."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { k: "In-house", v: "Cut, print, embroider, pack — one roof, one accountability." },
              { k: "Shade-locked", v: "Reserved fabric lots so year two matches year one." },
              { k: "On the date", v: "99.2% on-time dispatch across 900+ brands." },
            ].map((item, i) => (
              <Reveal key={item.k} delay={i * 0.08}>
                <p className="text-sm font-semibold text-primary">{item.k}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.v}</p>
              </Reveal>
            ))}
          </div>
        </div>
        <motion.div style={{ y }} className="relative">
          <div aria-hidden="true" className="absolute -inset-6 rounded-full bg-primary/10 blur-[100px]" />
          <div className="relative overflow-hidden rounded-[2rem] hairline" style={{ boxShadow: "var(--shadow-card)" }}>
            <img src={images.uniform} alt="Xeno Craft production floor" loading="lazy" width={900} height={1100} className="aspect-4/5 w-full object-cover" />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export function PrintTechnologies() {
  const [active, setActive] = useState(0);
  const tech = printTech[active]!;
  return (
    <Section id="print-tech">
      <SectionHeading
        eyebrow="Printing Technologies"
        title={<>Six ways to put your brand <span className="text-gradient">on a product</span></>}
        copy="Compare the techniques we run in-house and see which one fits your quantity, artwork and fabric."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ul className="grid gap-2">
          {printTech.map((t, i) => (
            <li key={t.name}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={cn(
                  "flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-4 text-left transition-all duration-400 hairline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active === i
                    ? "border-primary/40 bg-card text-foreground"
                    : "bg-surface/40 text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-display text-lg font-extrabold">{t.name}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-subtle">{t.best}</span>
              </button>
            </li>
          ))}
        </ul>
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl hairline bg-card p-8 sm:p-10"
        >
          <div aria-hidden="true" className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/15 blur-[90px]" />
          <p className="relative text-[0.7rem] uppercase tracking-[0.22em] text-primary">Best for {tech.best}</p>
          <h3 className="relative mt-4 text-3xl sm:text-4xl">{tech.name}</h3>
          <p className="relative mt-5 text-sm leading-relaxed text-muted-foreground">{tech.detail}</p>
          <dl className="relative mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl hairline bg-surface/60 p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-subtle">Minimum</dt>
              <dd className="mt-1.5 font-display text-2xl font-extrabold text-gradient">{tech.minQty}</dd>
            </div>
            <div className="rounded-2xl hairline bg-surface/60 p-5">
              <dt className="text-xs uppercase tracking-[0.16em] text-subtle">Colours</dt>
              <dd className="mt-1.5 font-display text-2xl font-extrabold text-gradient">{tech.colours}</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </Section>
  );
}

export function MaterialExplorer() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Premium Materials"
        title={<>The fabrics behind <span className="text-gradient">the finish</span></>}
        copy="Weight, hand-feel and end use — the five base materials that cover most of what we produce."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {fabrics.map((f, i) => (
          <Reveal key={f.name} delay={i * 0.05}>
            <div className="group h-full rounded-3xl hairline bg-card/50 p-6 transition-all duration-500 hover:border-primary/30 hover:bg-card">
              <p className="font-display text-3xl font-extrabold text-gradient">{f.gsm.split(" ")[0]}</p>
              <p className="mt-1 text-[0.7rem] uppercase tracking-[0.2em] text-subtle">GSM</p>
              <h3 className="mt-5 text-base">{f.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.feel}</p>
              <p className="mt-5 border-t border-border pt-4 text-xs text-subtle">{f.use}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

const stages = [
  { step: "01", title: "Factory", copy: "Fabric inspection, shade matching and pattern cutting on automated tables." },
  { step: "02", title: "Printing", copy: "Screen, DTF, sublimation and embroidery lines running in parallel." },
  { step: "03", title: "Quality", copy: "Cure logs, wash tests and a piece-by-piece visual inspection." },
  { step: "04", title: "Packaging", copy: "Folding, labelling, poly-bagging and kit assembly." },
  { step: "05", title: "Dispatch", copy: "Branch-wise cartons, per-employee courier and live tracking." },
];

export function ManufacturingTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-62%"]);

  return (
    <section ref={ref} className="relative h-[320vh]" aria-label="Manufacturing timeline">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Manufacturing Timeline"
            title={<>From fabric roll to <span className="text-gradient">your door</span></>}
          />
        </div>
        <motion.ol style={{ x }} className="mt-14 flex gap-6 pl-4 sm:pl-6">
          {stages.map((s) => (
            <li
              key={s.step}
              className="relative w-[80vw] shrink-0 overflow-hidden rounded-[2rem] hairline bg-card/60 p-8 sm:w-[26rem] sm:p-10"
            >
              <div aria-hidden="true" className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-[80px]" />
              <p className="font-display text-6xl font-extrabold text-primary/20">{s.step}</p>
              <h3 className="mt-6 text-3xl">{s.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
            </li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

export function StatsBand() {
  return (
    <Section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="rounded-3xl hairline bg-card/60 p-8 text-center">
              <p className="font-display text-4xl font-extrabold text-gradient sm:text-5xl">{s.value}</p>
              <p className="mt-3 text-sm text-muted-foreground">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function StoryTimeline() {
  return (
    <div className="relative mt-14 border-l border-border pl-8 sm:pl-12">
      {timeline.map((t, i) => (
        <Reveal key={t.year} delay={i * 0.05}>
          <div className="relative pb-12 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[2.55rem] top-1.5 size-3 rounded-full bg-accent-gradient sm:-left-[3.55rem]" />
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-primary">{t.year}</p>
            <h3 className="mt-3 text-2xl sm:text-3xl">{t.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t.copy}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
