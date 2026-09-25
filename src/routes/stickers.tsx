import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowRight, ShieldCheck, Sparkles, ExternalLink, Droplets, Laptop, BookOpen } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/xeno/Reveal";
import { images } from "@/components/xeno/data";

const T = "Creative Stickers — Laptops, Bottles & Notebooks | Xeno Craft on Amazon";
const D = "Explore Xeno Craft's creative vinyl stickers for laptops, bottles, notebooks and journals. Waterproof, residue-free, die-cut designs available exclusively on Amazon.";

export const Route = createFileRoute("/stickers")({
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
  component: StickersPage,
});

const stickerPacks = [
  {
    title: "Developer & Tech Icon Pack",
    desc: "Clean vector logos, witty programming humor and clean syntax stickers for engineers.",
    count: "50 Die-Cut Stickers",
    image: images.stickers,
    amazonLink: "https://www.amazon.in",
  },
  {
    title: "Cyberpunk & Neon Aesthetic",
    desc: "Futuristic holographic finish, glow accents and dystopian cyber artwork.",
    count: "40 Vinyl Decals",
    image: images.stickers,
    amazonLink: "https://www.amazon.in",
  },
  {
    title: "Anime & Pop Culture Series",
    desc: "Vibrant high-pigment Japanese anime, manga character art and iconic emblems.",
    count: "60 Die-Cut Stickers",
    image: images.stickers,
    amazonLink: "https://www.amazon.in",
  },
  {
    title: "Coffee & Minimalist Quotes",
    desc: "Matte-laminate typography, aesthetic quotes and cozy everyday lifestyle stickers.",
    count: "45 Waterproof Stickers",
    image: images.stickers,
    amazonLink: "https://www.amazon.in",
  },
  {
    title: "Nature & Wanderlust Travel Pack",
    desc: "Mountain peaks, national parks, camping badges and wanderlust trail art.",
    count: "50 Outdoor Decals",
    image: images.stickers,
    amazonLink: "https://www.amazon.in",
  },
  {
    title: "Abstract Art & Holographic Pack",
    desc: "Prismatic light-refracting holographic stickers that change colors in motion.",
    count: "35 Holographic Decals",
    image: images.stickers,
    amazonLink: "https://www.amazon.in",
  },
];

const highlights = [
  {
    icon: Droplets,
    title: "100% Waterproof",
    desc: "Survives bottle condensation, water spills and outdoor weather.",
  },
  {
    icon: ShieldCheck,
    title: "Residue-Free Peel",
    desc: "Peels clean off aluminium laptops and glass without sticky gunk.",
  },
  {
    icon: Sparkles,
    title: "Scratch-Resistant Matte",
    desc: "Premium UV-cured laminate protects colors from keys and bag friction.",
  },
];

function StickersPage() {
  return (
    <div className="pt-28 pb-20 sm:pt-36">
      {/* 21. HERO SECTION */}
      <section className="grain relative overflow-hidden pb-16 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_80%)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                Stickers by Xeno Craft
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 text-4xl leading-[1.05] sm:text-6xl font-extrabold tracking-tight text-white">
                Stick a Little Personality <span className="text-gradient">Everywhere</span>
              </h1>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground max-w-xl">
                Creative sticker designs for your laptops, bottles, notebooks, journals and everyday favourites.
              </p>
              <p className="mt-2 text-sm sm:text-base font-semibold text-[#5ef046]">
                Available exclusively on Amazon.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="https://www.amazon.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-8 py-4 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  Shop on Amazon <ArrowUpRight className="size-4" />
                </a>
              </div>
            </Reveal>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-4/3 overflow-hidden rounded-[2.5rem] border border-white/15 bg-card shadow-2xl">
              <img
                src={images.stickers}
                alt="Creative Vinyl Stickers"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Prime Delivery on Amazon</span>
                <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold px-3 py-1">
                  Amazon Exclusive
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKER HIGHLIGHTS */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-card/50 p-5">
                <div className="size-10 rounded-xl bg-[#5ef046]/10 flex items-center justify-center text-[#5ef046] shrink-0">
                  <h.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{h.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 21. STICKER PRODUCT DISPLAY */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            eyebrow="Amazon Showcase"
            title={<>Explore Our <span className="text-gradient">Sticker Packs</span></>}
            copy="All packs are fulfilled and delivered securely through Amazon India."
          />
          <div className="shrink-0">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-[#5ef046]/40 hover:text-[#5ef046]"
            >
              <span>Explore All</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stickerPacks.map((pack, i) => (
            <Reveal key={pack.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5ef046]/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-4/3 overflow-hidden bg-zinc-950">
                  <img
                    src={pack.image}
                    alt={pack.title}
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-bold text-[#5ef046]">
                    {pack.count}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{pack.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{pack.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <a
                      href={pack.amazonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-[#5ef046] hover:text-black py-2.5 text-xs font-bold text-white transition-all"
                    >
                      Shop on Amazon <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/15 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#5ef046] hover:text-black hover:border-transparent hover:shadow-[0_0_20px_rgba(94,240,70,0.4)]"
          >
            <Sparkles className="size-4 text-[#5ef046]" />
            <span>Explore All Products & Catalog</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
