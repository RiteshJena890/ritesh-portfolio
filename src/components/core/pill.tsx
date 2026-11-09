"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, PointerEvent, ReactNode } from "react";

/** Records where the pointer entered so the fill grows from that point. */
function origin(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--fx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--fy", `${e.clientY - r.top}px`);
}

function useMagnet(strength = 0.35) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });
  const move = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return { sx, sy, move, leave };
}

export function PillLink({
  children,
  variant = "solid",
  className = "",
  ...rest
}: { children: ReactNode; variant?: "solid" | "ghost" } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const m = useMagnet();
  return (
    <motion.span className="inline-flex" style={{ x: m.sx, y: m.sy }} onPointerMove={m.move} onPointerLeave={m.leave}>
      <a {...rest} onPointerEnter={origin} onPointerLeave={origin} className={`pill pill-${variant} ${className}`}>
        {children}
      </a>
    </motion.span>
  );
}

export function PillButton({
  children,
  variant = "solid",
  className = "",
  ...rest
}: { children: ReactNode; variant?: "solid" | "ghost" } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const m = useMagnet(0.25);
  return (
    <motion.span className="inline-flex" style={{ x: m.sx, y: m.sy }} onPointerMove={m.move} onPointerLeave={m.leave}>
      <button {...rest} onPointerEnter={origin} onPointerLeave={origin} className={`pill pill-${variant} ${className}`}>
        {children}
      </button>
    </motion.span>
  );
}
