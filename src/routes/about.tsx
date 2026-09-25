import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Heart, Shirt, Image as ImageIcon, ArrowRight, ShieldCheck, PenTool, Users } from "lucide-react";
import { PageHero, Section } from "@/components/xeno/ui";
import { SectionHeading, Reveal } from "@/components/xeno/Reveal";
import { images } from "@/components/xeno/data";

const T = "About Xeno Craft — Custom T-Shirts, Wedding Cards & Stickers";
const D = "Xeno Craft is a customisation-focused brand creating custom T-shirts, personalised wedding invitations and creative sticker collections in Hyderabad, India.";

export const Route = createFileRoute("/about")({
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
  component: AboutPage,
});

const corePillars = [
  {
    icon: Sparkles,
    title: "Customisation That Matters",
    desc: "From event T-shirts to wedding invitations, we create around your requirements rather than giving you a one-size-fits-all solution.",
  },
  {
    icon: Users,
    title: "Individual & Bulk Requirements",
    desc: "Whether it's a personal requirement, a team event or a larger organisational order, we can customise accordingly.",
  },
  {
    icon: PenTool,
    title: "Design Support",
    desc: "Have an idea but not a finished design? Our creative team can help bring it together.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Focus",
    desc: "Attention to materials, printing and the final finish on every piece.",
  },
];

const offerings = [
  {
    icon: Shirt,
    title: "Custom T-Shirts",
    desc: "Customised for events, corporate requirements, sports events, college fests, corporate gifting, teams, communities, celebrations and individual requirements.",
    link: "/custom-t-shirts",
    cta: "Explore Custom T-Shirts",
    image: images.tshirt,
  },
  {
    icon: Heart,
    title: "Wedding Cards / Wedding Invitations",
    desc: "Customised according to the customer's wedding requirements, theme and preferences.",
    link: "/wedding-cards",
    cta: "Explore Wedding Cards",
    image: images.weddingcards,
  },
  {
    icon: ImageIcon,
    title: "Stickers",
    desc: "Existing sticker collections available for purchase exclusively through Amazon.",
    link: "/stickers",
    cta: "Shop on Amazon",
    image: images.stickers,
    external: true,
  },
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Xeno Craft"
        title={<>Made Personal. <span className="text-gradient">Made for You.</span></>}
        copy="Xeno Craft is a customisation-focused brand creating products for people, teams, events and celebrations."
        image={images.tshirt}
      />

      {/* 23. CORE ABOUT COPY */}
      <Section>
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <Reveal>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5ef046]">Our Mission</span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              From event T-shirts to wedding cards, we focus on making everyday products <span className="text-gradient">feel more personal</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Our approach is simple — understand what you're looking for, help bring the idea together and create something that feels like yours.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* THREE OFFERINGS OVERVIEW */}
      <Section>
        <SectionHeading
          eyebrow="Our Focus"
          title={<>Three Core <span className="text-gradient">Offerings</span></>}
          copy="We do fewer things, and do them exceptionally well."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {offerings.map((offering, i) => (
            <Reveal key={offering.title} delay={i * 0.08}>
              <div className="group flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#5ef046]/40 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)]">
                <div>
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-zinc-950 mb-5">
                    <img
                      src={offering.image}
                      alt={offering.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white">{offering.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{offering.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10">
                  {offering.external ? (
                    <a
                      href="https://www.amazon.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ef046] hover:underline"
                    >
                      {offering.cta} <ArrowRight className="size-3.5" />
                    </a>
                  ) : (
                    <Link
                      to={offering.link as any}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5ef046] hover:underline"
                    >
                      {offering.cta} <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CORE VALUES / PILLARS */}
      <Section>
        <SectionHeading
          eyebrow="Why Us"
          title={<>Made Around <span className="text-gradient">Your Ideas</span></>}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {corePillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="rounded-3xl border border-white/10 bg-card/50 p-7 h-full">
                <p.icon className="size-7 text-[#5ef046] mb-4" />
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section>
        <div className="rounded-[2.5rem] border border-[#5ef046]/30 bg-gradient-to-br from-card via-black to-[#5ef046]/10 p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Have a Project in Mind?</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Whether you need custom team T-shirts, unique wedding stationery, or want to explore our stickers.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/custom-t-shirts"
              className="inline-flex items-center gap-2 rounded-full bg-[#5ef046] px-7 py-3.5 text-xs font-extrabold text-black hover:bg-[#4de035] transition-all shadow-md"
            >
              Explore T-Shirts
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-xs font-bold text-white hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
