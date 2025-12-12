export function PageShell({
  children,
  pageNo,
  totalPages,
}: {
  children: React.ReactNode;
  pageNo: number;
  totalPages: number;
}) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-6 rounded-[30px] border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]" />
      <div className="pointer-events-none absolute right-10 top-10 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {String(pageNo).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
      </div>
      <div className="absolute inset-0 p-12">{children}</div>
    </div>
  );
}
