"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award } from "lucide-react";
import { milestones, roles } from "@/content/profile";
import { SectionHead } from "@/components/ui/section-head";
import { useMotionEnv } from "@/components/motion/motion-root";

type Entry =
  | { kind: "role"; key: string; date: string; role: (typeof roles)[number] }
  | { kind: "milestone"; key: string; date: string; label: string };

// Oldest first, so the timeline reads as a journey. Trainee began in Feb 2024,
// overlapping the two one-month internships in Mar 2024.
const order = ["Pre-internship", "Software Engineer Internship", "Trainee", "UI & UX Internship", "Internship Trainee, Testing", "Software Consultant"];
const entries: Entry[] = [
  ...order.map((t) => {
    const role = roles.find((r) => r.title === t)!;
    return { kind: "role" as const, key: t, date: role.start, role };
  }),
  ...milestones.map((m) => ({ kind: "milestone" as const, key: m.label, date: m.date, label: m.label })),
];

export function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionEnv();

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tl-spine-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".tl-list", start: "top 70%", end: "bottom 60%", scrub: 0.6 },
        },
      );
      gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el) => {
        const fromLeft = el.dataset.side === "left";
        gsap.fromTo(
          el.querySelector(".tl-card"),
          { opacity: 0, rotateY: fromLeft ? 35 : -35, x: fromLeft ? -50 : 50, z: -120 },
          {
            opacity: 1,
            rotateY: 0,
            x: 0,
            z: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" },
          },
        );
        gsap.fromTo(
          el.querySelector(".tl-dot"),
          { scale: 0 },
          { scale: 1, duration: 0.5, ease: "back.out(3)", scrollTrigger: { trigger: el, start: "top 75%" } },
        );
      });
    }, root);
    const refresh = setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      clearTimeout(refresh);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section id="experience" className="section bg-[var(--bg-2)]" aria-labelledby="experience-title">
      <div className="wrap" ref={root}>
        <SectionHead
          id="experience-title"
          path="/experience"
          title="Three years at ITPlusPoint"
          lede="Every role so far has been at ITPlusPoint in Bhubaneswar. Each step added a new part of the stack."
        />

        <ol className="tl-list relative m-0 list-none p-0">
          <span aria-hidden className="tl-spine">
            <span className="tl-spine-fill" />
          </span>
          {entries.map((e, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li key={e.key} className="tl-item" data-side={side}>
                <span aria-hidden className={`tl-dot ${e.kind === "milestone" ? "tl-dot-mark" : ""}`} />
                <div className="tl-card">
                  {e.kind === "role" ? (
                    <article className="grid gap-3 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] sm:p-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono text-[13px] font-semibold">
                          {e.role.start === e.role.end ? e.role.start : `${e.role.start} – ${e.role.end}`}
                        </span>
                        <span className="label">
                          {e.role.type} · {e.role.duration}
                        </span>
                      </div>
                      <h3 className="text-[clamp(22px,2.4vw,28px)] leading-tight font-bold tracking-[-0.02em]" style={{ fontStretch: "112%" }}>
                        {e.role.end === "Present" ? <span className="mark">{e.role.title}</span> : e.role.title}
                      </h3>
                      <p className="text-[15.5px] text-[var(--ink-2)]">{e.role.summary}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {e.role.skills.map((s) => (
                          <span key={s} className="tag">
                            {s}
                          </span>
                        ))}
                      </div>
                    </article>
                  ) : (
                    <div className="flex items-center gap-4 rounded-[20px] border border-dashed border-[var(--ink)] p-5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--mark)] text-[var(--mark-ink)]">
                        <Award size={20} />
                      </span>
                      <div className="grid gap-0.5">
                        <span className="font-mono text-[13px] font-semibold">{e.date}</span>
                        <span className="font-semibold">{e.label}</span>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
