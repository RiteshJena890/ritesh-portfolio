import { site } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-[color-mix(in_srgb,var(--bg)_15%,transparent)] bg-[var(--ink)] text-[var(--bg)]">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 py-8 text-sm" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom, 0px))" }}>
        <span>© 2026 {site.name}. Built with Next.js, Three.js and GSAP.</span>
        <div className="flex gap-5">
          <a className="link-sweep" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          {site.github ? (
            <a className="link-sweep" href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          ) : null}
          <a className="link-sweep" href={`mailto:${site.email}`}>
            Email
          </a>
          <a className="link-sweep" href="#top">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
