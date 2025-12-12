import type { Country } from "../types";
import { StampCard } from "../components/StampCard";

export function StampsPage({
  stamps,
  pageIndex,
  pageCount,
}: {
  stamps: Country[];
  pageIndex: number;
  pageCount: number;
}) {
  return (
    <div className="h-full">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        Stamps
      </p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
        Page {pageIndex} of {pageCount}
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Each stamp has its own ink + texture.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {stamps.map((c) => (
          <StampCard key={c.code} c={c} />
        ))}
      </div>
    </div>
  );
}
