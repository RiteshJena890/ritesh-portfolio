"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { skillGroups } from "@/content/profile";
import { useMotionEnv } from "@/components/core/motion-root";

/*
  Section style: "orbital". Every skill is a label floating on a 3D sphere that
  sits over the particle globe. It turns on its own, you can throw it with the
  pointer, and choosing a layer on the left lights up that layer's skills.
*/
type Tag = { label: string; group: string };

export function Stack() {
  const root = useRef<HTMLElement>(null);
  const ball = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionEnv();
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo<Tag[]>(() => skillGroups.flatMap((g) => g.items.map((label) => ({ label, group: g.id }))), []);

  useEffect(() => {
    const el = ball.current;
    if (!el) return;
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-tag]"));
    const n = nodes.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const base = nodes.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return [Math.cos(golden * i) * r, y, Math.sin(golden * i) * r] as const;
    });

    let R = 200;
    const size = () => {
      R = el.clientWidth * 0.44;
    };
    size();
    window.addEventListener("resize", size);

    let rx = -0.25;
    let ry = 0;
    let vx = 0;
    let vy = reduced ? 0 : 0.0035;
    let dragging = false;
    let lx = 0;
    let ly = 0;
    let raf = 0;
    let visible = false;

    const render = () => {
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      for (let i = 0; i < n; i++) {
        const [x0, y0, z0] = base[i];
        const x1 = x0 * cy + z0 * sy;
        const z1 = -x0 * sy + z0 * cy;
        const y2 = y0 * cx - z1 * sx;
        const z2 = y0 * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back, 1 front
        const node = nodes[i];
        node.style.transform = `translate3d(${x1 * R}px, ${y2 * R}px, 0) translate(-50%, -50%) scale(${0.62 + depth * 0.55})`;
        node.style.zIndex = String(Math.round(depth * 100));
        node.style.setProperty("--depth", depth.toFixed(3));
      }
    };

    const tick = () => {
      if (!dragging) {
        ry += vy;
        rx += vx;
        vx *= 0.94;
        // ease back toward a gentle idle spin
        vy += ((reduced ? 0 : 0.0035) - vy) * 0.02;
        rx += (-0.25 - rx) * 0.01;
      }
      render();
      window.dispatchEvent(new CustomEvent("field:spin", { detail: ry }));
      raf = visible ? requestAnimationFrame(tick) : 0;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    render();

    const pd = (e: PointerEvent) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const pm = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      vy = dx * 0.006;
      vx = -dy * 0.006;
      ry += vy;
      rx = Math.max(-1.2, Math.min(1.2, rx + vx));
      if (reduced) render();
    };
    const pu = () => {
      dragging = false;
    };
    el.addEventListener("pointerdown", pd);
    el.addEventListener("pointermove", pm);
    el.addEventListener("pointerup", pu);
    el.addEventListener("pointercancel", pu);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      el.removeEventListener("pointerdown", pd);
      el.removeEventListener("pointermove", pm);
      el.removeEventListener("pointerup", pu);
      el.removeEventListener("pointercancel", pu);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".st-row",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.06, duration: 1, ease: "expo.out", scrollTrigger: { trigger: ".st-list", start: "top 80%" } },
      );
      gsap.fromTo(".st-ball", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".st-ball", start: "top 85%" } });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const current = skillGroups.find((g) => g.id === active);

  return (
    <section ref={root} id="stack" data-shape="3" data-alpha="0.4" className="relative py-28" aria-labelledby="stack-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="grid gap-8">
          <div className="grid gap-4">
            <span className="mono kicker">Stack · {tags.length} tools in orbit</span>
            <h2 id="stack-title" className="h-lg">
              The stack, layer by layer
            </h2>
            <p className="muted max-w-[46ch]">Pick a layer to light it up on the globe. Drag the globe to spin it.</p>
          </div>

          <ul className="st-list m-0 grid list-none p-0" role="list">
            {skillGroups.map((g) => {
              const on = active === g.id;
              return (
                <li key={g.id} className="st-row border-t border-[var(--line)] last:border-b">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setActive(on ? null : g.id)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(g.id)}
                    className="group grid w-full grid-cols-[44px_1fr_auto] items-center gap-3 py-3.5 text-left"
                  >
                    <span className="mono" style={{ color: on ? "var(--accent)" : "var(--ink-3)" }}>
                      {g.layer}
                    </span>
                    <span className="text-[18px] font-semibold tracking-[-0.01em] transition-transform duration-500 group-hover:translate-x-2" style={{ color: on ? "var(--accent)" : undefined }}>
                      {g.label}
                    </span>
                    <span className="mono muted tabular-nums">{String(g.items.length).padStart(2, "0")}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <ul className="sr-only">
            {skillGroups.map((g) => (
              <li key={g.id}>
                {g.label}: {g.items.join(", ")}
              </li>
            ))}
          </ul>
          <p className="mono min-h-[3.2em] muted" aria-hidden>
            {current ? current.items.join(" · ") : "All layers shown"}
          </p>
        </div>

        <div className="st-ball relative mx-auto aspect-square w-full max-w-[620px]">
          <div
            ref={ball}
            className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
            data-cursor="Spin"
            aria-hidden
          >
            {tags.map((t) => {
              const lit = !active || active === t.group;
              return (
                <span
                  key={t.label}
                  data-tag
                  className="absolute top-1/2 left-1/2 whitespace-nowrap rounded-full px-3 py-1.5 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.02em] uppercase will-change-transform"
                  style={{
                    opacity: `calc(${lit ? 0.25 : 0.06} + var(--depth, 0.5) * ${lit ? 0.75 : 0.12})`,
                    color: active && lit ? "var(--accent-ink)" : "var(--ink)",
                    background: active && lit ? "var(--accent)" : "var(--glass)",
                    border: `1px solid ${active && lit ? "var(--accent)" : "var(--line)"}`,
                    transition: "background-color .4s, color .4s, border-color .4s",
                  }}
                >
                  {t.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
