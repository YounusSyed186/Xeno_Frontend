import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LogoFull } from "./Logo";

export function Preloader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1600);
      setProgress(p);
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 300);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl px-4"
          exit={{ opacity: 0, filter: "blur(16px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-72 sm:size-96 rounded-full bg-[#5ef046]/10 blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            <LogoFull variant="gradient" glow={true} className="max-w-xs sm:max-w-md" />
          </motion.div>

          <div className="relative z-10 mt-8 h-1 w-48 sm:w-64 overflow-hidden rounded-full bg-white/10 border border-white/10 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#5ef046] via-[#38ef7d] to-[#11998e] shadow-[0_0_12px_rgba(94,240,70,0.8)] transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="relative z-10 mt-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            Loading {Math.round(progress * 100)}%
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
