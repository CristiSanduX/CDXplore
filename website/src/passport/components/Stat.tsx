export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
        {value}
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{sub}</p>
    </div>
  );
}
