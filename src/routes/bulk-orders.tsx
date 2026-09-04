import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, Accordion, QuoteForm } from "@/components/xeno/ui";
import { SectionHeading, Reveal } from "@/components/xeno/Reveal";
import { products } from "@/content/site";

const T = "Bulk Orders — MOQ, Lead Times & Corporate Pricing | Xeno Craft";
const D = "Bulk merchandise printing with transparent MOQs, lead times, custom packaging, export support and dedicated corporate gifting programmes.";

export const Route = createFileRoute("/bulk-orders")({
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
  component: BulkPage,
});

const pillars = [
  { title: "Minimum order quantity", copy: "25 pieces for printed apparel, 50 for embroidery and kits, 250 for stickers, 100 units for packaging." },
  { title: "Lead time", copy: "5–7 working days standard, 96-hour rush slots, and reserved capacity for annual contracts." },
  { title: "Custom packaging", copy: "Branded poly bags, printed mailers, rigid boxes and per-employee dispatch labelling." },
  { title: "Export", copy: "IEC-registered with documentation, HS coding and freight coordination for overseas orders." },
];

const faqs = [
  { q: "Do prices drop with volume?", a: "Yes. Every product page lists three volume tiers, and above 5,000 units we quote against a dedicated production plan." },
  { q: "Can you hold buffer stock for us?", a: "Annual contracts include warehousing with monthly release and a live stock sheet." },
  { q: "What payment terms do you offer?", a: "50% advance for new accounts; 30-day credit terms for established corporate clients on contract." },
  { q: "Can you supply against a GeM or tender specification?", a: "Yes — we submit samples, spec sheets and compliance documentation for government tenders." },
];

function BulkPage() {
  return (
    <>
      <PageHero
        eyebrow="Bulk Orders"
        title={<>Volume production without <span className="text-gradient">the volume compromise</span></>}
        copy="Ten thousand pieces should look exactly like the first ten. Our bulk programme is built around reserved fabric lots, locked production slots and documentation your procurement team can actually file."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl hairline bg-card/50 p-7">
                <h2 className="text-lg">{p.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Pricing" title={<>Indicative <span className="text-gradient">bulk pricing</span></>} copy="Per-unit pricing at the highest tier for each category, excluding GST." />
        <div className="mt-10 overflow-x-auto rounded-3xl hairline">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-surface/60 text-xs uppercase tracking-[0.16em] text-subtle">
              <tr>
                <th scope="col" className="px-6 py-4">Product</th>
                <th scope="col" className="px-6 py-4">Volume</th>
                <th scope="col" className="px-6 py-4">From</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/40">
              {products.map((p) => {
                const tier = p.pricing[p.pricing.length - 1];
                return (
                  <tr key={p.slug} className="transition-colors hover:bg-card">
                    <td className="px-6 py-4 font-semibold">{p.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{tier?.qty}</td>
                    <td className="px-6 py-4 font-display font-extrabold text-primary">{tier?.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="FAQ" title={<>Procurement <span className="text-gradient">questions</span></>} />
          <Accordion items={faqs} />
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl"><QuoteForm /></div>
      </Section>
    </>
  );
}
