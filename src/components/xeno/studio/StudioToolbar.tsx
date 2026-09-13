"use client";

import React from "react";
import {
  LayoutTemplate,
  Upload,
  Type,
  Shapes,
  Palette,
  Printer,
  Move,
  Layers,
  SlidersHorizontal,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StudioToolTab =
  | "templates"
  | "upload"
  | "text"
  | "graphics"
  | "colors"
  | "print"
  | "placement"
  | "layers"
  | "options";

interface ToolItem {
  id: StudioToolTab;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

interface ToolGroup {
  name: string;
  tools: ToolItem[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    name: "Design",
    tools: [
      { id: "templates", label: "Templates", icon: LayoutTemplate },
      { id: "upload", label: "Upload", icon: Upload },
      { id: "text", label: "Text", icon: Type },
      { id: "graphics", label: "Graphics", icon: Shapes },
    ],
  },
  {
    name: "Appearance",
    tools: [
      { id: "colors", label: "Apparel", icon: Palette },
      { id: "print", label: "Print Tech", icon: Printer },
    ],
  },
  {
    name: "Layout",
    tools: [
      { id: "placement", label: "Position", icon: Move },
      { id: "layers", label: "Layers", icon: Layers },
      { id: "options", label: "Specs", icon: SlidersHorizontal },
    ],
  },
];

interface StudioToolbarProps {
  activeTab: StudioToolTab | null;
  onSelectTab: (tab: StudioToolTab) => void;
  className?: string;
  artworkCount?: number;
}

export function StudioToolbar({
  activeTab,
  onSelectTab,
  className,
  artworkCount = 0,
}: StudioToolbarProps) {
  return (
    <nav
      aria-label="Studio Tools"
      className={cn(
        "w-20 shrink-0 border-r border-white/10 bg-neutral-950/80 backdrop-blur-xl flex flex-col items-center py-3.5 space-y-4 select-none overflow-y-auto no-scrollbar",
        className
      )}
    >
      {TOOL_GROUPS.map((group, idx) => (
        <div key={group.name} className="w-full flex flex-col items-center space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500 mb-1 px-2 text-center">
            {group.name}
          </span>
          <div className="w-full px-2 space-y-1">
            {group.tools.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              const showBadge = t.id === "upload" && artworkCount > 0;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onSelectTab(t.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "group relative w-full flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 scale-[1.02]"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                  title={t.label}
                >
                  <Icon
                    className={cn(
                      "size-5 transition-transform group-hover:scale-110",
                      isActive ? "text-neutral-950" : "text-neutral-400 group-hover:text-white"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] mt-1 tracking-tight truncate max-w-full font-medium leading-tight",
                      isActive ? "text-neutral-950 font-bold" : "text-neutral-400 group-hover:text-neutral-200"
                    )}
                  >
                    {t.label}
                  </span>

                  {/* Active Indicator Pip */}
                  {isActive && (
                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary" />
                  )}

                  {/* Artwork Upload Badge */}
                  {showBadge && (
                    <span className="absolute top-1 right-1 size-4 rounded-full bg-primary text-neutral-950 text-[9px] font-extrabold flex items-center justify-center shadow-xs">
                      {artworkCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {idx < TOOL_GROUPS.length - 1 && (
            <div className="w-8 h-px bg-white/10 my-1 self-center" />
          )}
        </div>
      ))}
    </nav>
  );
}
