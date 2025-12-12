// src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { COUNTRIES } from "../data/countries";

const STORAGE_KEY = "cdxplore_visited";
const BRAND = "rgba(122,30,58,0.92)";

type Country = {
  code: string;
  continent: string;
};

function loadVisited(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

const StatCard = ({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur
               dark:border-white/10 dark:bg-white/[0.04]"
  >
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
      {label}
    </p>
    <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
      {value}
    </div>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
      {sub}
    </p>
  </motion.div>
);

const HomePage = () => {
  const countries = COUNTRIES as Country[];
  const [visited, setVisited] = useState<Set<string>>(loadVisited());

  useEffect(() => {
    const sync = () => setVisited(loadVisited());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const stats = useMemo(() => {
    const visitedList = countries.filter(c => visited.has(c.code));
    const continents = new Set(countries.map(c => c.continent));
    const visitedContinents = new Set(visitedList.map(c => c.continent));

    return {
      visitedCount: visitedList.length,
      continentsVisited: visitedContinents.size,
      continentsTotal: continents.size,
      worldPct: Math.round((visitedList.length / countries.length) * 100),
    };
  }, [countries, visited]);

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-20">
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "rgba(122,30,58,0.12)" }}
        />
        <div
          className="absolute top-0 -right-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "rgba(15,23,42,0.08)" }}
        />
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-2xl"
      >
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Track your travels.
          <br />
          Discover your world.
        </h1>

        <p className="mt-5 text-base text-slate-700 dark:text-slate-200/80">
          A clean, fast travel tracker — built for people who love countries,
          cities, and progress.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/countries"
            className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg, ${BRAND}, rgba(122,30,58,0.55))`,
              boxShadow: "0 18px 40px rgba(122,30,58,0.25)",
            }}
          >
            Explore Countries →
          </Link>

          <Link
            to="/profile"
            className="rounded-full border border-slate-200 bg-white/70 px-6 py-3
                       text-sm font-semibold text-slate-900 shadow-sm transition
                       hover:bg-white dark:border-white/10 dark:bg-white/[0.04]
                       dark:text-white"
          >
            View Profile
          </Link>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="relative mt-16 grid gap-6 sm:grid-cols-3">
        <StatCard
          label="Countries visited"
          value={`${stats.visitedCount}`}
          sub="From your personal list"
        />

        <StatCard
          label="Continents unlocked"
          value={`${stats.continentsVisited} / ${stats.continentsTotal}`}
          sub="One step closer to full coverage"
        />

        <StatCard
          label="World explored"
          value={`${stats.worldPct}%`}
          sub="Based on total countries list"
        />
      </div>
    </section>
  );
};

export default HomePage;
