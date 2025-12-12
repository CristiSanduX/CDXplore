import { motion } from "framer-motion";
import { THEME } from "../../theme";
import { Stat } from "../components/Stat";
import { pct } from "../utils";

export function SummaryPage({
  visited,
  continents,
  progress,
  total,
}: {
  visited: number;
  continents: number;
  progress: number;
  total: number;
}) {
  return (
    <div className="h-full">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Summary
          </p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Your travel progress
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Next pages contain your stamps.
          </p>
        </div>
        <div className="hidden sm:block text-right text-xs text-slate-500 dark:text-slate-400">
          Total countries: <span className="font-semibold text-slate-900 dark:text-white">{total}</span>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Countries visited" value={visited} sub="From your personal list" />
        <Stat label="Continents unlocked" value={`${continents} / 6`} sub="One step closer to full coverage" />
        <Stat label="World explored" value={pct(progress)} sub="Based on total countries list" />
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>World progress</span>
          <span>{pct(progress)}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 650, damping: 50 }}
            style={{
              background: `linear-gradient(90deg, rgba(34,197,94,0.35), ${THEME.brand.success}, rgba(37,99,235,0.55))`,
              boxShadow: `0 12px 30px ${THEME.brand.glow}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
