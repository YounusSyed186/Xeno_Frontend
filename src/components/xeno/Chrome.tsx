import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent-gradient"
    />
  );
}

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -400, y: -400 });
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setFine(true);
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!fine) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[60] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14] blur-[90px]"
      style={{
        left: pos.x,
        top: pos.y,
        background: "var(--gradient-accent)",
        transition: "left 120ms linear, top 120ms linear",
      }}
    />
  );
}
