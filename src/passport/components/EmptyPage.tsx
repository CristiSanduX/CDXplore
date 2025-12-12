import { Link } from "react-router-dom";
import { THEME } from "../../theme";

export function EmptyPage() {
  return (
    <div className="h-full grid place-items-center">
      <div className="max-w-lg rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center backdrop-blur dark:border-white/15 dark:bg-white/[0.03]">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">
          Your passport is empty
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Start marking countries to earn your first stamp.
        </p>
        <Link
          to="/countries"
          className="mt-6 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          style={{
            background: `linear-gradient(135deg, ${THEME.brand.primary}, rgba(56,189,248,0.95))`,
            boxShadow: `0 18px 40px ${THEME.brand.glow}`,
          }}
        >
          Explore Countries →
        </Link>
      </div>
    </div>
  );
}
