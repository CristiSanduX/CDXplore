import type { Country } from "../types";
import { StampCard } from "../components/StampCard";
import { motion } from "framer-motion";

const PAGE_SIZE = 6;

export function StampsPage({
  stamps,
  pageIndex,
  pageCount,
}: {
  stamps: Country[];
  pageIndex: number;
  pageCount: number;
}) {
  const safeCount = Math.max(1, pageCount || 1);
  const isZeroBased = pageIndex === 0;
  const normalizedIndex = isZeroBased ? pageIndex + 1 : pageIndex;
  const safeIndex = Math.min(Math.max(normalizedIndex, 1), safeCount);

  const start = (safeIndex - 1) * PAGE_SIZE;
  const pageStamps = stamps.slice(start, start + PAGE_SIZE);

  const placeholders = Math.max(0, PAGE_SIZE - pageStamps.length);

  return (
    <div className="relative h-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.03),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.02),transparent_45%)] dark:opacity-30" />

      <div className="relative mb-10">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
            Passport stamps
          </p>
        </div>

        <div className="mt-2 flex items-end justify-between gap-4">
          <h3 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Page {safeIndex}
            <span className="ml-2 text-base font-normal text-slate-500 dark:text-slate-400">
              / {safeCount}
            </span>
          </h3>
        </div>

        <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
          Each stamp carries its own ink, pressure and imperfections — just like
          in a real passport.
        </p>
      </div>

      <motion.div
        key={safeIndex} 
        className="relative grid grid-rows-2 gap-6 pb-6 sm:grid-cols-2 md:grid-cols-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.06 } },
        }}
      >
        {pageStamps.map((c) => (
          <motion.div
            key={c.code}
            variants={{
              hidden: { opacity: 0, scale: 0.94, y: 12 },
              show: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 520, damping: 36 }}
          >
            <StampCard c={c} />
          </motion.div>
        ))}

        {Array.from({ length: placeholders }).map((_, i) => (
          <div
            key={`ph-${safeIndex}-${i}`}
            className="h-[220px] rounded-2xl border border-transparent"
            aria-hidden
          />
        ))}
      </motion.div>
    </div>
  );
}
