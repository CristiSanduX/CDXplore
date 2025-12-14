import { THEME } from "../../theme";

export type SummaryProps = {
  kind: "summary";
  issued?: string;
  visited: number;
  continents: number;
  progress: number; // 0..100 sau 0..1

  name?: string;
  nationality?: string;
  passportNo?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function formatPassportNo(raw: string) {
  const cleaned = raw.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return cleaned || "CDX-000127";
}

function formatIssued(raw: string) {
  const s = raw.trim();
  return s.length > 16 ? s.slice(0, 16) : s;
}

export function SummaryPage({
  issued,
  visited,
  continents,
  progress,
  nationality = "ROM",
  passportNo = "CDX-000127",
}: SummaryProps) {
  const brand = THEME?.brand?.primary ?? "rgba(122,30,58,0.92)";
  const glow = THEME?.brand?.glow ?? "rgba(122,30,58,0.20)";

  const pct = progress <= 1 ? Math.round(progress * 100) : Math.round(progress);
  const pctClamped = clamp(pct, 0, 100);

  const issuedText = formatIssued(issued ?? "2025-12-12");
  const passportText = formatPassportNo(passportNo);

  return (
    <div
      className={[
        "relative h-full w-full",
        // ✅ overall text a bit smaller on mobile + tighter
        "text-[12px] sm:text-[14px] leading-[1.25] sm:leading-[1.35]",
      ].join(" ")}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 sm:gap-6">
        <div className="min-w-0">
          <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[-0.01em]">
            Identity page
          </div>

          <div className="mt-2 text-[20px] sm:text-[28px] font-semibold text-slate-900 leading-tight tracking-[-0.02em]">
            CDXplore Passport
          </div>

          <div className="mt-1 text-[12px] sm:text-sm text-slate-600 tracking-[-0.01em]">
            Personal travel record
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="mt-5 sm:mt-6 grid grid-cols-12 gap-4 sm:gap-6">
        {/* PHOTO */}
        <div className="col-span-5">
          <div
            className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border"
            style={{
              borderColor: "rgba(0,0,0,0.10)",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.07), rgba(15,23,42,0.02))",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(15,23,42,0.25) 0px, rgba(15,23,42,0.25) 1px, transparent 1px, transparent 10px)",
              }}
            />

            <div className="absolute inset-0 grid place-items-center">
              <div className="select-none text-4xl sm:text-5xl font-semibold text-slate-500/20 tracking-[-0.03em]">
                CDX
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 rounded-2xl border border-black/10 bg-white/60 px-3 py-2 sm:px-4 sm:py-3">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-500 tracking-[-0.01em]">
                Holder photo
              </div>
              <div className="mt-1 text-[12px] sm:text-sm font-semibold text-slate-900 tracking-[-0.01em]">
                (placeholder)
              </div>
            </div>
          </div>
        </div>

        {/* FIELDS */}
        <div className="col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Field label="Passport no" value={passportText} mono />
            <Field label="Nationality" value={nationality} />
            <Field label="Issued" value={issuedText} mono />
            <Field label="Authority" value="CDX" />
            <Field label="Visited" value={`${visited} countries`} />
            <Field label="Continents" value={String(continents)} />
          </div>

          {/* Progress */}
          <div className="mt-4 sm:mt-5 rounded-3xl border border-black/10 bg-white/60 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] sm:text-[11px] font-semibold text-slate-600 tracking-[-0.01em]">
                World completion
              </div>
              <div className="text-[12px] sm:text-sm font-semibold text-slate-900 tracking-[-0.01em] tabular-nums">
                {pctClamped}%
              </div>
            </div>

            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pctClamped}%`,
                  background: `linear-gradient(90deg, ${brand}, rgba(59,130,246,0.55), rgba(16,185,129,0.45))`,
                  boxShadow: `0 10px 18px ${glow}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* footer line */}
      <div className="mt-5 sm:mt-6 h-px w-full bg-black/5" />
      <div className="mt-3 text-[10px] sm:text-[11px] text-slate-500 tracking-[-0.01em]">
        Tip: press ←/→ or scroll to flip pages.
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white/60 px-3 py-2 sm:px-4 sm:py-3">
      <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-[-0.01em]">
        {label}
      </div>

      <div
        className={[
          "mt-1 text-slate-900",
          mono ? "font-mono tabular-nums" : "font-semibold",
          // ✅ smaller on mobile + tighter tracking so it doesn't feel spaced out
          "text-[12px] sm:text-[13.5px] leading-tight",
          "tracking-[-0.02em] sm:tracking-tight",
          "break-words",
        ].join(" ")}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}
