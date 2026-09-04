import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  copy?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl"
      }
    >
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full hairline bg-surface px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h2>
      </Reveal>
      {copy ? (
        <Reveal delay={0.14}>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">{copy}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
