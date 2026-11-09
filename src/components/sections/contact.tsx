"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/profile";
import { contactSchema } from "@/lib/contact-schema";
import { useMotionEnv } from "@/components/core/motion-root";
import { PillButton } from "@/components/core/pill";
import { Scramble } from "@/components/core/scramble";

/*
  Section style: "pressure type". The headline is set in a variable font and
  every letter gains or loses weight as the pointer comes near, as if the type
  reacts to touch. The form reads as a sentence you fill in.
*/
const HEAD = ["Let's build", "something."];
const isPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

type Field = "name" | "email" | "subject" | "message";
type Status = { kind: "idle" | "sending" | "sent" | "error"; msg?: string };

export function Contact() {
  const head = useRef<HTMLHeadingElement>(null);
  const { reduced } = useMotionEnv();

  useEffect(() => {
    const el = head.current;
    if (!el || reduced) return;
    const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-l]"));
    const cur = letters.map(() => 300);
    const goal = letters.map(() => 300);
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    let visible = false;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const tick = () => {
      const fall = Math.max(160, window.innerWidth * 0.16);
      letters.forEach((l, i) => {
        const r = l.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
        const k = Math.max(0, 1 - d / fall);
        goal[i] = 220 + k * k * 680;
        cur[i] += (goal[i] - cur[i]) * 0.14;
        l.style.fontWeight = String(Math.round(cur[i]));
        l.style.color = k > 0.55 ? "var(--accent)" : "";
      });
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });
    // touch: a slow breathing wave runs through the letters instead
    const touch = !window.matchMedia("(hover: hover)").matches;
    let wave = 0;
    if (touch) {
      const t0 = performance.now();
      const loop = (now: number) => {
        const t = (now - t0) / 1000;
        letters.forEach((l, i) => (l.style.fontWeight = String(Math.round(450 + Math.sin(t * 1.6 - i * 0.35) * 330))));
        wave = requestAnimationFrame(loop);
      };
      wave = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(wave);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <section id="contact" data-shape="7" data-alpha="0.3" className="relative overflow-hidden pt-32" aria-labelledby="contact-title">
      <div className="wrap grid gap-16">
        <div className="grid gap-6">
          <span className="mono kicker">Contact · open to conversations</span>
          <h2 ref={head} id="contact-title" aria-label={HEAD.join(" ")} className="text-[clamp(52px,11vw,200px)] leading-[0.9] font-[300] tracking-[-0.05em]">
            {HEAD.map((line, li) => (
              <span key={li} className="block whitespace-nowrap" aria-hidden>
                {Array.from(line).map((ch, i) => (
                  <span key={i} data-l className="inline-block transition-colors duration-300" style={{ fontWeight: 300 }}>
                    {ch === " " ? " " : ch}
                  </span>
                ))}
              </span>
            ))}
          </h2>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.65fr]">
          <SentenceForm />
          <aside className="grid content-start gap-8">
            <EmailCopy />
            <div className="grid gap-2">
              <span className="mono muted">Elsewhere</span>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[17px] font-semibold">
                <a className="ulink" href={site.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn ↗
                </a>
                {site.github ? (
                  <a className="ulink" href={site.github} target="_blank" rel="noreferrer">
                    GitHub ↗
                  </a>
                ) : null}
                <a className="ulink" href={site.resume} target="_blank" rel="noreferrer">
                  Resume (PDF) ↗
                </a>
              </div>
            </div>
            <div className="grid gap-2">
              <span className="mono muted">Based in</span>
              <span className="text-[17px] font-semibold">{site.location}</span>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </section>
  );
}

function EmailCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };
  return (
    <div className="grid gap-2">
      <span className="mono muted">Email</span>
      <a href={`mailto:${site.email}`} className="ulink w-fit text-[clamp(18px,1.7vw,24px)] font-semibold break-all">
        {site.email}
      </a>
      <button type="button" onClick={copy} className="mono w-fit rounded-full border border-[var(--line)] px-4 py-2 transition-colors hover:border-[var(--accent)]" aria-live="polite">
        {copied ? <Scramble text="Copied to clipboard" /> : "Copy address"}
      </button>
    </div>
  );
}

function SentenceForm() {
  const [values, setValues] = useState<Record<Field | "company", string>>({ name: "", email: "", subject: "", message: "", company: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (k: Field | "company") => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k as Field]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fe: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as Field;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      const first = (["name", "email", "subject", "message"] as Field[]).find((k) => fe[k]);
      if (first) document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    if (isPreview) {
      setStatus({ kind: "error", msg: `Sending is switched off in this preview. Please email ${site.email} instead.` });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Partial<Record<Field, string>> };
      if (res.ok && data.ok) {
        setStatus({ kind: "sent" });
        setValues({ name: "", email: "", subject: "", message: "", company: "" });
      } else {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        setStatus({ kind: "error", msg: data.error ?? `The message could not be sent. Please email ${site.email}.` });
      }
    } catch {
      setStatus({ kind: "error", msg: `The message could not be sent. Please email ${site.email}.` });
    }
  };

  const inline = (k: Field, placeholder: string, type = "text", width = "11ch", autoComplete?: string) => (
    <span className="relative inline-block align-baseline">
      <label htmlFor={`cf-${k}`} className="sr-only">
        {placeholder}
      </label>
      <input
        id={`cf-${k}`}
        type={type}
        value={values[k]}
        onChange={set(k)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `cf-${k}-err` : undefined}
        className="mx-1 max-w-full min-w-0 border-0 border-b-2 bg-transparent px-1 font-[inherit] text-[var(--accent)] outline-none placeholder:text-[var(--ink-3)] focus:border-[var(--accent)]"
        style={{ width: `max(${width}, ${Math.min(28, values[k].length + 1)}ch)`, borderColor: errors[k] ? "var(--danger)" : "var(--line)" }}
      />
    </span>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-8" aria-describedby="cf-status">
      <p className="font-[family-name:var(--font-display)] text-[clamp(22px,2.6vw,38px)] leading-[1.6] font-light tracking-[-0.03em]">
        Hi Ritesh, I&apos;m {inline("name", "your name", "text", "9ch", "name")}. You can reach me at {inline("email", "you@email.com", "email", "13ch", "email")}. I&apos;d like to talk about{" "}
        {inline("subject", "a project (optional)", "text", "14ch")}.
      </p>
      <div className="grid gap-2">
        <label htmlFor="cf-message" className="mono muted">
          The details
        </label>
        <textarea
          id="cf-message"
          rows={5}
          value={values.message}
          onChange={set("message")}
          placeholder="What are you building, and where could I help?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
          className="glass w-full resize-y rounded-[16px] border p-5 text-[16px] outline-none placeholder:text-[var(--ink-3)] focus:border-[var(--accent)]"
          style={{ borderColor: errors.message ? "var(--danger)" : "var(--line)" }}
        />
        <span className="mono muted tabular-nums">{values.message.trim().length} / 4000</span>
      </div>
      {/* honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Company
          <input tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
        </label>
      </div>
      <ul className="m-0 grid list-none gap-1 p-0 text-[14px] text-[var(--danger)]">
        {(["name", "email", "subject", "message"] as Field[]).map((k) =>
          errors[k] ? (
            <li key={k} id={`cf-${k}-err`}>
              {errors[k]}
            </li>
          ) : null,
        )}
      </ul>
      <div className="flex flex-wrap items-center gap-5">
        <PillButton type="submit" variant="solid" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"} <span aria-hidden>→</span>
        </PillButton>
        <div id="cf-status" role="status" aria-live="polite" className="text-[15px]">
          <AnimatePresence mode="wait">
            {status.kind === "sent" ? (
              <motion.span key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                Thanks. Your message is on its way and I will reply by email.
              </motion.span>
            ) : status.kind === "error" ? (
              <motion.span key="err" className="text-[var(--danger)]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {status.msg}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
}

function Footer() {
  return (
    <footer className="wrap mt-32 grid gap-6 border-t border-[var(--line)] py-8 sm:grid-cols-3 sm:items-center">
      <span className="mono muted">© 2026 Ritesh Jena</span>
      <span className="mono muted sm:text-center">Built with Next.js, Three.js and GSAP</span>
      <a href="#top" className="mono ulink w-fit sm:justify-self-end">
        Back to the signal ↑
      </a>
    </footer>
  );
}
