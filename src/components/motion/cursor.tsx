"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotionEnv } from "./motion-root";

/** A small ring that trails the pointer and grows over anything clickable. */
export function Cursor() {
  const { reduced } = useMotionEnv();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });
  const [mode, setMode] = useState<"idle" | "link" | "view">("idle");

  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const view = t?.closest("[data-cursor='view']");
      const link = t?.closest("a,button,[role='button'],input,textarea,label");
      setMode(view ? "view" : link ? "link" : "idle");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, x, y]);

  if (reduced) return null;
  const size = mode === "view" ? 84 : mode === "link" ? 44 : 14;
  return (
    <motion.div className="cursor" style={{ x: sx, y: sy }} aria-hidden>
      <motion.div
        animate={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="flex items-center justify-center rounded-full border border-[var(--ink)]"
        style={{
          background: mode === "view" ? "var(--mark)" : "transparent",
          borderColor: mode === "view" ? "var(--mark)" : "var(--ink)",
        }}
      >
        {mode === "view" ? (
          <span className="font-mono text-[11px] tracking-[0.1em] text-[var(--mark-ink)] uppercase">Open</span>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
