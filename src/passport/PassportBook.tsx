import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { THEME } from "../theme";
import type { Page } from "./types";
import { PageShell } from "./components/PageShell";
import { CoverPage } from "./components/CoverPage";
import { SummaryPage } from "./components/SummaryPage";
import { StampsPage } from "./components/StampsPage";
import { EmptyPage } from "./components/EmptyPage";

export function PassportBook({ pages }: { pages: Page[] }) {
  const [i, setI] = useState(0);
  const clamp = (n: number) => Math.max(0, Math.min(pages.length - 1, n));
  const next = () => setI((p) => clamp(p + 1));
  const prev = () => setI((p) => clamp(p - 1));

  const wheelLock = useRef(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.length]);

  return (
    <div className="relative">
      <div className="relative mx-auto" style={{ perspective: "1600px" }}
        onWheel={(e) => {
          if (wheelLock.current) return;
          wheelLock.current = true;
          if (e.deltaY > 10) next();
          if (e.deltaY < -10) prev();
          window.setTimeout(() => (wheelLock.current = false), 320);
        }}
      >
        <div className="relative mx-auto h-[620px] w-full max-w-[980px]">
          <div className="pointer-events-none absolute inset-0 rounded-[42px]" style={{ boxShadow: "0 70px 160px rgba(2,6,23,0.20)" }} />

          <div className="absolute inset-0 overflow-hidden rounded-[42px] border border-slate-200 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10" style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.12), rgba(2,6,23,0.03))" }} />
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
              style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 2px, transparent 5px)" }}
            />

            <div className="absolute inset-0">
              {pages.map((p, idx) => {
                const turned = idx < i;
                const z = 200 + (pages.length - idx);

                return (
                  <motion.div
                    key={idx}
                    className="absolute inset-0"
                    style={{
                      transformStyle: "preserve-3d",
                      transformOrigin: "left center",
                      zIndex: z,
                      pointerEvents: idx === i ? "auto" : "none",
                    }}
                    animate={{ rotateY: turned ? -180 : 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 26, mass: 0.9 }}
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      if (x > rect.width * 0.55) next();
                      else prev();
                    }}
                  >
                    {/* FRONT */}
                    <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                      <PageShell pageNo={idx + 1} totalPages={pages.length}>
                        <PageRenderer page={p} />
                      </PageShell>
                    </div>

                    {/* BACK */}
                    <div className="absolute inset-0" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                      <PageBack />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">← / →</span>
              <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">Scroll</span>
              <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">Click edges</span>
            </div>
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {pages.map((_, idx) => {
          const on = idx === i;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              className="h-2.5 w-2.5 rounded-full transition"
              style={{
                background: on ? THEME.brand.primary : "rgba(148,163,184,0.45)",
                boxShadow: on ? `0 10px 22px ${THEME.brand.glow}` : "none",
              }}
              aria-label={`Go to page ${idx + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function PageRenderer({ page }: { page: Page }) {
  if (page.kind === "cover") return <CoverPage {...page} />;
  if (page.kind === "summary") return <SummaryPage {...page} />;
  if (page.kind === "stamps") return <StampsPage {...page} />;
  return <EmptyPage />;
}

function PageBack() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-6 rounded-[30px] border border-slate-200/70 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-white/[0.03]" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(900px 360px at 50% 20%, rgba(37,99,235,0.10), transparent 60%)",
          opacity: 0.9,
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <div className="rounded-full border border-slate-200/80 bg-white/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
          CDXplore
        </div>
      </div>
    </div>
  );
}
