"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { projects, type Project } from "@/content/profile";
import { useMotionEnv } from "@/components/core/motion-root";
import { PillButton } from "@/components/core/pill";

/*
  Section style: "deck". Projects are a physical stack of cards. Each one slides
  over the last, and the cards underneath sink, tilt back and dim. Opening a case
  study tears a circular hole in the page from the point you clicked.
*/
export function Work() {
  const root = useRef<HTMLElement>(null);
  const { reduced, lenis } = useMotionEnv();
  const [open, setOpen] = useState<{ p: Project; x: number; y: number } | null>(null);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".wk-card");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card.querySelector(".wk-inner"), {
          scale: 0.9,
          rotateX: 9,
          y: -30,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      });
      gsap.fromTo(".wk-head-line", { yPercent: 110 }, { yPercent: 0, stagger: 0.1, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".wk-head", start: "top 80%" } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <section ref={root} id="work" data-shape="5" data-alpha="0.55" className="relative pt-28 pb-24" aria-labelledby="work-title">
      <div className="wk-head wrap mb-14 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <h2 id="work-title" className="h-xl">
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="wk-head-line block">Selected</span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span className="wk-head-line block text-[var(--accent)]">work</span>
          </span>
        </h2>
        <p className="muted max-w-[40ch] lg:text-right">
          Seven projects from my work at ITPlusPoint. None of them has a public demo or repository I can link, so each case study tells you what I built instead.
        </p>
      </div>

      <ol className="wrap m-0 grid list-none gap-6 p-0 [perspective:1400px]">
        {projects.map((p, i) => (
          <li key={p.slug} className="wk-card sticky" style={{ top: `calc(88px + ${i * 12}px)`, zIndex: i + 1 }}>
            <article className="wk-inner grid min-h-[min(640px,76svh)] origin-top overflow-hidden rounded-[26px] border border-[var(--line)] will-change-transform lg:grid-cols-[1.1fr_0.9fr]" style={{ background: "var(--bg-2)", boxShadow: "0 -20px 60px -30px rgba(0,0,0,.35)" }}>
              <div className="flex flex-col justify-between gap-8 p-6 sm:p-10">
                <div className="mono flex items-center justify-between gap-4">
                  <span className="text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                  <span className="muted text-right">{p.kind}</span>
                </div>
                <div className="grid gap-5">
                  <h3 className="text-[clamp(34px,5vw,76px)] leading-[0.95] tracking-[-0.045em]">{p.name}</h3>
                  <p className="muted max-w-[52ch] text-[16px]">{p.overview}</p>
                  <ul className="m-0 grid list-none gap-1.5 p-0 text-[15px]">
                    {p.features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className="mt-[0.65em] h-px w-4 shrink-0 bg-[var(--accent)]" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <PillButton
                    variant="solid"
                    onClick={(e) => {
                      const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setOpen({ p, x: r.left + r.width / 2, y: r.top + r.height / 2 });
                    }}
                    aria-haspopup="dialog"
                  >
                    Open case <span aria-hidden>→</span>
                  </PillButton>
                  {p.stack.slice(0, 3).map((s) => (
                    <span key={s} className="chip hidden sm:inline-flex">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative hidden min-h-[320px] border-t border-[var(--line)] lg:block lg:border-t-0 lg:border-l">
                <Orbit p={p} />
              </div>
            </article>
          </li>
        ))}
      </ol>

      <AnimatePresence>{open ? <CaseStudy key={open.p.slug} {...open} onClose={() => setOpen(null)} /> : null}</AnimatePresence>
    </section>
  );
}

/** A module diagram: the product at the core, its features in orbit. */
function Orbit({ p }: { p: Project }) {
  const nodes = p.features;
  const initials = p.name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden" aria-hidden>
      <div className="absolute aspect-square w-[66%] rounded-full border border-dashed border-[var(--line)]" />
      <div className="absolute aspect-square w-[38%] rounded-full border border-[var(--line)]" />
      <div className="orbit-spin absolute aspect-square w-[66%]">
        {nodes.map((f, i) => {
          const a = (i / nodes.length) * 360;
          return (
            <div key={f} className="absolute h-0 w-0" style={{ left: `${50 + Math.cos((a * Math.PI) / 180) * 50}%`, top: `${50 + Math.sin((a * Math.PI) / 180) * 50}%` }}>
              <div className="orbit-spin-rev -translate-x-1/2 -translate-y-1/2">
                <span className="chip max-w-[130px] !whitespace-normal bg-[var(--bg)] text-center leading-snug">{f}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative grid h-28 w-28 place-items-center rounded-full bg-[var(--ink)] text-[var(--bg)] shadow-[0_0_0_10px_color-mix(in_srgb,var(--accent)_16%,transparent)]">
        <span className="font-[family-name:var(--font-display)] text-[28px] font-bold tracking-[-0.04em]">{initials}</span>
      </div>
      <span className="mono absolute bottom-5 left-6 muted">Module map · {nodes.length} parts</span>
    </div>
  );
}

function CaseStudy({ p, x, y, onClose }: { p: Project; x: number; y: number; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`case-${p.slug}`}
      className="fixed inset-0 z-[120] overflow-y-auto bg-[var(--bg)]"
      initial={{ clipPath: `circle(0px at ${x}px ${y}px)` }}
      animate={{ clipPath: `circle(150vmax at ${x}px ${y}px)` }}
      exit={{ clipPath: `circle(0px at ${x}px ${y}px)` }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      data-lenis-prevent
    >
      <div className="wrap grid gap-12 pt-24 pb-20">
        <div className="flex items-start justify-between gap-6">
          <span className="mono kicker">Case study · {p.kind}</span>
          <button ref={closeBtn} type="button" onClick={onClose} className="mono flex h-11 items-center gap-3 rounded-full bg-[var(--ink)] px-5 text-[var(--bg)]">
            Close <span aria-hidden>✕</span>
          </button>
        </div>
        <motion.h2
          id={`case-${p.slug}`}
          className="h-xl max-w-[14ch]"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {p.name}
        </motion.h2>
        <motion.div
          className="grid gap-12 lg:grid-cols-[1.2fr_1fr]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="grid content-start gap-10">
            <p className="text-[clamp(18px,1.6vw,22px)]">{p.overview}</p>
            <Block title="What I built">
              <ol className="m-0 grid list-none gap-4 p-0">
                {p.contributions.map((c, i) => (
                  <li key={c} className="grid grid-cols-[36px_1fr] gap-3 border-t border-[var(--line)] pt-4">
                    <span className="mono text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ol>
            </Block>
          </div>
          <div className="grid content-start gap-10">
            <Block title="Role">
              <p>{p.role}</p>
            </Block>
            <Block title="Features">
              <ul className="m-0 grid list-none gap-2 p-0">
                {p.features.map((f) => (
                  <li key={f} className="muted">
                    {f}
                  </li>
                ))}
              </ul>
            </Block>
            {p.stack.length ? (
              <Block title="Stack">
                <div className="flex flex-wrap gap-2">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </Block>
            ) : null}
            <p className="mono rounded-[12px] border border-dashed border-[var(--line)] p-4 muted">
              Built at ITPlusPoint. There is no public demo or repository to link for this project.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4">
      <h3 className="mono muted">{title}</h3>
      {children}
    </div>
  );
}
