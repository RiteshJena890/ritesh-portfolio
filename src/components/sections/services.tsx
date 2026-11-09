import { services } from "@/content/profile";
import { Reveal } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { SectionHead } from "@/components/ui/section-head";

export function Services() {
  return (
    <section id="services" className="section bg-[var(--bg-2)]" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead
          id="services-title"
          path="/what-i-do"
          title="What I build"
          lede="The work I do day to day at ITPlusPoint, with the tools I use for it."
        />
        <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={(i % 3) * 0.08} depth={28}>
              <Tilt className="service-card group relative flex h-full flex-col gap-5 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[var(--shadow)]">
                <div className="flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
                  <span className="font-mono text-sm text-[var(--ink-2)]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cube" aria-hidden>
                    {["f", "b", "l", "r", "t", "d"].map((f) => (
                      <i key={f} className={`cube-${f}`} />
                    ))}
                  </span>
                </div>
                <h3 className="text-[24px] leading-tight font-bold tracking-[-0.015em]" style={{ fontStretch: "112%", transform: "translateZ(30px)" }}>
                  {s.title}
                </h3>
                <p className="text-[15.5px] text-[var(--ink-2)]" style={{ transform: "translateZ(20px)" }}>
                  {s.body}
                </p>
                <div className="mt-auto flex flex-wrap gap-2" style={{ transform: "translateZ(24px)" }}>
                  {s.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </Tilt>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
