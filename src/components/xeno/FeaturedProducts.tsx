import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";
import { categories } from "./data";

export function WhatWeCreate() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="What We Create"
        title={<>Made Personal. <span className="text-gradient">Made for You.</span></>}
        copy="From T-shirts for your next event to invitations for your big day, Xeno Craft creates products designed around your requirements."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.1}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] hairline bg-card border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-[#5ef046]/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
              {/* Card Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-zinc-950">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-black/70 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#5ef046]">
                  {cat.title}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{cat.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{cat.copy}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  {cat.external ? (
                    <a
                      href="https://www.amazon.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#5ef046] group-hover:text-[#4de035] transition-colors"
                    >
                      {cat.cta} <ArrowUpRight className="size-4" />
                    </a>
                  ) : (
                    <Link
                      to={cat.link as any}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#5ef046] group-hover:text-[#4de035] transition-colors"
                    >
                      {cat.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// Keep export alias for backwards compatibility if needed
export { WhatWeCreate as FeaturedProducts };
