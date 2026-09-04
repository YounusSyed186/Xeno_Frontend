import { motion } from "motion/react";
import { Check } from "lucide-react";
import { MagneticLink } from "./MagneticButton";
import { images } from "./data";

const badges = ["Premium Printing", "Fast Production", "Bulk Orders", "Pan India Delivery"];

const floats = [
  { src: images.tshirt, alt: "Oversized t-shirt", cls: "left-0 top-4 h-44 w-40 sm:h-56 sm:w-52", d: 0 },
  { src: images.jersey, alt: "Sports jersey", cls: "right-2 top-0 h-40 w-36 sm:h-52 sm:w-48", d: 0.6 },
  { src: images.cap, alt: "Custom cap", cls: "left-8 bottom-4 h-32 w-36 sm:h-40 sm:w-44", d: 1.1 },
  { src: images.welcomekit, alt: "Welcome kit box", cls: "right-0 bottom-10 h-40 w-44 sm:h-48 sm:w-56", d: 0.3 },
  { src: images.stickers, alt: "Vinyl stickers", cls: "left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 sm:h-32 sm:w-32", d: 0.9 },
];

export function Hero() {
  return (
    <section id="home" className="grain relative overflow-hidden pt-32 pb-20 sm:pt-40 lg:pb-32">
      {/* ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[38rem] w-[38rem] rounded-full bg-primary/20 blur-[160px]" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_75%)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full hairline bg-surface/70 px-3.5 py-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-primary"
          >
            Custom Merchandise Studio
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.5rem]"
          >
            Premium Custom Merchandise That{" "}
            <span className="text-gradient">Elevates Your Brand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            From premium custom t-shirts and sports jerseys to laptop stickers, caps,
            welcome kits, and corporate merchandise — Xeno Craft creates products that
            leave a lasting impression.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <MagneticLink to="/studio" className="px-7 py-3.5">
              Start Your Design
            </MagneticLink>
            <MagneticLink to="/bulk-orders" variant="outline" className="px-7 py-3.5">
              Get Bulk Quote
            </MagneticLink>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-subtle">
                <Check className="size-4 text-primary" aria-hidden="true" />
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* floating merchandise showcase */}
        <div className="relative mx-auto h-[24rem] w-full max-w-lg sm:h-[32rem] pointer-events-none">
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-full bg-primary/15 blur-[110px]"
          />
          {floats.map((f) => (
            <motion.div
              key={f.alt}
              className={`absolute overflow-hidden rounded-3xl hairline bg-card/70 backdrop-blur-sm ${f.cls}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
              transition={{
                opacity: { duration: 1, delay: 0.3 + f.d * 0.2 },
                scale: { duration: 1, delay: 0.3 + f.d * 0.2 },
                y: { duration: 7 + f.d, repeat: Infinity, ease: "easeInOut", delay: f.d },
              }}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <img
                src={f.src}
                alt={f.alt}
                width={1024}
                height={1024}
                className="size-full object-cover"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,oklch(1_0_0/0.07)_50%,transparent_60%)]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
