"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/profile";
import { scrollToHash, useMotionEnv } from "@/components/motion/motion-root";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      setDark(attr ? attr === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
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

export function Nav() {
  const [open, setOpen] = useState(false);
  const { lenis } = useMotionEnv();
  const { dark, toggle } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToHash(href, lenis), open ? 450 : 0);
  };

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[90] h-[3px] origin-left bg-[var(--mark)]"
        style={{ scaleX: progress }}
      />
      <header
        className="fixed inset-x-0 top-0 z-[80]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <a
            href="#top"
            onClick={go("#top")}
            className="group flex items-center gap-3 rounded-full bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] py-1.5 pr-4 pl-1.5 backdrop-blur-md"
            aria-label="Ritesh Jena, back to top"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--ink)] font-mono text-[13px] font-bold text-[var(--bg)] transition-transform duration-500 group-hover:rotate-[360deg]">
              RJ
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{site.name}</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] p-1.5 backdrop-blur-md">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={go(n.href)}
                    className="block rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_80%,transparent)] backdrop-blur-md transition-colors hover:border-[var(--ink)]"
            >
              <motion.span key={dark ? "d" : "l"} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="flex h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-4 text-sm font-semibold text-[var(--bg)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--bg)_40%,transparent)]"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
              <span>{open ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[70] overflow-y-auto bg-[var(--bg)]"
            initial={{ clipPath: "circle(0% at calc(100% - 60px) 36px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 60px) 36px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 60px) 36px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="wrap flex min-h-full flex-col justify-between gap-12 pt-28 pb-10">
              <ol className="grid gap-1" style={{ perspective: 900 }}>
                {[{ href: "#top", label: "Home" }, ...nav].map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, rotateX: -70, y: 40 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "50% 100%" }}
                  >
                    <a
                      href={n.href}
                      onClick={go(n.href)}
                      className="group flex items-baseline gap-4 py-1 no-underline"
                    >
                      <span className="label w-8">{String(i).padStart(2, "0")}</span>
                      <span className="display text-[clamp(40px,8vw,104px)] transition-transform duration-300 group-hover:translate-x-3">
                        <span className="menu-word">{n.label}</span>
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ol>
              <motion.div
                className="flex flex-wrap items-end justify-between gap-6 border-t border-[var(--line)] pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
              >
                <div className="grid gap-1">
                  <span className="label">Email</span>
                  <a className="link-sweep text-lg font-semibold" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </div>
                <div className="flex gap-5 text-sm font-semibold">
                  <a className="link-sweep" href={site.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                  {site.github ? (
                    <a className="link-sweep" href={site.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                  <a className="link-sweep" href={site.resume} target="_blank" rel="noreferrer">
                    Resume (PDF)
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
