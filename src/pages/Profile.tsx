import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthProvider";
import { COUNTRIES } from "../data/countries";
import { THEME } from "../theme";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type CloudMeta = {
  visited?: string[];
  updatedAt?: { seconds?: number };
};

export default function Profile() {
  const { user, logout } = useAuth();
  const uid = user?.uid;

  const [visitedCount, setVisitedCount] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  const progress = useMemo(() => {
    if (visitedCount == null) return 0;
    return Math.round((visitedCount / COUNTRIES.length) * 100);
  }, [visitedCount]);

  useEffect(() => {
    if (!uid) return;

    const run = async () => {
      try {
        const ref = doc(db, "users", uid, "meta", "visited");
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() as CloudMeta;
          setVisitedCount(data.visited?.length ?? 0);

          if (data.updatedAt?.seconds) {
            setUpdatedAt(new Date(data.updatedAt.seconds * 1000));
          }
        } else {
          setVisitedCount(0);
        }
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [uid]);

  if (!user) return null;

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          Profile
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
          Your account
        </h1>
      </div>

      {/* Account card */}
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-black text-slate-700 dark:text-slate-200">
                {(user.displayName?.[0] ?? "U").toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">
              {user.displayName ?? "User"}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Visited"
          value={
            loading ? "—" : `${visitedCount ?? 0} / ${COUNTRIES.length}`
          }
        />
        <StatCard
          label="Progress"
          value={loading ? "—" : `${progress}%`}
        />
        <StatCard
          label="Last sync"
          value={
            loading
              ? "—"
              : updatedAt
              ? updatedAt.toLocaleString()
              : "Never"
          }
        />
      </div>

      {/* Progress bar */}
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-900 dark:text-white">
            World progress
          </span>
          <span className="text-slate-600 dark:text-slate-300">
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 700, damping: 55 }}
            className="h-full rounded-full"
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

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={logout}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50
                     dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        >
          Sign out
        </button>

        <span className="text-xs text-slate-500 dark:text-slate-400">
          Your data is securely stored in the cloud.
        </span>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
        {value}
      </p>
    </div>
  );
}
