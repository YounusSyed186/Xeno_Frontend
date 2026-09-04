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
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoFull className="h-40 w-40 sm:h-56 sm:w-56" />
          </motion.div>
          <div className="mt-2 h-px w-40 overflow-hidden bg-border sm:w-56">
            <div
              className="h-full bg-accent-gradient"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
