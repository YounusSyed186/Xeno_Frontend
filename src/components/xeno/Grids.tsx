import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { TiltCard } from "./ui";
import { products, industries, caseStudies, type Product } from "@/content/site";

export function ProductGrid({ items }: { items?: Product[] }) {
  const list = items ?? products;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 3) * 0.07}>
          <TiltCard className="h-full">
            <Link
              to="/products/$slug"
              params={{ slug: p.slug }}
              className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] hairline bg-card/60 transition-colors duration-500 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <img
                  src={p.hero}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-lux)] group-hover:scale-[1.08]"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="flex items-start justify-between gap-3 text-xl">
                  {p.name}
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-primary transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.short}</p>
                <p className="mt-5 text-xs uppercase tracking-[0.18em] text-subtle">
                  From {p.pricing[p.pricing.length - 1]?.price}
                </p>
              </div>
            </Link>
          </TiltCard>
        </Reveal>
      ))}
    </div>
  );
}

export function IndustryGrid({ limit }: { limit?: number }) {
  const list = limit ? industries.slice(0, limit) : industries;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((ind, i) => (
        <Reveal key={ind.slug} delay={(i % 3) * 0.06}>
          <Link
            to="/products"
            search={{ category: ind.slug }}
            className="group flex h-full flex-col justify-between rounded-3xl hairline bg-card/50 p-7 transition-all duration-500 hover:border-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div>
              <h3 className="flex items-start justify-between gap-3 text-lg">
                {ind.name}
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ind.tagline}</p>
            </div>
            <p className="mt-8 font-display text-2xl font-extrabold text-gradient">{ind.stat.value}</p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function CaseGrid({ limit, exclude }: { limit?: number; exclude?: string }) {
  const list = caseStudies.filter((c) => c.slug !== exclude).slice(0, limit ?? caseStudies.length);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {list.map((c, i) => (
        <Reveal key={c.slug} delay={(i % 2) * 0.08}>
          <Link
            to="/products"
            className="group relative block overflow-hidden rounded-[1.75rem] hairline transition-colors duration-500 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="aspect-16/10 overflow-hidden">
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                width={1280}
                height={800}
                className="size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-lux)] group-hover:scale-105"
              />
            </div>
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <span className="text-[0.7rem] uppercase tracking-[0.22em] text-primary">
                {c.sector} · {c.year}
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl">{c.title}</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">{c.summary}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read case study
                <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
