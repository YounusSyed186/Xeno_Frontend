import {
  Gem,
  Factory,
  Leaf,
  Timer,
  PenTool,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { Reveal, SectionHeading } from "./Reveal";

const cells = [
  {
    icon: Gem,
    title: "Premium Quality",
    copy: "240 GSM fabrics, colour-locked inks and a three-stage QC pass on every batch.",
    span: "sm:col-span-2 lg:row-span-2",
    big: true,
  },
  { icon: Factory, title: "Bulk Manufacturing", copy: "10 to 10,000 units without losing finish." },
  { icon: Timer, title: "Fast Delivery", copy: "Standard dispatch in 5–7 working days." },
  { icon: Leaf, title: "Eco Friendly Printing", copy: "Water-based inks, low-waste cutting." },
  { icon: PenTool, title: "Design Support", copy: "In-house designers refine your artwork free." },
  { icon: IndianRupee, title: "Affordable Pricing", copy: "Factory-direct rates, no middlemen." },
  { icon: MapPin, title: "Made in India", copy: "Owned production floor, ethical labour." },
];

export function Bento() {
  return (
    <section id="about" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <SectionHeading
        eyebrow="Why Xeno Craft"
        title={<>A production partner, <span className="text-gradient">not a print shop</span></>}
      />

      <div className="mt-14 grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cells.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05} className={c.span ?? ""}>
            <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl hairline bg-card p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/30">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <c.icon
                aria-hidden="true"
                className={`text-primary transition-transform duration-500 group-hover:scale-110 ${c.big ? "size-12" : "size-8"}`}
              />
              <div className="mt-8">
                <h3 className={c.big ? "text-3xl" : "text-lg"}>{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
