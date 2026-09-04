import { cn } from "@/lib/utils";

/** Renders the exact circle neon-green X logo mark as shown in the design specification. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5ef046] text-black font-extrabold text-sm shadow-[0_0_15px_rgba(94,240,70,0.4)] select-none",
        className
      )}
    >
      X
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 whitespace-nowrap", className)}>
      <LogoMark />
      <span className="font-display text-[1.1rem] font-extrabold tracking-tight text-white hidden sm:inline-block">
        Xeno Craft
      </span>
    </span>
  );
}

export function LogoFull({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-3 select-none", className)}>
      <LogoMark className="h-20 w-20 text-3xl shadow-[0_0_35px_rgba(94,240,70,0.6)] animate-pulse" />
      <span className="font-display text-2xl font-bold tracking-tight text-white">
        Xeno Craft
      </span>
    </div>
  );
}
