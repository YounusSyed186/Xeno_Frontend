import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal, SectionHeading } from "./Reveal";

const steps = [
  { n: "01", title: "Choose Product", copy: "Pick your product, fabric and print method with our team." },
  { n: "02", title: "Upload Design", copy: "Send artwork in any format — our designers prep it for print." },
  { n: "03", title: "Approve Mockup", copy: "Review a digital mockup and sample before production starts." },
  { n: "04", title: "Production", copy: "Cutting, printing, stitching and QC on our own floor." },
  { n: "05", title: "Delivery", copy: "Size-wise packed and shipped pan India with tracking." },
];

const faqs = [
  { q: "What is the minimum order quantity?", a: "Apparel starts at 25 pieces per design and stickers at 100 pieces. Welcome kits start at 50 boxes." },
  { q: "How long does production take?", a: "Standard orders dispatch in 5–7 working days after mockup approval. Rush production is available on request." },
  { q: "Do you help with design?", a: "Yes. Our in-house designers refine or create artwork for your order at no extra cost." },
  { q: "Can I get a sample first?", a: "We produce a paid pre-production sample for bulk orders above 250 units, adjusted against the final invoice." },
  { q: "Do you deliver across India?", a: "Yes, we ship pan India with tracked logistics, and we handle multi-location split deliveries for corporates." },
];

export function ProcessAndFaq() {
  return (
    <section id="bulk" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading eyebrow="Process" title={<>Five steps to <span className="text-gradient">delivery</span></>} />
          <ol className="mt-12 relative border-l border-border pl-8">
            {steps.map((s, i) => (
              <li key={s.n} className="relative pb-10 last:pb-0">
                <Reveal delay={i * 0.06}>
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.55rem] mt-1.5 size-3 rounded-full bg-accent-gradient shadow-[var(--glow-accent)]"
                  />
                  <span className="font-display text-xs tracking-[0.25em] text-primary">{s.n}</span>
                  <h3 className="mt-1 text-xl">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.copy}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <SectionHeading eyebrow="FAQ" title={<>Bulk order <span className="text-gradient">questions</span></>} />
          <Reveal>
            <Accordion type="single" collapsible className="mt-12 w-full">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border-border">
                  <AccordionTrigger className="text-left font-display text-base font-extrabold hover:text-primary hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
