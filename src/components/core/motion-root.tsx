"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

type Ctx = { lenis: Lenis | null; reduced: boolean };
const MotionCtx = createContext<Ctx>({ lenis: null, reduced: false });
export const useMotionEnv = () => useContext(MotionCtx);

export function scrollToHash(hash: string, lenis: Lenis | null) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function MotionRoot({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onRefresh = () => window.dispatchEvent(new Event("field:measure"));
    ScrollTrigger.addEventListener("refresh", onRefresh);
    if (reduced) return () => ScrollTrigger.removeEventListener("refresh", onRefresh);
    const instance = new Lenis({ duration: 1.25, smoothWheel: true, wheelMultiplier: 0.95, anchors: { duration: 1.6 } });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists after mount
    setLenis(instance);
    const late = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 1200);
    return () => {
      clearTimeout(late);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return (
    <MotionCtx.Provider value={{ lenis, reduced }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionCtx.Provider>
  );
}
