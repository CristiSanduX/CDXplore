import { motion } from "framer-motion";
import { THEME } from "../../theme";
import type { Country } from "../types";
import { inkVariant, rotDeg } from "../utils";

export function StampCard({ c }: { c: Country }) {
  const r = rotDeg(c.code);
  const v = inkVariant(c.code);

  const ink =
    v === 0
      ? { ring: "rgba(34,197,94,0.55)", ink: "rgb(20 83 45)", bg1: "#ecfdf5", bg2: "#f0fdf4" }
      : v === 1
      ? { ring: "rgba(37,99,235,0.50)", ink: "rgb(30 64 175)", bg1: "#eff6ff", bg2: "#f8fafc" }
      : { ring: "rgba(15,23,42,0.35)", ink: "rgb(15 23 42)", bg1: "#ffffff", bg2: "#f8fafc" };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border p-5 shadow-sm"
      initial={{ opacity: 0, y: 10, rotate: r }}
      animate={{ opacity: 1, y: 0, rotate: r }}
      whileHover={{ rotate: 0, scale: 1.03 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        borderColor: "rgba(2,6,23,0.10)",
        background: `linear-gradient(135deg, ${ink.bg1}, ${ink.bg2})`,
        boxShadow: "0 18px 50px rgba(2,6,23,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-[0.20]"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 20% 30%, rgba(0,0,0,0.10) 0 1px, transparent 1px 6px)",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rotate-12 rounded-full blur-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: THEME.brand.glow }}
      />

      <div
        className="relative rounded-2xl border border-dashed p-4"
        style={{
          borderColor: ink.ring,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.45)`,
        }}
      >
        <div className="pointer-events-none absolute inset-[10px] rounded-2xl border" style={{ borderColor: "rgba(0,0,0,0.08)" }} />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.35em]" style={{ color: ink.ink }}>
              STAMP
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight" style={{ color: ink.ink }}>
              {c.code}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{c.name}</p>
            <p className="text-xs text-slate-600">{c.continent}</p>
          </div>

          <span className="rounded-full px-2 py-1 text-[10px] font-bold text-white" style={{ background: THEME.brand.success }}>
            VISITED
          </span>
        </div>

        <div
          className="mt-4 h-[2px] w-full rounded-full opacity-0 transition group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${THEME.brand.primary}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}
