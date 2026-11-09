"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowDownRight, ArrowUpRight, FileText } from "lucide-react";
import { hero, site } from "@/content/profile";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";
import { scrollToHash, useMotionEnv } from "@/components/motion/motion-root";
import { useIntroDone } from "./loader";

const StackScene = dynamic(() => import("@/components/three/stack-scene"), {
  ssr: false,
  loading: () => null,
});

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ready = useIntroDone();
  const { lenis, reduced } = useMotionEnv();
  const go = (h: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToHash(h, lenis);
  };

  const facts = [
    ["Since", "Nov 2023 at ITPlusPoint"],
    ["Built", "6 products, plus AI POCs"],
    ["Awarded", "Power Programmer 2025"],
  ];

  return (
    <section id="top" className="relative overflow-hidden pt-[96px] lg:min-h-[100svh]">
      {/* 3D stack: right half on desktop, a band above the text on phones */}
      <div className="relative h-[46vh] min-h-[300px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%]">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.6, ease, delay: 0.2 }}
        >
          <StackScene reduced={reduced} />
        </motion.div>
      </div>

      <div className="wrap relative grid gap-10 pb-16 lg:min-h-[calc(100svh-96px)] lg:content-center lg:pb-24">
        <div className="grid max-w-[720px] gap-7">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, ease }}
          >
            <span className="relative block h-12 w-12 overflow-hidden rounded-full ring-2 ring-[var(--mark)] ring-offset-2 ring-offset-[var(--bg)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- 48px avatar; works in the static preview too */}
              <img src={site.photo} alt="Portrait of Ritesh Jena" width={48} height={48} className="h-full w-full object-cover" fetchPriority="high" />
            </span>
            <span className="label">{hero.eyebrow}</span>
          </motion.div>

          <h1 className="display text-[clamp(56px,11vw,152px)]">
            {ready ? <SplitText text={site.name} stagger={0.045} /> : <span className="opacity-0">{site.name}</span>}
          </h1>

          <p className="text-[clamp(22px,2.7vw,34px)] leading-[1.18] font-medium tracking-[-0.01em]" style={{ perspective: 800 }}>
            {hero.headline.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  style={{ transformOrigin: "0% 100%" }}
                  initial={{ y: "105%", rotateX: -40, opacity: 0 }}
                  animate={ready ? { y: "0%", rotateX: 0, opacity: 1 } : undefined}
                  transition={{ duration: 1, ease, delay: 0.55 + i * 0.09 }}
                >
                  {i === hero.headline.length - 1 ? <span className="mark">{line}</span> : line}
                </motion.span>
              </span>
            ))}
          </p>

          <motion.p
            className="max-w-[54ch] text-[var(--ink-2)]"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease, delay: 1 }}
          >
            {hero.intro}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.9, ease, delay: 1.15 }}
          >
            <Magnetic>
              <a href="#work" onClick={go("#work")} className="btn btn-primary">
                Explore projects <ArrowDownRight size={18} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.resume} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <FileText size={18} /> Resume
              </a>
            </Magnetic>
            <a href="#contact" onClick={go("#contact")} className="link-sweep ml-2 inline-flex items-center gap-1 py-3 text-[15px] font-semibold">
              Get in touch <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        <motion.dl
          className="grid max-w-[720px] grid-cols-1 gap-x-8 gap-y-3 border-t border-[var(--line)] pt-6 sm:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 1, delay: 1.35 }}
        >
          {facts.map(([k, v]) => (
            <div key={k} className="grid gap-1">
              <dt className="label">{k}</dt>
              <dd className="m-0 text-[15px] font-semibold">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
