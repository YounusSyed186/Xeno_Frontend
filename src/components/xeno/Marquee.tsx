import { marqueeItems } from "./data";

function Row({ items }: { items: string[] }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div
        className="flex shrink-0 items-center gap-8 pr-8"
        style={{
          animation: "xeno-marquee 35s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center gap-8">
            <span className="whitespace-nowrap font-display text-sm font-extrabold uppercase tracking-[0.22em] text-zinc-300 transition-colors hover:text-[#5ef046]">
              {item}
            </span>
            <span className="size-1.5 rounded-full bg-[#5ef046]/60 shadow-[0_0_8px_rgba(94,240,70,0.8)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="Core offerings" className="border-y border-white/10 bg-black/60 py-5">
      <style>{`@keyframes xeno-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      @media (prefers-reduced-motion: reduce) { [style*="xeno-marquee"] { animation: none !important } }`}</style>
      <Row items={marqueeItems} />
    </section>
  );
}
