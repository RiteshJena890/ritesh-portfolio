"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap grid min-h-[100svh] content-center gap-8 py-24">
      <span className="mono kicker">Interference · 500</span>
      <h1 className="h-xl max-w-[12ch]">Something broke.</h1>
      <p className="muted max-w-[48ch]">The page hit an error while loading. Try again, and if it keeps happening, email riteshjena2002@gmail.com.</p>
      <div>
        <button type="button" onClick={reset} className="pill pill-solid">
          Try again
        </button>
      </div>
    </main>
  );
}
