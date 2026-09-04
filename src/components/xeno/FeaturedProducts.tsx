import { Reveal, SectionHeading } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { products } from "./data";

export function FeaturedProducts() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <SectionHeading
        eyebrow="Featured"
        title={<>Signature <span className="text-gradient">products</span></>}
        copy="Our most requested pieces, built to the same spec sheet we use for global brands."
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {products.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] hairline bg-card transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-[var(--glow-accent)]">
              <div className="relative aspect-square overflow-hidden bg-background">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-10 bottom-6 h-16 rounded-full bg-primary/25 blur-3xl"
                />
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="relative size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl">{p.name}</h3>
                <ul className="mt-4 flex-1 space-y-2">
                  {p.specs.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-muted-foreground">
                      <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
                <MagneticButton href="#quote" variant="outline" className="mt-6 w-full">
                  Request Quote
                </MagneticButton>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
