import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function AuthPage() {
  const { user, isReady, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // unde ne întoarcem după login
  const from =
    (location.state as { from?: string })?.from ?? "/countries";

  // dacă e deja logat → redirect
  useEffect(() => {
    if (isReady && user) {
      navigate(from, { replace: true });
    }
  }, [isReady, user, from, navigate]);

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:shadow-black/40">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
          Account
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {user ? "You’re signed in" : "Sign in to sync your passport"}
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Login with Google to save your visited countries to the cloud and access them from any device.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {!isReady ? (
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Loading…
            </div>
          ) : !user ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                await signInWithGoogle();
                navigate(from, { replace: true });
              }}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50
                         dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm dark:border-white/10 dark:bg-white/5">
                G
              </span>
              Continue with Google
            </motion.button>
          ) : (
            <>
              <div className="flex-1 rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <div className="font-semibold">
                  {user.displayName ?? "User"}
                </div>
                <div className="text-xs opacity-80">{user.email}</div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={logout}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50
                           dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
