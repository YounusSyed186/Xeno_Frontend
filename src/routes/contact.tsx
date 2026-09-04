import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { PageHero, Section, QuoteForm } from "@/components/xeno/ui";
import { Reveal } from "@/components/xeno/Reveal";

const T = "Contact Xeno Craft — Hyderabad Custom Merchandise Studio";
const D = "Call, WhatsApp or email our Hyderabad studio. Business hours, location map and a direct enquiry form for custom merchandise projects.";

export const Route = createFileRoute("/contact")({
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
  component: ContactPage,
});

const cards = [
  { Icon: Phone, title: "Phone", value: "+91 90000 00000", href: "tel:+919000000000" },
  { Icon: MessageCircle, title: "WhatsApp", value: "Chat with the studio", href: "https://wa.me/919000000000" },
  { Icon: Mail, title: "Email", value: "hello@xenocraft.in", href: "mailto:hello@xenocraft.in" },
  { Icon: MapPin, title: "Studio", value: "Hyderabad, Telangana, India", href: "https://maps.google.com/?q=Hyderabad" },
];

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Talk to the people who <span className="text-gradient">actually print it</span></>}
        copy="No call centre, no ticket queue. You speak directly to the team running your order."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-3xl hairline bg-card/50 p-7 transition-all duration-500 hover:border-primary/30 hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <c.Icon className="size-5 text-primary" aria-hidden="true" />
                <h2 className="mt-5 text-lg">{c.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{c.value}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[2rem] hairline">
            <iframe
              title="Xeno Craft studio location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=78.30%2C17.32%2C78.60%2C17.52&layer=mapnik"
              loading="lazy"
              className="h-[26rem] w-full border-0 grayscale-[0.4]"
            />
          </div>
          <div className="rounded-[2rem] hairline bg-card/50 p-8">
            <Clock className="size-5 text-primary" aria-hidden="true" />
            <h2 className="mt-5 text-2xl">Business hours</h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex justify-between gap-4"><span>Monday – Friday</span><span className="text-foreground">9:30 – 19:00</span></li>
              <li className="flex justify-between gap-4"><span>Saturday</span><span className="text-foreground">10:00 – 17:00</span></li>
              <li className="flex justify-between gap-4"><span>Sunday</span><span className="text-foreground">Closed</span></li>
            </ul>
            <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
              Factory visits are welcome on weekdays with prior appointment.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl"><QuoteForm compact /></div>
      </Section>
    </>
  );
}
