"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Content rises out of the page plane: a slight 3D tilt that settles flat. */
export function Reveal({
  children,
  delay = 0,
  depth = 18,
  className,
  as = "div",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  depth?: number;
  className?: string;
  as?: "div" | "li" | "article" | "section" | "p";
} & Omit<HTMLMotionProps<"div">, "children">) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      style={{ transformPerspective: 900, transformOrigin: "50% 100%" }}
      initial={{ opacity: 0, y: 48, rotateX: depth, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
