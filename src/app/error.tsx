"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap grid min-h-[100svh] content-center gap-6 py-24">
      <span className="label">HTTP 500</span>
      <h1 className="display text-[clamp(48px,10vw,128px)]">Something broke.</h1>
      <p className="max-w-[48ch] text-[var(--ink-2)]">The page hit an error while loading. Try again, and if it keeps happening, email riteshjena2002@gmail.com.</p>
      <div>
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
      </div>
    </main>
  );
}
