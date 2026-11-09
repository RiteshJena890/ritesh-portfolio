import { about } from "@/content/profile";
import { Reveal } from "@/components/motion/reveal";
import { SectionHead } from "@/components/ui/section-head";

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead
          id="about-title"
          path="/about"
          title="From pre-intern to consultant"
          lede={
            <>
              Six roles at one company in three years. Each one added a layer: <span className="mark" data-sweep>database, backend, interface, testing, then AI.</span>
            </>
          }
        />
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="grid gap-6 text-[clamp(17px,1.45vw,19px)]">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
          <div className="grid content-start gap-4">
            <Reveal depth={0}>
              <span className="label">How I work</span>
            </Reveal>
            <ol className="m-0 grid list-none gap-4 p-0">
              {about.principles.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 0.1} depth={30}>
                  <div className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
                    <span className="font-mono text-sm text-[var(--ink-2)] row-span-2">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="text-[20px] font-bold tracking-[-0.01em]" style={{ fontStretch: "110%" }}>
                      {p.title}
                    </h3>
                    <p className="text-[15.5px] text-[var(--ink-2)]">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
