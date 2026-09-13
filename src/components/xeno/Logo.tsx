import React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
  glow?: boolean | undefined;
  variant?: string | undefined;
}

/**
 * Renders the standalone Xeno Craft favicon logo without any background circle.
 */
export function LogoMark({
  className,
  size = "md",
  glow = true,
}: {
  className?: string | undefined;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
  glow?: boolean | undefined;
  variant?: string | undefined;
}) {
  const sizeClasses = {
    xs: "size-6",
    sm: "size-7",
    md: "size-8",
    lg: "size-12",
    xl: "size-20",
  }[size];

  const roundedClasses = {
    xs: "rounded-sm",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  }[size];

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center select-none",
        sizeClasses,
        className
      )}
    >
      <img
        src="/favicon.png"
        alt="Xeno Craft"
        className={cn(
          "size-full object-contain",
          roundedClasses,
          glow && "drop-shadow-[0_0_12px_rgba(94,240,70,0.5)]"
        )}
      />
    </span>
  );
}

/**
 * Main brand logo: Standalone rounded favicon logo + bold "Xeno Craft" typography.
 */
export function Logo({
  className,
  size = "md",
  glow = true,
}: LogoProps) {
  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-[1.1rem]",
    lg: "text-xl",
    xl: "text-2xl",
  }[size];

  return (
    <span className={cn("inline-flex items-center gap-2.5 whitespace-nowrap select-none group", className)}>
      <LogoMark size={size} glow={glow} className="transition-transform duration-300 group-hover:scale-105" />
      <span className={cn("font-display font-extrabold tracking-tight text-white inline-block", textSizeClasses)}>
        Xeno Craft
      </span>
    </span>
  );
}

/**
 * Full Showcase Logo for preloader, splash, and modals.
 */
export function LogoFull({
  className,
  glow = true,
}: {
  className?: string;
  variant?: string;
  glow?: boolean;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 select-none text-center", className)}>
      <div className="relative group flex items-center justify-center">
        {glow && (
          <div
            className="absolute -inset-4 rounded-full bg-[#5ef046]/20 blur-2xl opacity-75 animate-pulse"
            aria-hidden="true"
          />
        )}
        <LogoMark size="xl" glow={true} />
      </div>
      <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
        Xeno Craft
      </span>
      <p className="text-[11px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
        Custom Merchandise & Corporate Apparel
      </p>
    </div>
  );
}
