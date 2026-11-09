"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>{}[]=+*";

/**
 * Text that decodes itself out of random glyphs, like a signal locking on.
 * Runs on mount (or when `play` turns true) and again on hover if `hover` is set.
 */
export function Scramble({
  text,
  className,
  play = true,
  hover = false,
  delay = 0,
  speed = 1,
}: {
  text: string;
  className?: string;
  play?: boolean;
  hover?: boolean;
  delay?: number;
  speed?: number;
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const dur = (300 + text.length * 28) / speed;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const settled = Math.floor(k * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < settled || ch === " ") s += ch;
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOut(s);
      if (k < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [text, speed]);

  useEffect(() => {
    if (!play) return;
    const t = setTimeout(run, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf.current);
    };
  }, [play, delay, run]);

  return (
    <span className={className} aria-label={text} onPointerEnter={hover ? run : undefined}>
      <span aria-hidden>{out}</span>
    </span>
  );
}
