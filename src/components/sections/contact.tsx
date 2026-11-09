"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, FileText, Loader2, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { site } from "@/content/profile";
import { contactSchema } from "@/lib/contact-schema";
import { SplitText } from "@/components/motion/split-text";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";

type Status = "idle" | "sending" | "sent" | "error";
const PREVIEW = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "1";

const fields = [
  { id: "name", label: "Your name", type: "text", autoComplete: "name", required: true },
  { id: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { id: "subject", label: "Subject (optional)", type: "text", autoComplete: "off", required: false },
] as const;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const k = String(i.path[0]);
        fe[k] ??= i.message;
      });
      setErrors(fe);
      setFormError("Please fix the highlighted fields.");
      setStatus("error");
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(fe)[0]}"]`);
      first?.focus();
      return;
    }
    setErrors({});
    setFormError("");
    if (PREVIEW) {
      setStatus("error");
      setFormError(`Sending is turned off in this preview. Email ${site.email} instead.`);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setFormError(json.error ?? "The message could not be sent. Please try again.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setFormError("You seem to be offline. Check your connection and try again.");
      setStatus("error");
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="contact-band section relative overflow-hidden" aria-labelledby="contact-title">
      <div aria-hidden className="contact-orbit">
        <span />
        <span />
        <span />
      </div>
      <div className="wrap relative grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div className="grid content-start gap-8">
          <span className="label">/contact</span>
          <h2 id="contact-title" className="display text-[clamp(44px,8vw,112px)]">
            <SplitText text="Let's talk." inView stagger={0.05} />
          </h2>
          <Reveal>
            <p className="max-w-[46ch] text-[clamp(17px,1.5vw,20px)] opacity-80">
              Hiring for a .NET, React or AI role, or need someone to build a business application? Send a message and I will reply by email.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-5">
              <div className="grid gap-1">
                <span className="label">Email</span>
                <div className="flex flex-wrap items-center gap-3">
                  <a href={`mailto:${site.email}`} className="link-sweep text-[clamp(18px,2vw,24px)] font-semibold break-all">
                    {site.email}
                  </a>
                  <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-current/30 px-3 py-1.5 text-xs font-semibold" aria-live="polite">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="grid gap-1">
                <span className="label">Based in</span>
                <span className="font-semibold">{site.location}</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Magnetic>
                  <a href={site.linkedin} target="_blank" rel="noreferrer" className="btn contact-btn">
                    LinkedIn <ArrowUpRight size={16} />
                  </a>
                </Magnetic>
                {site.github ? (
                  <Magnetic>
                    <a href={site.github} target="_blank" rel="noreferrer" className="btn contact-btn">
                      GitHub <ArrowUpRight size={16} />
                    </a>
                  </Magnetic>
                ) : null}
                <Magnetic>
                  <a href={site.resume} target="_blank" rel="noreferrer" className="btn contact-btn">
                    <FileText size={16} /> Resume
                  </a>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal depth={20} delay={0.1}>
          <form onSubmit={onSubmit} noValidate className="contact-form grid gap-6 rounded-[26px] p-6 sm:p-9" aria-describedby="form-status">
            {fields.map((f) => (
              <div key={f.id} className="field">
                <div className="field-box">
                <input
                  id={`contact-${f.id}`}
                  name={f.id}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  required={f.required}
                  placeholder=" "
                  aria-invalid={Boolean(errors[f.id])}
                  aria-describedby={errors[f.id] ? `err-${f.id}` : undefined}
                />
                <label htmlFor={`contact-${f.id}`}>{f.label}</label>
                <span className="field-line" aria-hidden />
                </div>
                {errors[f.id] ? (
                  <span id={`err-${f.id}`} className="field-error">
                    {errors[f.id]}
                  </span>
                ) : null}
              </div>
            ))}
            <div className="field">
              <div className="field-box">
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder=" "
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "err-message" : undefined}
              />
              <label htmlFor="contact-message">Message</label>
              <span className="field-line" aria-hidden />
              </div>
              {errors.message ? (
                <span id="err-message" className="field-error">
                  {errors.message}
                </span>
              ) : null}
            </div>
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="contact-company">Company</label>
              <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <p id="form-status" role="status" aria-live="polite" className="min-h-[1.5em] max-w-[34ch] text-sm">
                {status === "sent" ? "Thanks. Your message is on its way and I'll reply by email." : formError}
              </p>
              <button type="submit" className="btn btn-send" disabled={status === "sending"}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={status}
                    className="inline-flex items-center gap-2"
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Sending
                      </>
                    ) : status === "sent" ? (
                      <>
                        <Check size={18} /> Sent
                      </>
                    ) : (
                      <>
                        Send message <Send size={16} />
                      </>
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
