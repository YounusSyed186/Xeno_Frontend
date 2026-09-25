import { motion } from "motion/react";
import { Check, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { images } from "./data";

const badges = [
  "Premium Custom T-Shirts",
  "Bespoke Wedding Cards",
  "Creative Sticker Packs",
  "Pan-India Delivery",
];

const floats = [
  {
    src: images.tshirt,
    alt: "Custom T-Shirts",
    label: "Custom T-Shirts",
    cls: "left-2 top-2 h-44 w-40 sm:h-56 sm:w-52",
    d: 0,
  },
  {
    src: images.jersey,
    alt: "Sports & Event T-Shirts",
    label: "Sports & Event Tees",
    cls: "right-2 top-0 h-40 w-36 sm:h-52 sm:w-48",
    d: 0.5,
  },
  {
    src: images.weddingcards,
    alt: "Wedding Invitations",
    label: "Wedding Cards",
    cls: "left-6 bottom-3 h-36 w-40 sm:h-48 sm:w-52",
    d: 1.0,
  },
  {
    src: images.stickers,
    alt: "Creative Stickers",
    label: "Sticker Collection",
    cls: "right-4 bottom-6 h-36 w-36 sm:h-44 sm:w-44",
    d: 0.3,
  },
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

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full hairline bg-surface/80 border border-primary/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#5ef046]"
          >
            Custom Creations, Made Your Way
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 26, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 text-4xl leading-[1.05] sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight"
          >
            Wear It. Celebrate It.{" "}
            <span className="text-gradient">Stick It.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Custom T-shirts for events, teams, organisations and everyday ideas. Personalised wedding
            invitations for your special day. Creative stickers to add a little personality to your everyday.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/custom-t-shirts"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#5ef046] px-7 py-3.5 text-sm font-extrabold text-black transition-all hover:bg-[#4de035] hover:shadow-[0_0_25px_rgba(94,240,70,0.5)] active:scale-95"
            >
              Customise Your T-Shirt
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/wedding-cards"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/40"
            >
              Explore Wedding Cards
            </Link>
            <div className="w-full pt-1 sm:w-auto">
              <Link
                to="/stickers"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition-colors hover:text-[#5ef046]"
              >
                <span>Shop Stickers on Amazon</span>
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <Check className="size-4 text-[#5ef046]" aria-hidden="true" />
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* floating showcase of the 3 main offerings */}
        <div className="relative mx-auto h-[24rem] w-full max-w-lg sm:h-[32rem]">
          <div
            aria-hidden="true"
            className="absolute inset-8 rounded-full bg-primary/15 blur-[110px]"
          />
          {floats.map((f) => (
            <motion.div
              key={f.alt}
              className={`absolute overflow-hidden rounded-3xl hairline bg-card/80 border border-white/10 backdrop-blur-md ${f.cls}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
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
                width={800}
                height={800}
                className="size-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-6">
                <span className="text-[11px] font-bold text-white tracking-wide">{f.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
