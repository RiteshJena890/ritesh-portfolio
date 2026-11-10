"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { hero, site } from "@/content/profile";
import { Scramble } from "@/components/core/scramble";
import { PillLink } from "@/components/core/pill";
import { scrollToHash, useMotionEnv } from "@/components/core/motion-root";

const ease = [0.16, 1, 0.3, 1] as const;

/** Counts 0 → 100 while the particle field condenses into the name. */
function useCompile(reduced: boolean) {
  const [n, setN] = useState(reduced ? 100 : 0);
  useEffect(() => {
    if (reduced) {
      setN(100); // eslint-disable-line react-hooks/set-state-in-effect -- reduced motion skips the count
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 2400);
      setN(Math.round((1 - Math.pow(1 - k, 2.4)) * 100));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  return n;
}

export function Hero() {
  const { reduced, lenis } = useMotionEnv();
  const n = useCompile(reduced);
  const done = n >= 100;
  const words = hero.tagline.split(" ");

  return (
    <section id="top" data-shape="0" className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-[96px] pb-8" aria-labelledby="hero-name">
      {/* HUD: top corners read like an instrument */}
      <div className="wrap flex items-start justify-between gap-6">
        <motion.div className="mono grid gap-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
          <span className="kicker">
            <Scramble text={hero.role} delay={300} />
          </span>
          <span className="muted">
            <Scramble text={`${hero.company} · ${hero.since}`} delay={500} />
          </span>
        </motion.div>
        <motion.div className="mono hidden text-right sm:grid sm:gap-0.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
          <Scramble text={hero.coords} delay={600} />
          <span className="muted">
            <Scramble text={hero.place} delay={800} />
          </span>
        </motion.div>
      </div>

      {/* The name is drawn by the particle field; this is the accessible and no-WebGL version */}
      <div id="hero-stage" className="wrap relative flex min-h-[30svh] flex-1 items-center justify-center max-md:min-h-[34svh]">
        <h1 id="hero-name" className="gl-name-fallback h-xl text-center font-bold">
          {site.name}
        </h1>
        <motion.div
          className="mono pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 tabular-nums"
          animate={{ opacity: done ? 0 : 1 }}
          transition={{ duration: 0.6, delay: done ? 0.4 : 0 }}
          aria-hidden
        >
          Compiling signal {String(n).padStart(3, "0")}%
        </motion.div>
      </div>

      <div className="wrap grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <p className="max-w-[24ch] font-[family-name:var(--font-display)] text-[clamp(22px,2.5vw,36px)] leading-[1.12] font-medium tracking-[-0.03em]">
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="inline-block whitespace-pre"
              initial={{ opacity: 0, filter: "blur(14px)", y: 14 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{ duration: 1.1, ease, delay: 1.6 + i * 0.05 }}
            >
              {w === "AI" ? <span className="text-[var(--accent)]">{w}</span> : w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </p>

        <motion.div
          className="grid gap-6 lg:justify-items-end"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 2.3 }}
        >
          <p className="max-w-[44ch] text-[15.5px] muted lg:text-right">{hero.intro}</p>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <PillLink
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#work", lenis);
              }}
              variant="solid"
            >
              See the work <span aria-hidden>↓</span>
            </PillLink>
            <PillLink href={site.resume} target="_blank" rel="noreferrer" variant="ghost">
              Resume <span aria-hidden>↗</span>
            </PillLink>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="wrap mt-8 flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 1 }}
      >
        <span className="mono muted hidden md:inline">Move your cursor through the name</span><span className="md:hidden" />
        <span className="mono flex items-center gap-3 muted">
          Scroll
          <span className="relative block h-8 w-px overflow-hidden bg-[var(--line)]" aria-hidden>
            <span className="scroll-cue absolute inset-x-0 top-0 h-3 bg-[var(--ink)]" />
          </span>
        </span>
      </motion.div>
    </section>
  );
}
