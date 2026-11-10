"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { about, manifesto } from "@/content/profile";
import { useMotionEnv } from "@/components/core/motion-root";

/*
  Section style: "exposure". The manifesto is pinned and each word develops
  from a faint ghost into full ink as you scroll, like a photo in a darkroom.
*/
export function About() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useMotionEnv();
  const words = manifesto.split(" ");

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ".mf-pin", start: "top top", end: "+=180%", pin: true, scrub: 0.6 },
      });
      tl.fromTo(".mf-word", { opacity: 0.12, filter: "blur(6px)" }, { opacity: 1, filter: "blur(0px)", stagger: 0.08, ease: "none" })
        .fromTo(".mf-accent", { color: "var(--ink)" }, { color: "var(--accent)", stagger: 0.1 }, "-=1.2")
        .fromTo(".mf-meta", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1 }, "-=0.6");

      gsap.utils.toArray<HTMLElement>(".pr-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)", y: 40 },
          { clipPath: "inset(0% 0 0 0)", y: 0, duration: 1.2, ease: "expo.out", delay: i * 0.08, scrollTrigger: { trigger: el, start: "top 88%" } },
        );
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const accentWords = new Set(["SQL", "screen,", "AI"]);

  return (
    <section ref={root} id="about" className="relative" aria-labelledby="about-title">
      <div data-shape="1" data-alpha="0.3">
      <div className="mf-pin flex min-h-[100svh] items-center py-28">
        <div className="wrap grid gap-10">
          <h2 id="about-title" className="mono kicker">
            About · 2023 → now
          </h2>
          <p className="max-w-[22ch] font-[family-name:var(--font-display)] text-[clamp(30px,5vw,80px)] leading-[1.02] font-medium tracking-[-0.045em] sm:max-w-[24ch]">
            {words.map((w, i) => (
              <span key={i} className={`mf-word inline-block whitespace-pre ${accentWords.has(w) ? "mf-accent" : ""}`}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </p>
          <dl className="grid max-w-[880px] grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
            {[
              ["Roles", "6 at ITPlusPoint"],
              ["Stack", ".NET · React · SQL"],
              ["Lately", "Agentic AI"],
              ["Award", "Power Programmer 2025"],
            ].map(([k, v]) => (
              <div key={k} className="mf-meta grid gap-1 border-t border-[var(--line)] pt-3">
                <dt className="mono muted">{k}</dt>
                <dd className="m-0 text-[15px] font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      </div>

      {/* reading block: the ribbon fades almost out so the text stays clear */}
      <div data-shape="1" data-alpha="0.06" className="wrap grid gap-16 pb-32 lg:grid-cols-[1fr_1fr]">
        <div className="grid content-start gap-6 text-[clamp(16px,1.25vw,18.5px)]">
          {about.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "" : "muted"}>
              {p}
            </p>
          ))}
        </div>
        <ol className="m-0 grid list-none content-start gap-0 p-0">
          {about.principles.map((p, i) => (
            <li key={p.title} className="pr-item grid grid-cols-[52px_1fr] gap-x-4 border-t border-[var(--line)] py-7">
              <span className="font-[family-name:var(--font-display)] text-[34px] leading-none font-light text-[var(--accent)]">{i + 1}</span>
              <div className="grid gap-2">
                <h3 className="text-[22px] tracking-[-0.03em]">{p.title}</h3>
                <p className="muted text-[15.5px]">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
