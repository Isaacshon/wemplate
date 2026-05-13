import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function CancelPage() {
  return (
    <main className="container-px mx-auto flex min-h-screen max-w-3xl items-center py-24">
      <section className="rounded-lg border border-line bg-white/[0.055] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.36)] sm:p-10">
        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-lg bg-coral text-white">
          <RotateCcw className="h-7 w-7" aria-hidden />
        </div>
        <p className="text-xs font-semibold uppercase text-cobalt">Checkout canceled</p>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-tight text-ink">
          No charge was made.
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">
          The best sellers are still waiting. You can return to the catalog and choose a different
          template or bundle.
        </p>
        <Link
          href="/#best-sellers"
          className="mt-8 inline-flex min-h-12 items-center rounded-md border border-cobalt bg-cobalt px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink"
        >
          Browse best sellers
        </Link>
      </section>
    </main>
  );
}
