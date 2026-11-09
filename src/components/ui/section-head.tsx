import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import type { ReactNode } from "react";

export function SectionHead({
  path,
  title,
  lede,
  id,
}: {
  path: string;
  title: string;
  lede?: ReactNode;
  id: string;
}) {
  return (
    <header className="section-head">
      <Reveal depth={0}>
        <span className="label">{path}</span>
      </Reveal>
      <h2 id={id}>
        <SplitText text={title} inView stagger={0.022} />
      </h2>
      {lede ? (
        <Reveal delay={0.15}>
          <p className="lede">{lede}</p>
        </Reveal>
      ) : null}
    </header>
  );
}
