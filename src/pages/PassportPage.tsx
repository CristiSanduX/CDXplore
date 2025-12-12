import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { COUNTRIES } from "../data/countries";
import { THEME } from "../theme";
import { PassportBook } from "../passport/PassportBook";
import { loadVisited } from "../passport/storage";
import { chunk } from "../passport/utils";
import type { Country, Page } from "../passport/types";

export default function PassportPage() {
  const countries = COUNTRIES as Country[];
  const [visitedSet, setVisitedSet] = useState<Set<string>>(new Set());

  useEffect(() => setVisitedSet(loadVisited()), []);

  const visitedCountries = useMemo(
    () => countries.filter((c) => visitedSet.has(c.code)),
    [countries, visitedSet]
  );

  const continentsUnlocked = useMemo(
    () => new Set(visitedCountries.map((c) => c.continent)).size,
    [visitedCountries]
  );

  const progress = useMemo(() => {
    const total = countries.length || 1;
    return Math.round((visitedCountries.length / total) * 100);
  }, [visitedCountries.length, countries.length]);

  const stampPages = useMemo(() => chunk(visitedCountries, 12), [visitedCountries]);

  const pages: Page[] = useMemo(() => {
    if (visitedCountries.length === 0) {
      return [
        { kind: "cover", issued: "2025", visited: 0, continents: 0, progress: 0 },
        { kind: "empty" },
      ];
    }

    return [
      {
        kind: "cover",
        issued: "2025",
        visited: visitedCountries.length,
        continents: continentsUnlocked,
        progress,
      },
      {
        kind: "summary",
        visited: visitedCountries.length,
        continents: continentsUnlocked,
        progress,
        total: countries.length,
      },
      ...stampPages.map((stamps, idx) => ({
        kind: "stamps" as const,
        pageIndex: idx + 1,
        pageCount: stampPages.length,
        stamps,
      })),
    ];
  }, [visitedCountries.length, continentsUnlocked, progress, countries.length, stampPages]);

  return (
    <div className="relative">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-44 -left-44 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: THEME.brand.glow }}
        />
        <div
          className="absolute top-8 -right-48 h-[620px] w-[620px] rounded-full blur-3xl"
          style={{ background: "rgba(15,23,42,0.10)" }}
        />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
              Passport
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Flip through your passport
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Click edges / scroll / ← → to turn pages.
            </p>
          </div>

          <Link
            to="/countries"
            className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold text-slate-900 shadow-sm transition hover:bg-white
                       dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.06]"
          >
            Edit visits →
          </Link>
        </div>

        <PassportBook pages={pages} />
      </section>
    </div>
  );
}
