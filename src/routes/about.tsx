import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/xeno/ui";
import { SectionHeading, Reveal } from "@/components/xeno/Reveal";
import { StoryTimeline, StatsBand, PrintTechnologies } from "@/components/xeno/Story";
import { FinalCta } from "@/components/xeno/SiteFooter";
import { team } from "@/content/site";
import { images } from "@/components/xeno/data";

const T = "About Xeno Craft — In-House Merchandise Manufacturing in Hyderabad";
const D = "From one heat press in 2016 to an 18,000 sq ft facility. Our story, manufacturing process, quality checks and the team behind Xeno Craft.";

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

const checks = [
  { title: "Fabric inspection", copy: "Every roll is checked for GSM, shade and knitting faults before cutting." },
  { title: "Cure logging", copy: "Temperature and dwell time recorded per print batch — the reason prints do not crack." },
  { title: "Wash testing", copy: "Sample garments run through 40 domestic and 50 industrial wash cycles." },
  { title: "Final visual QC", copy: "Piece-by-piece inspection against the approved mockup before packing." },
];

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={<>Ten years of <span className="text-gradient">getting the details right</span></>}
        copy="Xeno Craft is a manufacturer, not a reseller. Cutting, printing, embroidery, quality control and packing all happen under one roof — which is the only way to promise a shade will match next year."
        image={images.uniform}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl hairline bg-card p-8">
              <h2 className="text-2xl">Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                To make branded merchandise that people genuinely want to keep — replacing throwaway giveaways with products that earn their place in someone's wardrobe or on their desk.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-3xl hairline bg-card/50 p-8">
              <h2 className="text-2xl">Vision</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                To be India's most trusted merchandise partner for brands that treat their identity seriously — measured by reorders, not by first orders.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Timeline" title={<>How we <span className="text-gradient">got here</span></>} />
        <StoryTimeline />
      </Section>

      <PrintTechnologies />

      <Section>
        <SectionHeading eyebrow="Quality Checks" title={<>Four gates before <span className="text-gradient">anything ships</span></>} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {checks.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl hairline bg-card/50 p-7">
                <h3 className="text-lg">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Meet the Team" title={<>The people on <span className="text-gradient">the floor</span></>} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.06}>
              <div className="h-full rounded-3xl hairline bg-card/50 p-7">
                <p className="font-display text-lg font-extrabold">{m.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-primary">{m.role}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Behind the Scenes" title={<>Inside the <span className="text-gradient">facility</span></>} />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[images.tshirt, images.jersey, images.welcomekit, images.stickers, images.cap, images.uniform].map((src, i) => (
            <Reveal key={i} delay={(i % 3) * 0.06}>
              <div className="overflow-hidden rounded-3xl hairline">
                <img src={src} alt="Xeno Craft factory" loading="lazy" width={800} height={800} className="aspect-square w-full object-cover transition-transform duration-[900ms] hover:scale-105" />
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <StatsBand />
      <FinalCta />
    </>
  );
}
