"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Characters flip up into place around the X axis, like split-flap tiles.
 * Screen readers get the plain text once via aria-label.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.028,
  inView = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const words = text.split(" ");
  let i = 0;
  const trigger = inView
    ? { whileInView: "show" as const, viewport: { once: true, amount: 0.6 } }
    : { animate: "show" as const };
  return (
    <motion.span className={className} aria-label={text} role="text" initial="hide" {...trigger}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap" style={{ perspective: 600 }}>
          {Array.from(word).map((ch) => {
            const idx = i++;
            return (
              <motion.span
                key={idx}
                className="inline-block"
                style={{ transformOrigin: "50% 100% -0.4em", backfaceVisibility: "hidden" }}
                variants={{
                  hide: { opacity: 0, rotateX: -95, y: "0.25em" },
                  show: {
                    opacity: 1,
                    rotateX: 0,
                    y: 0,
                    transition: { duration: 0.9, ease, delay: delay + idx * stagger },
                  },
                }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
