"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { certifications, education, recognition } from "@/content/profile";
import { useMotionEnv } from "@/components/core/motion-root";

/*
  Section style: "spotlight index". A plain typographic index of awards,
  certificates and education. Hover a line and a card lifts off the page,
  follows the pointer and leans with your speed, like a slide under a loupe.
*/
type Row = { id: string; group: string; title: string; by: string; date: string; body?: string };

const rows: Row[] = [
  ...recognition.map((r, i) => ({ id: `r${i}`, group: "Recognition", title: r.title, by: r.issuer, date: r.date, body: r.body })),
  ...certifications.map((c, i) => ({ id: `c${i}`, group: "Certificates", title: c.title, by: c.issuer, date: c.date })),
  ...education.map((e, i) => ({ id: `e${i}`, group: "Education", title: e.degree, by: `${e.school}, ${e.place}`, date: e.years })),
];
const groups = ["Recognition", "Certificates", "Education"];

export function Recognition() {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionEnv();
  const [hover, setHover] = useState<Row | null>(null);
  const [fine, setFine] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches); // eslint-disable-line react-hooks/set-state-in-effect -- reads a media query once on mount
  }, []);

  // the floating card trails the pointer and skews with velocity
  useEffect(() => {
    if (!fine || !card.current) return;
    const el = card.current;
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const tgt = { ...pos };
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tgt.x = e.clientX;
      tgt.y = e.clientY;
    };
    const tick = () => {
      const vx = tgt.x - pos.x;
      const vy = tgt.y - pos.y;
      pos.x += vx * (reduced ? 1 : 0.14);
      pos.y += vy * (reduced ? 1 : 0.14);
      const rotY = reduced ? 0 : gsap.utils.clamp(-28, 28, vx * 0.25);
      const rotX = reduced ? 0 : gsap.utils.clamp(-22, 22, -vy * 0.25);
      el.style.transform = `translate3d(${pos.x + 56}px, ${pos.y - 150}px, 0) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    let visible = false;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    if (root.current) io.observe(root.current);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [fine, reduced]);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".rc-row").forEach((el) => {
        gsap.fromTo(el.querySelector(".rc-line"), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%" } });
        gsap.fromTo(el.querySelectorAll(".rc-cell"), { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 92%" } });
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="recognition" data-shape="6" data-alpha="0.32" className="relative py-28" aria-labelledby="rec-title">
      <div className="wrap grid gap-14">
        <div className="grid gap-4">
          <span className="mono kicker">Recognition · certificates · education</span>
          <h2 id="rec-title" className="h-lg max-w-[16ch]">
            On the record
          </h2>
        </div>

        <div className="grid gap-16" onPointerLeave={() => setHover(null)}>
          {groups.map((g) => (
            <div key={g} className="grid gap-2">
              <h3 className="mono muted">{g}</h3>
              <ul className="m-0 list-none p-0">
                {rows
                  .filter((r) => r.group === g)
                  .map((r) => {
                    const expanded = openId === r.id;
                    return (
                      <li key={r.id} className="rc-row relative" onPointerEnter={(e) => e.pointerType === "mouse" && setHover(r)}>
                        <span className="rc-line absolute inset-x-0 top-0 h-px origin-left bg-[var(--line)]" aria-hidden />
                        <button
                          type="button"
                          onClick={() => setOpenId(expanded ? null : r.id)}
                          aria-expanded={expanded}
                          className="group grid w-full grid-cols-1 items-baseline gap-1 overflow-hidden py-5 text-left sm:grid-cols-[1fr_minmax(0,0.7fr)_110px] sm:gap-6"
                        >
                          <span className="rc-cell block font-[family-name:var(--font-display)] text-[clamp(20px,2.4vw,34px)] leading-[1.1] font-medium tracking-[-0.035em] transition-[color,transform] duration-500 group-hover:translate-x-3 group-hover:text-[var(--accent)]">
                            {r.title}
                          </span>
                          <span className="rc-cell block muted text-[15px]">{r.by}</span>
                          <span className="rc-cell mono block tabular-nums sm:text-right">{r.date || "—"}</span>
                        </button>
                        <div className={`grid transition-[grid-template-rows] duration-500 ${expanded || (!fine && r.body) ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                          <div className="overflow-hidden">
                            <p className="muted max-w-[60ch] pb-5 text-[15px]">{r.body ?? `${r.title}, ${r.by}${r.date ? `, ${r.date}` : ""}.`}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {fine ? (
        <div ref={card} className="pointer-events-none fixed top-0 left-0 z-[70] w-[300px] will-change-transform" aria-hidden>
          <div
            className="glass grid gap-3 rounded-[18px] border border-[var(--accent)] p-5 shadow-[0_30px_80px_-30px_color-mix(in_srgb,var(--accent)_60%,transparent)] transition-[opacity,scale] duration-300"
            style={{ opacity: hover ? 1 : 0, scale: hover ? "1" : "0.85" }}
          >
            {hover ? (
              <>
                <div className="mono flex justify-between gap-3">
                  <span className="text-[var(--accent)]">{hover.group}</span>
                  <span className="muted">{hover.date}</span>
                </div>
                <div className="font-[family-name:var(--font-display)] text-[20px] leading-[1.1] font-semibold tracking-[-0.03em]">{hover.title}</div>
                <div className="text-[14px] muted">{hover.by}</div>
                {hover.body ? <div className="text-[13.5px]">{hover.body}</div> : null}
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
