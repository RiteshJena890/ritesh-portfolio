"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/profile";
import { scrollToHash, useMotionEnv } from "./motion-root";
import { Scramble } from "./scramble";

export const SECTIONS = [
  { id: "top", label: "Signal" },
  { id: "about", label: "About" },
  { id: "capabilities", label: "Capabilities" },
  { id: "stack", label: "Stack" },
  { id: "journey", label: "Journey" },
  { id: "work", label: "Work" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
];

function useClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => {
      const a = document.documentElement.getAttribute("data-theme");
      setDark(a ? a === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
    };
    read();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setDark(!dark);
  };
  return { dark, toggle };
}

function useActiveSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.45;
      let idx = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= y) idx = i;
      });
      setActive(idx);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return { active, progress };
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const { lenis } = useMotionEnv();
  const clock = useClock();
  const { dark, toggle } = useTheme();
  const { active, progress } = useActiveSection();

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    setTimeout(() => scrollToHash(`#${id}`, lenis), wasOpen ? 650 : 0);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90]" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="wrap flex h-[76px] items-center justify-between gap-4">
          <a href="#top" onClick={go("top")} className="group flex items-center gap-3" aria-label="Ritesh Jena, back to top">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-[11px] bg-[var(--ink)] font-[family-name:var(--font-display)] text-[13px] font-bold text-[var(--bg)]">
              <span className="transition-transform duration-500 group-hover:-translate-y-10">RJ</span>
              <span className="absolute translate-y-10 transition-transform duration-500 group-hover:translate-y-0">↑</span>
            </span>
            <span className="mono hidden sm:inline">
              <Scramble text="Ritesh Jena" hover />
            </span>
          </a>

          <div className="mono hidden items-center gap-2 md:flex" aria-label="Local time in Bhubaneswar">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            <span className="muted">Bhubaneswar</span>
            <span className="tabular-nums">{clock || "--:--:--"} IST</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="glass mono grid h-11 place-items-center rounded-full border border-[var(--line)] px-4"
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
            >
              {dark ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="mono flex h-11 items-center gap-3 rounded-full bg-[var(--ink)] px-5 text-[var(--bg)]"
            >
              <span className="relative block h-[10px] w-[18px]" aria-hidden>
                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-500 ${open ? "top-[4px] rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-all duration-500 ${open ? "top-[4px] -rotate-45" : "top-[8px]"}`} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {/* Section rail: where you are in the story */}
      <nav aria-label="Sections" className="fixed top-1/2 right-[max(14px,env(safe-area-inset-right,0px))] z-[80] hidden -translate-y-1/2 xl:block">
        <ol className="m-0 grid list-none gap-3 p-0">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={go(s.id)} className="group flex items-center justify-end gap-3" aria-current={i === active ? "true" : undefined}>
                <span className={`mono transition-all duration-500 ${i === active ? "opacity-100" : "translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}>{s.label}</span>
                <span
                  className="block h-[2px] rounded-full transition-all duration-500"
                  style={{ width: i === active ? 28 : 12, background: i === active ? "var(--accent)" : "var(--ink-3)" }}
                />
              </a>
            </li>
          ))}
        </ol>
        <div className="mono mt-5 text-right tabular-nums muted">{String(Math.round(progress * 100)).padStart(3, "0")}%</div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[85] overflow-y-auto bg-[color-mix(in_srgb,var(--bg)_94%,transparent)] backdrop-blur-xl"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(100% 0 0 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <div className="wrap grid min-h-full gap-10 pt-28 pb-10 lg:grid-cols-[1fr_320px]">
              <ol className="m-0 grid list-none content-center gap-0 p-0">
                {SECTIONS.map((s, i) => (
                  <li key={s.id} className="overflow-hidden">
                    <motion.a
                      href={`#${s.id}`}
                      onClick={go(s.id)}
                      className="group flex items-baseline gap-5 py-1"
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "-110%" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.18 + i * 0.045 }}
                    >
                      <span className="mono w-7 muted">{String(i).padStart(2, "0")}</span>
                      <span className="font-[family-name:var(--font-display)] text-[clamp(34px,6.4vw,92px)] leading-[1.02] font-semibold tracking-[-0.04em] transition-[color,letter-spacing] duration-500 group-hover:text-[var(--accent)] group-hover:tracking-[-0.01em]">
                        <Scramble text={s.label} hover />
                      </span>
                    </motion.a>
                  </li>
                ))}
              </ol>
              <motion.aside
                className="grid content-end gap-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
                exit={{ opacity: 0 }}
              >
                <div className="grid gap-1">
                  <span className="mono muted">Write</span>
                  <a className="ulink text-lg font-semibold" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </div>
                <div className="grid gap-1">
                  <span className="mono muted">Elsewhere</span>
                  <div className="flex flex-wrap gap-4 font-semibold">
                    <a className="ulink" href={site.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn ↗
                    </a>
                    {site.github ? (
                      <a className="ulink" href={site.github} target="_blank" rel="noreferrer">
                        GitHub ↗
                      </a>
                    ) : null}
                    <a className="ulink" href={site.resume} target="_blank" rel="noreferrer">
                      Resume ↗
                    </a>
                  </div>
                </div>
              </motion.aside>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
