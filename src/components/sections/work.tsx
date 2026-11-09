"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/content/profile";
import { SectionHead } from "@/components/ui/section-head";
import { ProjectDiagram } from "@/components/ui/project-diagram";
import { Tilt } from "@/components/motion/tilt";
import { useMotionEnv } from "@/components/motion/motion-root";

const hashFor = (slug: string) => `#work-${slug}`;

export function Work() {
  const { reduced, lenis } = useMotionEnv();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((slug: string) => {
    lastFocus.current = document.activeElement as HTMLElement;
    setOpenSlug(slug);
    try {
      history.replaceState(null, "", hashFor(slug));
    } catch {}
  }, []);
  const close = useCallback(() => {
    setOpenSlug(null);
    try {
      history.replaceState(null, "", "#work");
    } catch {}
    lastFocus.current?.focus();
  }, []);

  // Deep links: #work-leadgen opens that project.
  useEffect(() => {
    const fromHash = () => {
      const m = location.hash.match(/^#work-(.+)$/);
      if (m && projects.some((p) => p.slug === m[1])) setOpenSlug(m[1]);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    if (openSlug) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && openSlug && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSlug, lenis, close]);

  // Desktop: pin the section and move the cards sideways while scrolling down.
  useEffect(() => {
    if (reduced || !section.current || !track.current) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const el = track.current!;
      const distance = () => Math.max(0, el.scrollWidth - el.clientWidth);
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      gsap.utils.toArray<HTMLElement>(".work-card-3d").forEach((card) => {
        gsap.fromTo(
          card,
          { rotateY: -18, z: -80 },
          {
            rotateY: 12,
            z: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
      return () => tween.scrollTrigger?.kill();
    });
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      clearTimeout(refresh);
      mm.revert();
    };
  }, [reduced]);

  const current = projects.find((p) => p.slug === openSlug) ?? null;

  return (
    <section ref={section} id="work" className="section overflow-hidden lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-[96px]" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead
          id="work-title"
          path="/work"
          title="Selected work"
          lede="Six products I built modules for at ITPlusPoint, plus my AI proofs of concept and chatbots. Open a project for the details."
        />
      </div>

      <div className="wrap lg:max-w-none lg:pr-0">
        <ul
          ref={track}
          className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:flex lg:w-full lg:gap-7 lg:overflow-visible"
          style={{ perspective: 1400 }}
        >
          {projects.map((p, i) => (
            <li key={p.slug} className="work-card-3d lg:w-[420px] lg:shrink-0" style={{ transformStyle: "preserve-3d" }}>
              <ProjectCard project={p} index={i} onOpen={() => open(p.slug)} />
            </li>
          ))}
          <li aria-hidden className="hidden lg:block lg:w-[8vw] lg:shrink-0" />
        </ul>
      </div>

      <AnimatePresence>{current ? <ProjectDetail key={current.slug} project={current} onClose={close} /> : null}</AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  return (
    <Tilt className="relative h-full rounded-[22px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow)] transition-colors hover:border-[var(--ink)]" max={8}>
      <button
        type="button"
        onClick={onOpen}
        data-cursor="view"
        className="flex h-full w-full cursor-pointer flex-col text-left"
        aria-label={`Open project details: ${project.name}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div layoutId={`media-${project.slug}`} className="overflow-hidden rounded-t-[22px] border-b border-[var(--line)] bg-[var(--bg)]" style={{ transform: "translateZ(20px)" }}>
          <ProjectDiagram project={project} index={index} />
        </motion.div>
        <div className="flex flex-1 flex-col gap-3 p-6" style={{ transform: "translateZ(36px)" }}>
          <div className="flex items-center justify-between gap-3">
            <span className="label">{project.kind}</span>
            <span className="font-mono text-xs text-[var(--ink-2)]">{String(index + 1).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}</span>
          </div>
          <motion.h3 layoutId={`title-${project.slug}`} className="text-[26px] leading-tight font-bold tracking-[-0.02em]" style={{ fontStretch: "112%" }}>
            {project.name}
          </motion.h3>
          <p className="text-[15px] text-[var(--ink-2)]">{project.overview}</p>
          <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold">
            View details <ArrowUpRight size={16} />
          </span>
        </div>
      </button>
    </Tilt>
  );
}

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const index = projects.findIndex((p) => p.slug === project.slug);
  useEffect(() => {
    closeBtn.current?.focus();
  }, []);

  return (
    <motion.div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby={`dlg-${project.slug}`}>
      <motion.button
        type="button"
        aria-label="Close project details"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[color-mix(in_srgb,var(--ink)_55%,transparent)] backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="relative max-h-[92svh] w-full max-w-[920px] overflow-y-auto rounded-t-[26px] border border-[var(--line)] bg-[var(--bg)] shadow-2xl sm:m-6 sm:rounded-[26px]"
        style={{ transformPerspective: 1400 }}
        initial={{ opacity: 0, rotateX: 18, y: 80 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        exit={{ opacity: 0, rotateX: -10, y: 40 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        data-lenis-prevent
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="sticky top-3 z-10 float-right mr-3 grid h-11 w-11 place-items-center rounded-full bg-[var(--ink)] text-[var(--bg)]"
          aria-label="Close project details"
        >
          <X size={18} />
        </button>
        <motion.div layoutId={`media-${project.slug}`} className="border-b border-[var(--line)] bg-[var(--bg-2)]">
          <div className="mx-auto max-w-[620px]">
            <ProjectDiagram project={project} index={100 + index} />
          </div>
        </motion.div>
        <div className="grid gap-8 p-6 sm:p-10">
          <div className="grid gap-3">
            <span className="label">{project.kind}</span>
            <motion.h3 layoutId={`title-${project.slug}`} id={`dlg-${project.slug}`} className="display text-[clamp(34px,5vw,60px)]">
              {project.name}
            </motion.h3>
            <p className="max-w-[60ch] text-[18px]">{project.overview}</p>
          </div>

          <dl className="grid gap-6 border-y border-[var(--line)] py-6 sm:grid-cols-3">
            <div className="grid gap-1">
              <dt className="label">My role</dt>
              <dd className="m-0 font-semibold">{project.role}</dd>
            </div>
            <div className="grid gap-1 sm:col-span-2">
              <dt className="label">Technology</dt>
              <dd className="m-0 flex flex-wrap gap-2">
                {project.stack.length ? (
                  project.stack.map((s) => (
                    <span key={s} className="tag">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-[var(--ink-2)]">Stack details on request</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="grid gap-10 sm:grid-cols-2">
            <div className="grid content-start gap-3">
              <h4 className="label">Key features</h4>
              <ul className="m-0 grid list-none gap-2 p-0">
                {project.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 rotate-45 bg-[var(--mark)] outline outline-1 outline-[var(--ink)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid content-start gap-3">
              <h4 className="label">What I did</h4>
              <ul className="m-0 grid list-none gap-2 p-0">
                {project.contributions.map((c) => (
                  <li key={c} className="flex gap-3">
                    <span aria-hidden className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[var(--ink)]" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="rounded-2xl border border-dashed border-[var(--line)] p-4 text-[14px] text-[var(--ink-2)]">
            No public demo or repository is linked for this project. The diagram above shows its main modules.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
