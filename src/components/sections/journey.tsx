"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { milestones, roles } from "@/content/profile";
import { useMotionEnv } from "@/components/core/motion-root";

/*
  Section style: "time tunnel". The section pins and you fly forward through
  time: each role hangs at its own depth and rushes past the camera as you
  scroll, while the particle rings stream around you.
*/
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toNum = (d: string) => {
  const [m, y] = d.split(" ");
  return Number(y) * 12 + MONTHS.indexOf(m);
};

type Stop = { date: string; title: string; meta: string; body: string; tags: string[]; milestone?: boolean };

const GAP = 1100; // px of depth between stops

export function Journey() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotionEnv();
  const [idx, setIdx] = useState(0);
  const wideRef = useRef(true);

  const stops = useMemo<Stop[]>(() => {
    const r: (Stop & { k: number })[] = roles.map((x, i) => ({
      date: x.start === x.end ? x.start : `${x.start} → ${x.end}`,
      title: x.title,
      meta: `${x.type} · ${x.duration}`,
      body: x.summary,
      tags: x.skills,
      k: toNum(x.start) * 10 + (roles.length - i) * 0.01,
    }));
    const m = milestones.map((x) => ({ date: x.date, title: x.label.split(",")[0], meta: "Milestone", body: x.label, tags: [], milestone: true, k: toNum(x.date) * 10 }));
    return [...r, ...m].sort((a, b) => a.k - b.k);
  }, []);

  useEffect(() => {
    const q = () => (wideRef.current = window.innerWidth >= 768);
    q();
    window.addEventListener("resize", q);
    return () => window.removeEventListener("resize", q);
  }, []);

  useEffect(() => {
    if (reduced || !root.current) return;
    const cards = gsap.utils.toArray<HTMLElement>(".jr-stop", root.current);
    const n = cards.length;
    const place = (p: number) => {
      const cam = p * (n - 1) * GAP;
      cards.forEach((c, i) => {
        const z = cam - i * GAP; // 0 means at focus, positive means behind the viewer
        const side = wideRef.current ? (i % 2 ? 1 : -1) : 0;
        const x = side * Math.min(window.innerWidth * 0.2, 280);
        const fadeIn = gsap.utils.clamp(0, 1, 1 + z / (GAP * 2.4));
        const fadeOut = gsap.utils.clamp(0, 1, 1 - z / (GAP * 0.55));
        c.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${-side * 10}deg)`;
        c.style.opacity = String(fadeIn * fadeOut);
        c.style.filter = `blur(${Math.max(0, -z / GAP - 0.25) * 4}px)`;
        c.style.visibility = fadeIn * fadeOut < 0.01 ? "hidden" : "visible";
      });
      setIdx(Math.min(n - 1, Math.round(p * (n - 1))));
    };
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".jr-pin",
        start: "top top",
        end: `+=${(n - 1) * 70 + 60}%`,
        pin: true,
        scrub: 0.9,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.6 }, delay: 0.15, ease: "power2.inOut" },
        onUpdate: (s) => place(s.progress),
      });
    }, root);
    place(0);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="journey" data-shape="4" data-alpha="0.75" className="relative" aria-labelledby="journey-title">
      <div className="jr-pin relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-8">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <div className="grid gap-4">
            <span className="mono kicker">Journey · Nov 2023 → now</span>
            <h2 id="journey-title" className="h-lg max-w-[14ch]">
              Six roles, one company
            </h2>
          </div>
          {!reduced ? (
            <div className="mono grid justify-items-end gap-1 tabular-nums" aria-hidden>
              <span className="text-[var(--accent)]">{stops[idx]?.date.split(" → ")[0]}</span>
              <span className="muted">
                {String(idx + 1).padStart(2, "0")} / {String(stops.length).padStart(2, "0")}
              </span>
            </div>
          ) : null}
        </div>

        {reduced ? (
          <ol className="wrap mt-12 grid list-none gap-4 p-0">
            {stops.map((s) => (
              <li key={s.title + s.date}>
                <StopCard s={s} />
              </li>
            ))}
          </ol>
        ) : (
          <>
            <ol className="relative m-0 grid flex-1 list-none place-items-center p-0 [perspective:900px] [perspective-origin:50%_45%]">
              {stops.map((s, i) => (
                <li key={s.title + s.date} className="jr-stop w-[min(540px,86vw)] [grid-area:1/1] will-change-transform" aria-current={i === idx ? "step" : undefined}>
                  <StopCard s={s} />
                </li>
              ))}
            </ol>
            {/* time ruler */}
            <div className="wrap" aria-hidden>
              <div className="relative h-px bg-[var(--line)]">
                <div className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-[width] duration-500" style={{ width: `${(idx / Math.max(1, stops.length - 1)) * 100}%` }} />
                {stops.map((s, i) => (
                  <span
                    key={i}
                    className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500"
                    style={{
                      left: `${(i / (stops.length - 1)) * 100}%`,
                      background: i <= idx ? "var(--accent)" : "var(--bg)",
                      borderColor: i <= idx ? "var(--accent)" : "var(--ink-3)",
                    }}
                  />
                ))}
              </div>
              <div className="mono mt-3 flex justify-between muted">
                <span>Nov 2023</span>
                <span>Scroll to travel</span>
                <span>2026</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function StopCard({ s }: { s: Stop }) {
  return (
    <article
      className="glass grid gap-4 rounded-[20px] border p-6 sm:p-8"
      style={{ borderColor: s.milestone ? "var(--accent)" : "var(--line)" }}
    >
      <div className="mono flex flex-wrap items-center justify-between gap-2">
        <span className={s.milestone ? "text-[var(--accent)]" : ""}>{s.date}</span>
        <span className="muted">{s.meta}</span>
      </div>
      <h3 className="h-md">{s.title}</h3>
      <p className="muted text-[15px]">{s.body}</p>
      {s.tags.length ? (
        <div className="flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      ) : null}
      {s.milestone ? null : <span className="mono muted">ITPlusPoint · Bhubaneswar</span>}
    </article>
  );
}
