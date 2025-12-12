import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { THEME } from "../theme";

const tabs = [
  { to: "/", label: "Home" },
  { to: "/countries", label: "Countries" },
  { to: "/passport", label: "Passport" },
  { to: "/profile", label: "Profile" },
] as const;

type Mode = "light" | "dark";

const isActivePath = (pathname: string, to: string) => {
  if (to === "/") return pathname === "/";
  return pathname.startsWith(to);
};

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 13.2A8.5 8.5 0 1 1 10.8 3a6.5 6.5 0 0 0 10.2 10.2Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();

  const [mode, setMode] = useState<Mode>("light");
  const [hoverTo, setHoverTo] = useState<(typeof tabs)[number]["to"] | null>(
    null
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeTo = useMemo(() => {
    const found = tabs.find((t) => isActivePath(pathname, t.to));
    return found?.to ?? "/";
  }, [pathname]);

  useEffect(() => {
    const saved = localStorage.getItem("cdxplore_theme") as Mode | null;
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;

    const initial: Mode = saved ?? (prefersDark ? "dark" : "light");
    setMode(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    // close mobile menu on route change
    setMobileOpen(false);
  }, [pathname]);

  const toggleMode = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("cdxplore_theme", next);
    setMode(next);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-slate-200/70 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          {/* LEFT — logo */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 700, damping: 42 }}
              className="relative"
            >
              <div
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white ring-1 ring-white/60"
                style={{
                  background: `linear-gradient(135deg, ${THEME.ink}, ${THEME.text})`,
                  boxShadow: `0 18px 44px -30px ${THEME.brand.glow}`,
                }}
              >
                CDX
              </div>

              <div
                className="pointer-events-none absolute -inset-3 rounded-2xl blur-2xl"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${THEME.brand.glow}, transparent 60%)`,
                }}
              />
            </motion.div>

            <div className="leading-tight">
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-slate-500 dark:text-slate-400">
                CDXPLORE
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minimal travel tracker
              </p>
            </div>
          </div>

          {/* CENTER — desktop nav */}
          <nav
            className="relative hidden items-center gap-8 md:flex"
            onMouseLeave={() => setHoverTo(null)}
          >
            {tabs.map((t) => {
              const active = t.to === activeTo;
              const hovered = t.to === hoverTo;

              return (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.to === "/"}
                  onMouseEnter={() => setHoverTo(t.to)}
                  className={[
                    "relative py-2 text-sm font-semibold tracking-tight",
                    "transition-colors duration-200",
                    active
                      ? "text-slate-950 dark:text-white"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
                  ].join(" ")}
                >
                  {/* hover wash (no hardcoded colors) */}
                  <motion.span
                    className="absolute -inset-x-3 -inset-y-2 rounded-xl"
                    initial={false}
                    animate={{
                      opacity: hovered && !active ? 1 : 0,
                      scale: hovered && !active ? 1 : 0.985,
                    }}
                    transition={{ duration: 0.14 }}
                    style={{
                      background: `linear-gradient(180deg, ${THEME.brand.glow}, rgba(0,0,0,0))`,
                    }}
                  />

                  <span className="relative">{t.label}</span>

                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                      transition={{ type: "spring", stiffness: 800, damping: 52 }}
                      style={{
                        background: `linear-gradient(90deg, transparent, ${THEME.brand.primary}, transparent)`,
                        boxShadow: `0 16px 40px -28px ${THEME.brand.glow}`,
                      }}
                    />
                  )}

                  {!active && hovered && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full"
                      initial={{ opacity: 0, y: 1 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 1 }}
                      transition={{ duration: 0.12 }}
                      style={{
                        background: `linear-gradient(90deg, transparent, ${THEME.brand.primary}, transparent)`,
                        boxShadow: `0 14px 34px -26px ${THEME.brand.glow}`,
                      }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* RIGHT — actions */}
          <div className="flex items-center gap-2">
            {/* mobile menu button */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              whileHover={{ y: -1, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 750, damping: 45 }}
              className="md:hidden group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              aria-label="Open menu"
              title="Menu"
            >
              <span
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition group-hover:opacity-100"
                style={{
                  boxShadow: `0 0 0 3px rgba(0,0,0,0.02), 0 18px 44px -34px ${THEME.brand.glow}`,
                }}
              />
              <span className="relative text-slate-700 dark:text-slate-200">
                {mobileOpen ? <XIcon /> : <MenuIcon />}
              </span>
            </motion.button>

            {/* theme toggle */}
            <motion.button
              type="button"
              onClick={toggleMode}
              whileHover={{ y: -1, scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 750, damping: 45 }}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <span
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition group-hover:opacity-100"
                style={{
                  boxShadow: `0 0 0 3px rgba(0,0,0,0.02), 0 18px 44px -34px ${THEME.brand.glow}`,
                }}
              />

              <span className="relative text-slate-700 dark:text-slate-200">
                <AnimatePresence mode="popLayout" initial={false}>
                  {mode === "dark" ? (
                    <motion.span
                      key="sun"
                      initial={{ opacity: 0, rotate: -35, scale: 0.9 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 35, scale: 0.9 }}
                      transition={{ duration: 0.12 }}
                    >
                      <SunIcon />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="moon"
                      initial={{ opacity: 0, rotate: 35, scale: 0.9 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: -35, scale: 0.9 }}
                      transition={{ duration: 0.12 }}
                    >
                      <MoonIcon />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </motion.button>
          </div>
        </div>

        {/* mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="md:hidden overflow-hidden"
            >
              <div className="mx-auto max-w-7xl px-4 pb-3">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="grid gap-1">
                    {tabs.map((t) => {
                      const active = t.to === activeTo;
                      return (
                        <NavLink
                          key={t.to}
                          to={t.to}
                          end={t.to === "/"}
                          className={[
                            "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold",
                            active
                              ? "text-slate-950 dark:text-white"
                              : "text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white",
                          ].join(" ")}
                          style={
                            active
                              ? {
                                  background: `linear-gradient(180deg, ${THEME.brand.glow}, rgba(0,0,0,0))`,
                                }
                              : undefined
                          }
                        >
                          <span>{t.label}</span>
                          {active && (
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                background: THEME.brand.primary,
                                boxShadow: `0 14px 30px -18px ${THEME.brand.glow}`,
                              }}
                            />
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* bottom glow line */}
        <div
          className="h-[2px] w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${THEME.brand.glow}, transparent)`,
          }}
        />
      </div>
    </header>
  );
}
