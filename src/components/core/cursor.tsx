"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionEnv } from "./motion-root";

/**
 * A precise dot and a lagging ring. Over anything with data-cursor="label"
 * the ring opens up and shows that label.
 */
export function Cursor() {
  const { reduced } = useMotionEnv();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      const labelled = t?.closest<HTMLElement>("[data-cursor]");
      setLabel(labelled?.dataset.cursor ?? "");
      setHot(Boolean(t?.closest("a,button,input,textarea,select,label,[role='button']")));
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;
  const size = label ? 92 : hot ? 46 : 30;
  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden>
        <div className="-mt-[3px] -ml-[3px] h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
      </div>
      <div ref={ring} className="cursor-ring" aria-hidden>
        <div
          className="flex items-center justify-center rounded-full border transition-[width,height,margin,background-color,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            borderColor: label ? "var(--accent)" : "color-mix(in srgb, var(--ink) 45%, transparent)",
            background: label ? "var(--accent)" : "transparent",
          }}
        >
          {label ? <span className="mono text-[10px] text-[var(--accent-ink)]">{label}</span> : null}
        </div>
      </div>
    </>
  );
}
