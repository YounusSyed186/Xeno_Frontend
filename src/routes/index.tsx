import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Sparkles, Shirt, HeartHandshake, Award, Users, PartyPopper, Flame } from "lucide-react";
import { Preloader } from "@/components/xeno/Preloader";
import { Hero } from "@/components/xeno/Hero";
import { Marquee } from "@/components/xeno/Marquee";
import { Bento } from "@/components/xeno/Bento";
import { WhatWeCreate } from "@/components/xeno/FeaturedProducts";
import { Reveal, SectionHeading } from "@/components/xeno/Reveal";
import { images, tShirtUseCases } from "@/components/xeno/data";

const title = "Xeno Craft — Custom T-Shirts, Wedding Cards & Stickers";
const description =
  "Custom T-shirts for events, teams and organisations. Personalised wedding invitations for your special day. Creative stickers to add personality to your everyday.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Xeno Craft",
          description,
          url: "/",
          email: "hello@xenocraft.in",
          telephone: "+91-40-4000-8888",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Hyderabad",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: Index,
});

const useCaseIcons = [
  Shirt,
  HeartHandshake,
  Award,
  Users,
  PartyPopper,
  Flame,
];

function Index() {
  return (
    <>
      <Preloader />
      <Hero />
      <Marquee />

      {/* 8. WHAT WE CREATE - 3 Prominent Category Cards */}
      <WhatWeCreate />

      {/* 9. HOME PAGE – CUSTOM T-SHIRTS SECTION */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28 border-t border-white/5">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                Custom T-Shirts
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight text-white leading-[1.1]">
                Custom T-Shirts for <span className="text-gradient">Every Occasion</span>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="text-base text-muted-foreground leading-relaxed">
                From corporate events and sports tournaments to college fests and gifting, create T-shirts customised around your event, team, organisation or idea.
              </p>
              <p className="mt-3 text-sm text-zinc-300 font-medium">
                Add your logo, artwork, event design, team name or text and make it yours.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/studio"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-6 py-3.5 text-xs font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  <Sparkles className="size-4" />
                  Start Customising
                </Link>
                <Link
                  to="/bulk-orders"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-bold text-white transition-all hover:bg-white/10 hover:border-white/40"
                >
                  Get a Bulk Quote
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {tShirtUseCases.map((uc, i) => {
                const IconComponent = useCaseIcons[i % useCaseIcons.length];
                return (
                  <Reveal key={uc.title} delay={i * 0.05}>
                    <div className="rounded-2xl border border-white/10 bg-card/60 p-5 hover:border-[#5ef046]/40 transition-all">
                      <div className="size-9 rounded-xl bg-[#5ef046]/10 flex items-center justify-center text-[#5ef046] mb-3">
                        <IconComponent className="size-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white">{uc.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{uc.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 10. HOME PAGE – WEDDING INVITATIONS SECTION */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28 border-t border-white/5">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                Wedding Invitations
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight text-white leading-[1.1]">
                An Invitation as Personal as <span className="text-gradient">Your Celebration</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Your wedding invitation sets the tone for your big day. Share your preferred style, colours, theme and details, and we'll create a customised invitation designed around your celebration.
              </p>
              <div className="pt-2">
                <Link
                  to="/wedding-cards"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-7 py-3.5 text-xs font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  Explore Wedding Invitations <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
                <img
                  src={images.weddingcards}
                  alt="Wedding Invitations Showcase"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. HOME PAGE – STICKERS SECTION */}
      <section className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28 border-t border-white/5">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-card/80 via-black to-zinc-950 p-8 sm:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
                <img
                  src={images.stickers}
                  alt="Xeno Craft Stickers"
                  className="size-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">
                Stickers by Xeno Craft
              </span>
              <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight text-white leading-[1.1]">
                Find Your Favourite. <span className="text-gradient">Stick It Anywhere.</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                Explore creative stickers made for laptops, bottles, notebooks, journals and more. Xeno Craft stickers are currently available exclusively on Amazon.
              </p>
              <div className="pt-2">
                <Link
                  to="/stickers"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-7 py-3.5 text-xs font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_20px_rgba(94,240,70,0.5)] active:scale-95"
                >
                  Shop on Amazon <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. HOME PAGE – WHY XENO CRAFT */}
      <Bento />
    </>
  );
}