import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap grid min-h-[100svh] content-center gap-6 py-24">
      <span className="label">HTTP 404</span>
      <h1 className="display text-[clamp(56px,12vw,160px)]">
        Route not <span className="mark">found.</span>
      </h1>
      <p className="max-w-[48ch] text-[var(--ink-2)]">This page does not exist. The portfolio lives on a single page.</p>
      <div>
        <Link href="/" className="btn btn-primary">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
