import { CoverStat } from "../components/CoverStat";
import { FoilSeal } from "../components/FoilSeal";
import { pct } from "../utils";

export function CoverPage({
  issued,
  visited,
  continents,
  progress,
}: {
  issued: string;
  visited: number;
  continents: number;
  progress: number;
}) {
  return (
    <div className="h-full">
      <div
        className="relative overflow-hidden rounded-[28px] border p-10"
        style={{
          background: "linear-gradient(135deg, #020617 0%, #020617 60%, #0b1224 100%)",
          borderColor: "rgba(255,255,255,0.10)",
          boxShadow: "0 40px 90px rgba(2,6,23,0.35)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(1000px 420px at 0% 0%, rgba(37,99,235,0.28), transparent 62%), radial-gradient(900px 420px at 100% 100%, rgba(34,197,94,0.18), transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 2px, transparent 4px)",
          }}
        />
        <div className="pointer-events-none absolute inset-4 rounded-[22px] border" style={{ borderColor: "rgba(255,255,255,0.08)" }} />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300/80">CDXplore</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Passport</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-200/75">
            Click / scroll / ← → to turn pages.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3 text-sm">
            <CoverStat label="Issued" value={issued} />
            <CoverStat label="Countries visited" value={`${visited}`} />
            <CoverStat label="World explored" value={pct(progress)} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <FoilSeal title="OFFICIAL" subtitle="CDXplore" />
            <div className="text-xs text-slate-200/65">
              Continents unlocked: <span className="font-semibold text-white">{continents}/6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
