import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COUNTRIES } from "../data/countries";
import { THEME } from "../theme";
import { useAuth } from "../auth/AuthProvider";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type ViewMode = "grid" | "list";
type SortMode = "name-asc" | "name-desc" | "continent-asc";

const STORAGE_KEY = "cdxplore_visited";

const CONTINENTS = [
  "Africa",
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Oceania",
] as const;

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Legacy / guest only: used once for first-time migration. */
function loadVisitedFromLocal(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function normalizeVisited(input: unknown): Set<string> {
  if (!Array.isArray(input)) return new Set();
  const out = new Set<string>();
  for (const v of input) {
    if (typeof v === "string" && v.length >= 2 && v.length <= 3) out.add(v);
  }
  return out;
}

function toSortedArray(set: Set<string>) {
  return [...set].sort((a, b) => a.localeCompare(b));
}

export default function Countries() {
  const { user, isReady } = useAuth();
  const uid = user?.uid ?? null;

  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortMode>("name-asc");
  const [onlyVisited, setOnlyVisited] = useState(false);
  const [continentFilter, setContinentFilter] = useState<
    Set<(typeof CONTINENTS)[number]>
  >(new Set());

  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [syncState, setSyncState] = useState<
    "idle" | "loading" | "saving" | "error"
  >("idle");

  // prevent save loops / avoid saving before initial load
  const hydratedRef = useRef(false);
  // debounce timer
  const saveTimerRef = useRef<number | null>(null);

  // Firestore path: users/{uid}/meta/visited
  const visitedDocRef = useMemo(() => {
    if (!uid) return null;
    return doc(db, "users", uid, "meta", "visited");
  }, [uid]);

  // 1) Initial hydrate from Firestore (+ optional migration from localStorage)
  useEffect(() => {
    if (!isReady) return;
    if (!uid || !visitedDocRef) return;

    let cancelled = false;

    const run = async () => {
      setSyncState("loading");
      try {
        const snap = await getDoc(visitedDocRef);
        if (cancelled) return;

        // ✅ MIGRATION ONLY IF DOC DOES NOT EXIST (first time only)
        if (!snap.exists()) {
          const local = loadVisitedFromLocal();

          if (local.size > 0) {
            await setDoc(
              visitedDocRef,
              {
                visited: toSortedArray(local),
                updatedAt: serverTimestamp(),
                migratedFromLocal: true,
              },
              { merge: true }
            );

            // IMPORTANT: prevent "ghost re-migration"
            localStorage.removeItem(STORAGE_KEY);

            if (!cancelled) {
              setVisited(new Set(local));
              hydratedRef.current = true;
              setSyncState("idle");
            }
            return;
          }

          // No local data: start empty
          if (!cancelled) {
            setVisited(new Set());
            hydratedRef.current = true;
            setSyncState("idle");
          }
          return;
        }

        // ✅ DOC EXISTS => cloud is truth (even if empty)
        const remote = normalizeVisited(snap.data()?.visited);

        if (!cancelled) {
          setVisited(new Set(remote));
          hydratedRef.current = true;
          setSyncState("idle");
        }
      } catch {
        if (!cancelled) setSyncState("error");
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [isReady, uid, visitedDocRef]);

  // 2) Persist visited changes to Firestore (debounced)
  useEffect(() => {
    if (!uid || !visitedDocRef) return;
    if (!hydratedRef.current) return; // don't save until initial load finishes

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(async () => {
      try {
        setSyncState("saving");
        await setDoc(
          visitedDocRef,
          { visited: toSortedArray(visited), updatedAt: serverTimestamp() },
          { merge: true }
        );
        setSyncState("idle");
      } catch {
        setSyncState("error");
      }
    }, 350);

    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [visited, uid, visitedDocRef]);

  const visitedCount = visited.size;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = COUNTRIES.slice();

    if (continentFilter.size > 0) {
      list = list.filter((c) => continentFilter.has(c.continent as any));
    }

    if (onlyVisited) {
      list = list.filter((c) => visited.has(c.code));
    }

    if (q) {
      list = list.filter((c) => {
        const hay = `${c.name} ${c.code} ${c.continent}`.toLowerCase();
        return hay.includes(q);
      });
    }

    list.sort((a, b) => {
      if (sort === "continent-asc") {
        const c1 = a.continent.localeCompare(b.continent);
        if (c1 !== 0) return c1;
        return a.name.localeCompare(b.name);
      }
      if (sort === "name-desc") return b.name.localeCompare(a.name);
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [query, continentFilter, onlyVisited, sort, visited]);

  const progress = useMemo(() => {
    const total = COUNTRIES.length || 1;
    return Math.round((visitedCount / total) * 100);
  }, [visitedCount]);

  const toggleVisited = (code: string) => {
    setVisited((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const setAllFiltered = (value: boolean) => {
    setVisited((prev) => {
      const next = new Set(prev);
      filtered.forEach((c) => {
        if (value) next.add(c.code);
        else next.delete(c.code);
      });
      return next;
    });
  };

  const markAll = () => {
    const next = new Set(COUNTRIES.map((c) => c.code));
    setVisited(next);
  };

  const clearAll = () => {
    setVisited(new Set<string>());
  };

  const clearFilters = () => {
    setQuery("");
    setOnlyVisited(false);
    setContinentFilter(new Set());
    setSort("name-asc");
  };

  const toggleContinent = (c: (typeof CONTINENTS)[number]) => {
    setContinentFilter((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const pillBase =
    "rounded-xl border px-3 py-2 text-xs font-semibold transition shadow-sm";
  const pillOff =
    "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10";
  const pillOn = "border-transparent text-white";

  const panel =
    "rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/55 dark:backdrop-blur-xl";

  const cardBase =
    "group rounded-2xl border p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md";
  const cardOff =
    "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5";
  const cardOn = "border-transparent bg-white dark:bg-white/10 ring-2";

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
            Countries
          </p>

          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Track your visits
            </h1>

            {/* Sync badge */}
            <span
              className={cn(
                "rounded-full border px-2 py-1 text-[10px] font-bold",
                syncState === "error"
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200"
                  : "border-slate-200 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              )}
              title="Cloud sync status"
            >
              {syncState === "loading"
                ? "SYNCING…"
                : syncState === "saving"
                ? "SAVING…"
                : syncState === "error"
                ? "SYNC ERROR"
                : "SYNCED"}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <span>
              <span className="font-semibold text-slate-950 dark:text-white">
                {visitedCount}
              </span>{" "}
              visited
            </span>
            <span className="text-slate-300 dark:text-white/20">•</span>
            <span>
              <span className="font-semibold text-slate-950 dark:text-white">
                {COUNTRIES.length}
              </span>{" "}
              total
            </span>
            <span className="text-slate-300 dark:text-white/20">•</span>
            <span>
              <span className="font-semibold text-slate-950 dark:text-white">
                {progress}%
              </span>{" "}
              complete
            </span>
          </div>

          {/* progress */}
          <div className="mt-3 h-2 w-[280px] overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <motion.div
              className="h-full rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 700, damping: 55 }}
              style={{
                background: `linear-gradient(90deg,
                  rgba(34,197,94,0.35),
                  ${THEME.brand.success},
                  rgba(37,99,235,0.55)
                )`,
                boxShadow: `0 12px 30px ${THEME.brand.glow}`,
              }}
            />
          </div>
        </div>

        {/* Search */}
        <div className="w-full sm:w-[420px]">
          <label className="sr-only" htmlFor="country-search">
            Search countries
          </label>
          <input
            id="country-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, code, continent…"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition
                       focus:border-slate-300 focus:ring-4 focus:ring-slate-100
                       dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-400 dark:focus:ring-white/10"
            style={{ boxShadow: "0 10px 30px rgba(2,6,23,0.05)" }}
          />
        </div>
      </div>

      {/* Controls panel */}
      <div className={panel}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyVisited((v) => !v)}
              className={cn(pillBase, onlyVisited ? pillOn : pillOff)}
              style={onlyVisited ? { background: THEME.brand.primary } : undefined}
            >
              {onlyVisited ? "Showing visited" : "All countries"}
            </button>

            <div className="mx-1 hidden h-6 w-px bg-slate-200/80 dark:bg-white/10 lg:block" />

            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Sort
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm outline-none transition hover:bg-slate-50
                         dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
            >
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="continent-asc">Continent</option>
            </select>

            <div className="mx-1 hidden h-6 w-px bg-slate-200/80 dark:bg-white/10 lg:block" />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(pillBase, view === "grid" ? pillOn : pillOff)}
                style={view === "grid" ? { background: THEME.brand.primary } : undefined}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(pillBase, view === "list" ? pillOn : pillOff)}
                style={view === "list" ? { background: THEME.brand.primary } : undefined}
              >
                List
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setAllFiltered(true)}
              className={cn(pillBase, pillOff)}
            >
              Mark filtered as visited
            </button>
            <button
              type="button"
              onClick={() => setAllFiltered(false)}
              className={cn(pillBase, pillOff)}
            >
              Unvisit filtered
            </button>
            <button type="button" onClick={markAll} className={cn(pillBase, pillOff)}>
              Mark all visited
            </button>
            <button type="button" onClick={clearAll} className={cn(pillBase, pillOff)}>
              Clear all
            </button>
            <button type="button" onClick={clearFilters} className={cn(pillBase, pillOff)}>
              Reset
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CONTINENTS.map((c) => {
            const on = continentFilter.has(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleContinent(c)}
                className={cn(
                  "rounded-full border px-3 py-2 text-xs font-semibold transition",
                  on
                    ? "border-transparent text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                )}
                style={on ? { background: THEME.brand.primary } : undefined}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        Showing{" "}
        <span className="font-semibold text-slate-950 dark:text-white">
          {filtered.length}
        </span>{" "}
        countries
      </p>

      {/* Grid/List */}
      <AnimatePresence mode="popLayout">
        {view === "grid" ? (
          <motion.div
            key="grid"
            layout
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            {filtered.map((c) => {
              const isV = visited.has(c.code);

              return (
                <motion.button
                  key={c.code}
                  type="button"
                  layout
                  onClick={() => toggleVisited(c.code)}
                  whileTap={{ scale: 0.98 }}
                  className={cn(cardBase, isV ? cardOn : cardOff)}
                  style={
                    isV
                      ? { boxShadow: `0 14px 36px ${THEME.brand.glow}`, outline: "none" }
                      : undefined
                  }
                >
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 pointer-events-none",
                      "group-hover:opacity-100"
                    )}
                    style={{
                      background:
                        "radial-gradient(700px 220px at 20% 0%, rgba(37,99,235,0.10), transparent 55%)",
                    }}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">
                        {c.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {c.continent}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isV && (
                        <span
                          className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                          style={{ background: THEME.brand.success }}
                        >
                          VISITED
                        </span>
                      )}

                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                        {c.code}
                      </div>
                    </div>
                  </div>

                  <div
                    className="relative mt-3 h-[2px] w-full rounded-full opacity-0 transition group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${THEME.brand.primary}, transparent)`,
                    }}
                  />
                </motion.button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            layout
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
          >
            <div className="divide-y divide-slate-200/70 dark:divide-white/10">
              {filtered.map((c) => {
                const isV = visited.has(c.code);

                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => toggleVisited(c.code)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-white/10"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
                          {c.name}
                        </p>
                        {isV && (
                          <span
                            className="rounded-full px-2 py-1 text-[10px] font-bold text-white"
                            style={{ background: THEME.brand.success }}
                          >
                            VISITED
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        {c.continent}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
                      {c.code}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          No countries match “{query}”.
        </div>
      )}
    </section>
  );
}
