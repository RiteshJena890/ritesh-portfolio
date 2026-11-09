"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { projects, skillGroups } from "@/content/profile";
import { SectionHead } from "@/components/ui/section-head";
import { Reveal } from "@/components/motion/reveal";

const usedIn = (item: string) => projects.filter((p) => p.stack.includes(item)).map((p) => p.name);

export function Stack() {
  const [active, setActive] = useState(1);
  const group = skillGroups[active];

  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHead
          id="stack-title"
          path="/stack"
          title="The stack, layer by layer"
          lede="Only tools I have used at work. Pick a layer to lift it out of the stack."
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          {/* Isometric plates */}
          <Reveal depth={0}>
            <div className="iso-wrap" role="tablist" aria-label="Skill layers" aria-orientation="vertical">
              <div className="iso">
                {skillGroups.map((g, i) => {
                  const on = i === active;
                  return (
                    <motion.button
                      key={g.id}
                      type="button"
                      role="tab"
                      id={`tab-${g.id}`}
                      aria-selected={on}
                      aria-controls="stack-panel"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="iso-plate"
                      data-on={on}
                      style={{ zIndex: skillGroups.length - i }}
                      initial={false}
                      animate={{
                        z: (skillGroups.length - i) * 34 + (on ? 70 : 0),
                        x: on ? -18 : 0,
                        y: on ? -18 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 210, damping: 22 }}
                    >
                      <span className="font-mono text-[11px]">{g.layer}</span>
                      <span className="text-[15px] font-bold">{g.label}</span>
                      <span className="ml-auto font-mono text-[11px] opacity-70">{g.items.length}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Detail panel */}
          <div id="stack-panel" role="tabpanel" aria-labelledby={`tab-${group.id}`} className="min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.id}
                initial={{ opacity: 0, rotateY: -25, x: 30 }}
                animate={{ opacity: 1, rotateY: 0, x: 0 }}
                exit={{ opacity: 0, rotateY: 20, x: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformPerspective: 1000 }}
                className="grid gap-6"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-[var(--ink-2)]">{group.layer}</span>
                  <h3 className="display text-[clamp(36px,4.5vw,60px)]">{group.label}</h3>
                </div>
                <ul className="m-0 grid list-none gap-0 p-0">
                  {group.items.map((item, i) => {
                    const where = usedIn(item);
                    return (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 * i, duration: 0.4 }}
                        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--line)] py-3.5"
                      >
                        <span className="text-[18px] font-semibold">{item}</span>
                        {where.length ? (
                          <span className="font-mono text-[12px] text-[var(--ink-2)]">used in {where.join(", ")}</span>
                        ) : null}
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
