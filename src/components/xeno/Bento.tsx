import {
  Sparkles,
  Users,
  PenTool,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const whyFeatures = [
  {
    icon: Sparkles,
    title: "Customisation That Matters",
    copy: "From event T-shirts to wedding invitations, we create around your requirements rather than giving you a one-size-fits-all solution.",
    span: "sm:col-span-2 lg:col-span-2",
    big: true,
  },
  {
    icon: Users,
    title: "Individual & Bulk Requirements",
    copy: "Whether it's a personal requirement, a team event or a larger organisational order, we can customise accordingly.",
    span: "sm:col-span-2 lg:col-span-2",
    big: true,
  },
  {
    icon: PenTool,
    title: "Design Support",
    copy: "Have an idea but not a finished design? Our team can help bring it together.",
    span: "sm:col-span-1 lg:col-span-1",
    big: false,
  },
  {
    icon: ShieldCheck,
    title: "Quality Focus",
    copy: "Attention to materials, printing and the final finish on every order.",
    span: "sm:col-span-1 lg:col-span-2",
    big: false,
  },
  {
    icon: Heart,
    title: "Made in India",
    copy: "Designed and created with care in India.",
    span: "sm:col-span-1 lg:col-span-1",
    big: false,
  },
];

export function Bento() {
  return (
    <section id="why-us" className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <SectionHeading
        eyebrow="Why Xeno Craft"
        title={<>Made Around <span className="text-gradient">Your Ideas</span></>}
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whyFeatures.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06} className={c.span}>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl hairline bg-card p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#5ef046]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#5ef046]/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <c.icon
                aria-hidden="true"
                className={`text-[#5ef046] transition-transform duration-500 group-hover:scale-110 ${c.big ? "size-10" : "size-8"}`}
              />
              <div className="mt-6">
                <h3 className={c.big ? "text-2xl font-bold text-white" : "text-lg font-bold text-white"}>{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
