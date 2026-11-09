import { Award, BadgeCheck, GraduationCap } from "lucide-react";
import { certifications, education, recognition } from "@/content/profile";
import { Reveal } from "@/components/motion/reveal";
import { Tilt } from "@/components/motion/tilt";
import { SectionHead } from "@/components/ui/section-head";

export function Recognition() {
  return (
    <section id="recognition" className="section" aria-labelledby="recognition-title">
      <div className="wrap">
        <SectionHead
          id="recognition-title"
          path="/recognition"
          title="Recognition and learning"
          lede="An award, hackathon mentoring, and the certifications and education behind the work."
        />

        <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-3">
          {recognition.map((r, i) => (
            <Reveal as="li" key={r.title} delay={i * 0.08} depth={32}>
              <Tilt className="relative flex h-full flex-col gap-4 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[var(--shadow)]">
                <span className="coin" aria-hidden style={{ transform: "translateZ(50px)" }}>
                  <span className="coin-face">
                    <Award size={22} />
                  </span>
                </span>
                <span className="font-mono text-[13px] font-semibold" style={{ transform: "translateZ(30px)" }}>
                  {r.date}
                </span>
                <h3 className="text-[22px] leading-tight font-bold tracking-[-0.015em]" style={{ fontStretch: "112%", transform: "translateZ(30px)" }}>
                  {r.title}
                </h3>
                <p className="label" style={{ transform: "translateZ(20px)" }}>{r.issuer}</p>
                <p className="text-[15.5px] text-[var(--ink-2)]" style={{ transform: "translateZ(20px)" }}>
                  {r.body}
                </p>
              </Tilt>
            </Reveal>
          ))}
        </ul>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid content-start gap-4">
            <Reveal depth={0}>
              <h3 className="flex items-center gap-2 text-[22px] font-bold">
                <BadgeCheck size={22} /> Certifications
              </h3>
            </Reveal>
            <ul className="m-0 grid list-none p-0">
              {certifications.map((c, i) => (
                <Reveal as="li" key={c.title} delay={i * 0.05} depth={0}>
                  <div className="cert-row grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-[var(--line)] py-4">
                    <span className="font-semibold">{c.title}</span>
                    <span className="font-mono text-[13px] text-[var(--ink-2)]">{c.date}</span>
                    <span className="label col-span-2">{c.issuer}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-4">
            <Reveal depth={0}>
              <h3 className="flex items-center gap-2 text-[22px] font-bold">
                <GraduationCap size={22} /> Education
              </h3>
            </Reveal>
            {education.map((e) => (
              <Reveal key={e.school} depth={24}>
                <div className="grid gap-2 rounded-[20px] bg-[var(--ink)] p-7 text-[var(--bg)]">
                  <span className="font-mono text-[13px] text-[var(--mark)]">{e.years}</span>
                  <span className="text-[22px] leading-tight font-bold" style={{ fontStretch: "112%" }}>
                    {e.degree}
                  </span>
                  <span>{e.school}</span>
                  <span className="text-sm opacity-70">{e.place}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
