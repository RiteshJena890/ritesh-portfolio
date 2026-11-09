"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

type Ctx = { lenis: Lenis | null; reduced: boolean };
const MotionCtx = createContext<Ctx>({ lenis: null, reduced: false });
export const useMotionEnv = () => useContext(MotionCtx);

export function scrollToHash(hash: string, lenis: Lenis | null) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset: -8, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function MotionRoot({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [reduced, setReduced] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduced(mq.matches);
      document.documentElement.classList.toggle("js-motion", !mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the instance only exists after mount
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduced]);

  // Highlighter sweeps: any .mark[data-sweep] lights up when it scrolls into view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".mark[data-sweep]"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-on"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-on");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -15% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <MotionCtx.Provider value={{ lenis, reduced }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionCtx.Provider>
  );
}
