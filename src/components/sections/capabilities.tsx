"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/content/profile";
import { useMotionEnv } from "@/components/core/motion-root";

/*
  Section style: "carousel drum". The six services sit on the faces of a 3D
  cylinder that turns as you scroll (and as you drag), while the particle ring
  spins behind it. The face that turns toward you lights up.
*/
const N = services.length;
const STEP = 360 / N;

export function Capabilities() {
  const root = useRef<HTMLElement>(null);
  const drum = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionEnv();
  const [front, setFront] = useState(0);
  const [radius, setRadius] = useState(520);
  const radiusRef = useRef(520);

  useEffect(() => {
    const size = () => {
      const w = window.innerWidth;
      const face = Math.min(440, w * 0.78);
      // apothem of a hexagon whose side is the face width, plus some air
      const r = (face / 2 / Math.tan(Math.PI / N)) * 1.08;
      radiusRef.current = r;
      setRadius(r);
    };
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, []);

  useEffect(() => {
    if (reduced || !root.current || !drum.current) return;
    const el = drum.current;
    const state = { scroll: 0, drag: 0 };
    const apply = () => {
      const a = state.scroll + state.drag;
      el.style.transform = `translateZ(${-radiusRef.current}px) rotateX(-8deg) rotateY(${-a}deg)`;
      const idx = ((Math.round(a / STEP) % N) + N) % N;
      setFront(idx);
      window.dispatchEvent(new CustomEvent("field:spin", { detail: a / 60 }));
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".cap-pin",
        start: "top top",
        end: "+=240%",
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          state.scroll = self.progress * STEP * (N - 1);
          apply();
        },
      });
    }, root);

    // drag to spin, with a spring back to the nearest face
    let down = false;
    let lastX = 0;
    const stage = el.parentElement!;
    const pd = (e: PointerEvent) => {
      down = true;
      lastX = e.clientX;
      stage.setPointerCapture(e.pointerId);
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      state.drag += (lastX - e.clientX) * 0.25;
      lastX = e.clientX;
      apply();
    };
    const pu = () => {
      if (!down) return;
      down = false;
      const total = state.scroll + state.drag;
      const snapped = Math.round(total / STEP) * STEP;
      gsap.to(state, { drag: snapped - state.scroll, duration: 0.9, ease: "elastic.out(1, 0.6)", onUpdate: apply });
    };
    stage.addEventListener("pointerdown", pd);
    stage.addEventListener("pointermove", pm);
    stage.addEventListener("pointerup", pu);
    stage.addEventListener("pointercancel", pu);
    apply();
    return () => {
      ctx.revert();
      stage.removeEventListener("pointerdown", pd);
      stage.removeEventListener("pointermove", pm);
      stage.removeEventListener("pointerup", pu);
      stage.removeEventListener("pointercancel", pu);
      window.dispatchEvent(new CustomEvent("field:spin", { detail: 0 }));
    };
  }, [reduced]);

  return (
    <section ref={root} id="capabilities" data-shape="2" data-alpha="0.35" className="relative" aria-labelledby="cap-title">
      <div className="cap-pin relative flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-10">
        <div className="wrap flex flex-wrap items-end justify-between gap-6">
          <div className="grid gap-4">
            <span className="mono kicker">What I do</span>
            <h2 id="cap-title" className="h-lg max-w-[12ch]">
              Six things I get paid to do
            </h2>
          </div>
          <div className="mono grid gap-1 text-right tabular-nums" aria-hidden>
            <span className="text-[var(--accent)]">
              {String(front + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
            </span>
            <span className="muted hidden sm:inline">Scroll or drag the drum</span>
          </div>
        </div>

        {reduced ? (
          <ol className="wrap mt-12 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.id}>
                <Face s={s} i={i} active />
              </li>
            ))}
          </ol>
        ) : (
          <div className="relative flex flex-1 touch-pan-y items-center justify-center select-none [perspective:1600px]" data-cursor="Drag">
            <div ref={drum} className="relative h-[min(420px,62svh)] w-[min(440px,78vw)] [transform-style:preserve-3d]">
              {services.map((s, i) => (
                <div
                  key={s.id}
                  className="absolute inset-0 [backface-visibility:hidden]"
                  style={{ transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)` }}
                  aria-hidden={i !== front}
                >
                  <Face s={s} i={i} active={i === front} />
                </div>
              ))}
            </div>
          </div>
        )}

        {!reduced ? (
          <div className="wrap mt-6 flex justify-center gap-2" aria-hidden>
            {services.map((s, i) => (
              <span
                key={s.id}
                className="h-[3px] rounded-full transition-all duration-500"
                style={{ width: i === front ? 34 : 10, background: i === front ? "var(--accent)" : "var(--line)" }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Face({ s, i, active }: { s: (typeof services)[number]; i: number; active: boolean }) {
  return (
    <article
      className="glass relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[22px] border p-7 transition-[border-color,opacity,filter] duration-700"
      style={{
        borderColor: active ? "var(--accent)" : "var(--line)",
        opacity: active ? 1 : 0.42,
        filter: active ? "none" : "saturate(0.4)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-[family-name:var(--font-display)] text-[64px] leading-none font-extralight tracking-[-0.06em] text-[var(--accent)]">
          {String(i + 1).padStart(2, "0")}
        </span>
        <span className="mono muted">Capability</span>
      </div>
      <div className="grid gap-4">
        <h3 className="h-md">{s.title}</h3>
        <p className="muted text-[15px]">{s.body}</p>
        <div className="flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
      {/* scanline that sweeps the active face */}
      {active ? <span aria-hidden className="cap-scan pointer-events-none absolute inset-x-0 h-24" /> : null}
    </article>
  );
}
