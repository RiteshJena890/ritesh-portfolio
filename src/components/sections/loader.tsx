"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, useSyncExternalStore } from "react";

/* Intro sequence state, shared with the hero so it starts right as the loader leaves. */
let done = false;
const listeners = new Set<() => void>();
function finish() {
  done = true;
  listeners.forEach((l) => l());
}
export function useIntroDone() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => done,
    () => false,
  );
}

const LINES = [
  "GET /ritesh-jena HTTP/1.1",
  "→ ASP.NET MVC · route matched",
  "→ SQL Server · 6 roles, 7 projects",
  "→ LLM · context loaded",
  "200 OK",
];

export function Loader() {
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("intro") === "1";
      sessionStorage.setItem("intro", "1");
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- skip the intro on repeat visits
      setShow(false);
      finish();
      return;
    }
    const start = performance.now();
    const total = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / total);
      setCount(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
      else
        setTimeout(() => {
          setShow(false);
          finish();
        }, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const visibleLines = Math.min(LINES.length, Math.floor(count / 20) + 1);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="loader"
          className="intro-loader fixed inset-0 z-[150]"
          style={{ perspective: 1200 }}
          exit={{ pointerEvents: "none" }}
          role="status"
          aria-label="Loading"
        >
          {[0, 1].map((half) => (
            <motion.div
              key={half}
              className="absolute inset-x-0 bg-[var(--ink)]"
              style={{ top: half ? "50%" : 0, height: "50.5%", transformOrigin: half ? "50% 100%" : "50% 0%" }}
              exit={{ rotateX: half ? -80 : 80, y: half ? "100%" : "-100%", opacity: 0.4 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            />
          ))}
          <motion.div
            className="wrap relative flex h-full flex-col justify-between py-10 text-[var(--bg)]"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <div className="font-mono text-[13px] leading-7 opacity-80">
              {LINES.slice(0, visibleLines).map((l) => (
                <div key={l} className={l === "200 OK" ? "text-[var(--mark)]" : undefined}>
                  {l}
                </div>
              ))}
            </div>
            <div className="flex items-end justify-between gap-6">
              <span className="display text-[clamp(28px,5vw,56px)]">Ritesh Jena</span>
              <span className="display tabular-nums text-[clamp(64px,14vw,180px)] leading-none text-[var(--mark)]">
                {count.toString().padStart(3, "0")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
