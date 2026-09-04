import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Variant = "accent" | "ghost" | "outline";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-[transform,box-shadow,background,color] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-11";

export const buttonStyles: Record<Variant, string> = {
  accent:
    "bg-accent-gradient text-primary-foreground hover:shadow-[var(--glow-accent)] hover:brightness-110",
  outline:
    "hairline bg-surface/60 text-foreground hover:border-primary/40 hover:text-primary",
  ghost: "text-muted-foreground hover:text-foreground",
};

function useMagnet() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    setOffset({
      x: (e.clientX - (r.left + r.width / 2)) * 0.25,
      y: (e.clientY - (r.top + r.height / 2)) * 0.35,
    });
  };
  return {
    onPointerMove,
    onPointerLeave: () => setOffset({ x: 0, y: 0 }),
    style: { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` },
  };
}

export function MagneticButton({
  variant = "accent",
  className,
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant; children: ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const magnet = useMagnet();
  return (
    <a ref={ref} {...props} {...magnet} className={cn(base, buttonStyles[variant], className)}>
      {children}
    </a>
  );
}

export function MagneticLink({
  variant = "accent",
  className,
  children,
  ...props
}: any) {
  const magnet = useMagnet();
  const style = buttonStyles[variant as Variant] || buttonStyles.accent;
  return (
    <Link {...props} {...magnet} className={cn(base, style, className)}>
      {children}
    </Link>
  );
}
