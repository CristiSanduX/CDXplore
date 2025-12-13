import { THEME } from "../../theme";

export function FoilSeal({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      className="relative grid h-14 w-14 place-items-center rounded-full border text-center"
      style={{
        borderColor: "rgba(255,255,255,0.18)",
        background:
          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 60%, rgba(0,0,0,0.15) 100%)",
        boxShadow: `0 18px 40px ${THEME.dark.brandGlow}`,
      }}
    >
      <div className="absolute inset-[6px] rounded-full border" style={{ borderColor: "rgba(255,255,255,0.14)" }} />
      <div className="leading-none">
        <div className="text-[10px] font-extrabold tracking-[0.22em] text-white">{title}</div>
        <div className="mt-[2px] text-[9px] font-semibold tracking-[0.18em] text-slate-200/80">{subtitle}</div>
      </div>
    </div>
  );
}
