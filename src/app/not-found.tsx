import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap grid min-h-[100svh] content-center gap-8 py-24">
      <span className="mono kicker">Signal lost · 404</span>
      <h1 className="h-xl max-w-[12ch]">
        Nothing on this <span className="text-[var(--accent)]">frequency.</span>
      </h1>
      <p className="muted max-w-[48ch]">This page does not exist. The whole portfolio lives on a single page.</p>
      <div>
        <Link href="/" className="pill pill-solid">
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
