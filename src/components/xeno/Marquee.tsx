import { marqueeItems, clients } from "./data";

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className="flex shrink-0 items-center gap-10 pr-10"
        style={{
          animation: `xeno-marquee ${reverse ? "42s" : "36s"} linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap font-display text-sm font-extrabold uppercase tracking-[0.2em] text-subtle transition-colors hover:text-primary"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="What we produce" className="border-y border-border bg-surface/40 py-6">
      <style>{`@keyframes xeno-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      @media (prefers-reduced-motion: reduce) { [style*="xeno-marquee"] { animation: none !important } }`}</style>
      <Row items={marqueeItems} />
      <div className="h-4" />
      <Row items={clients} reverse />
    </section>
  );
}
