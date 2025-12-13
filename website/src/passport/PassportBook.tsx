import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { THEME } from "../theme";
import type { Page } from "./types";

import { PageShell } from "./components/PageShell";
import { CoverPage } from "./components/CoverPage";
import { SummaryPage } from "./components/SummaryPage";
import { StampsPage } from "./components/StampsPage";
import { EmptyPage } from "./components/EmptyPage";
import { InsideCoverPage } from "./components/InsideCoverPage";

type Spread = {
  left: Page;
  right: Page;
  leftIndex: number;
  rightIndex: number;
};

type Dir = 1 | -1;

/**
 * Render helpers (NOT components) to avoid remount/restart feeling after flip ends.
 */
function renderLeftHalf(
  sp: Spread,
  interactive: boolean,
  totalPages: number,
  onPrev: () => void
) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-1/2">
      <div className="absolute inset-0">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-10"
          style={{
            background: "linear-gradient(270deg, rgba(0,0,0,0.06), transparent)",
          }}
        />
        <PageShell
          pageNo={sp.leftIndex + 1}
          totalPages={totalPages}
          variant={sp.left.kind === "cover" ? "cover" : "page"}
        >
          <PageRenderer page={sp.left} />
        </PageShell>
      </div>

      {interactive && (
        <div
          className="absolute left-0 top-0 h-full w-24 cursor-pointer"
          onClick={onPrev}
          aria-hidden
        />
      )}
    </div>
  );
}

function renderRightHalf(
  sp: Spread,
  interactive: boolean,
  totalPages: number,
  onNext: () => void
) {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-1/2">
      <div className="absolute inset-0">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-10"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.06), transparent)",
          }}
        />
        <PageShell
          pageNo={sp.rightIndex + 1}
          totalPages={totalPages}
          variant={sp.right.kind === "cover" ? "cover" : "page"}
        >
          <PageRenderer page={sp.right} />
        </PageShell>
      </div>

      {interactive && (
        <div
          className="absolute right-0 top-0 h-full w-24 cursor-pointer"
          onClick={onNext}
          aria-hidden
        />
      )}
    </div>
  );
}

/**
 * Slow readable page turn.
 * Base shows the NEW spread immediately; the sheet animates using the OLD snapshot.
 */
function HalfTurn({
  turnKey,
  dir,
  frontHalf,
  backHalf,
  onDone,
}: {
  turnKey: string | number;
  dir: Dir;
  frontHalf: React.ReactNode;
  backHalf: React.ReactNode;
  onDone?: () => void;
}) {
  const duration = 3.6;
  const ease: [number, number, number, number] = [0.08, 0.85, 0.12, 1];

  const glide = 32; // px
  const curl = 1.2; // deg

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ perspective: "2200px", perspectiveOrigin: "50% 50%" }}
    >
      <motion.div
        key={turnKey}
        className="absolute inset-0 transform-gpu"
        initial={{ rotateY: 0, x: 0, rotateZ: 0 }}
        animate={{
          rotateY: dir === 1 ? [0, -95, -180] : [0, 95, 180],
          x: dir === 1 ? [0, -glide * 0.6, -glide] : [0, glide * 0.6, glide],
          rotateZ:
            dir === 1 ? [0, -curl * 0.55, -curl] : [0, curl * 0.55, curl],
        }}
        transition={{ duration, ease, times: [0, 0.7, 1] }}
        onAnimationComplete={onDone}
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: dir === 1 ? "left center" : "right center",
          willChange: "transform",
        }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {frontHalf}

          {/* edge highlight */}
          <div
            className="absolute top-0 bottom-0 w-10"
            style={{
              right: dir === 1 ? 0 : undefined,
              left: dir === -1 ? 0 : undefined,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.26), rgba(255,255,255,0), rgba(0,0,0,0.14))",
              mixBlendMode: "overlay",
              pointerEvents: "none",
            }}
          />

          {/* shadow grows through turn */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.14 }}
            animate={{ opacity: [0.14, 0.42, 0.28] }}
            transition={{ duration, ease, times: [0, 0.55, 1] }}
            style={{
              background:
                dir === 1
                  ? "linear-gradient(to right, rgba(0,0,0,0.42), rgba(0,0,0,0))"
                  : "linear-gradient(to left, rgba(0,0,0,0.42), rgba(0,0,0,0))",
              pointerEvents: "none",
            }}
          />

          {/* subtle paper sheen */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.0 }}
            animate={{ opacity: [0.0, 0.14, 0.06] }}
            transition={{ duration, ease, times: [0, 0.55, 1] }}
            style={{
              background:
                dir === 1
                  ? "radial-gradient(520px 380px at 86% 40%, rgba(255,255,255,0.20), transparent 60%)"
                  : "radial-gradient(520px 380px at 14% 40%, rgba(255,255,255,0.20), transparent 60%)",
              pointerEvents: "none",
              mixBlendMode: "overlay",
            }}
          />
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {backHalf}

          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0.10 }}
            animate={{ opacity: [0.10, 0.24, 0.16] }}
            transition={{ duration, ease, times: [0, 0.55, 1] }}
            style={{
              background:
                dir === 1
                  ? "linear-gradient(to left, rgba(0,0,0,0.26), rgba(0,0,0,0))"
                  : "linear-gradient(to right, rgba(0,0,0,0.26), rgba(0,0,0,0))",
              pointerEvents: "none",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export function PassportBook({ pages }: { pages: Page[] }) {
  const [open, setOpen] = useState(false);

  // spread navigation
  const [displayS, setDisplayS] = useState(0); // base shown now (updates instantly)
  const [isFlipping, setIsFlipping] = useState(false);
  const [dir, setDir] = useState<Dir>(1);
  const [flipKey, setFlipKey] = useState(0);

  // snapshot index we are flipping FROM (sheet front)
  const [flipFromS, setFlipFromS] = useState<number | null>(null);

  const wheelLock = useRef(false);

  const spreads: Spread[] = useMemo(() => {
    const rest = pages.slice(1);
    const out: Spread[] = [];
    for (let k = 0; k < rest.length; k += 2) {
      const left = rest[k] ?? ({ kind: "empty" } as const);
      const right = rest[k + 1] ?? ({ kind: "empty" } as const);

      out.push({
        left,
        right,
        leftIndex: 1 + k,
        rightIndex: 1 + k + 1,
      });
    }
    return out;
  }, [pages]);

  const maxSpread = Math.max(0, spreads.length - 1);
  const clampSpread = (n: number) => Math.max(0, Math.min(maxSpread, n));

  const closeToCover = () => {
    setOpen(false);
    setIsFlipping(false);
    setFlipFromS(null);
    setDisplayS(0);
  };

  /**
   * ✅ Interruptible paging:
   * - You can spam ArrowLeft/ArrowRight instantly.
   * - We update the base instantly, and just restart the sheet animation via flipKey.
   */
  const startFlipTo = (nextIndex: number, d: Dir) => {
    if (!open) return;

    const clamped = clampSpread(nextIndex);
    if (clamped === displayS) return;

    setDir(d);

    // snapshot what you see right now
    setFlipFromS(displayS);

    // update base immediately
    setDisplayS(clamped);

    // force restart animation (interrupt any current flip)
    setIsFlipping(true);
    setFlipKey((k) => k + 1);
  };

  const next = () => {
    if (!open) {
      setOpen(true);
      setDisplayS(0);
      setIsFlipping(false);
      setFlipFromS(null);
      setDir(1);
      return;
    }
    startFlipTo(displayS + 1, 1);
  };

  const prev = () => {
    if (!open) return;

    // back to cover only when not flipping (optional; keeps UX sane)
    if (displayS === 0) {
      closeToCover();
      return;
    }

    startFlipTo(displayS - 1, -1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeToCover();
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, spreads.length, displayS]);

  useEffect(() => {
    setDisplayS((p) => clampSpread(p));
    setFlipFromS((p) => (p == null ? null : clampSpread(p)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreads.length]);

  const isReadyForSpread = pages.length >= 3;

  const base = spreads[displayS];
  const from = flipFromS != null ? spreads[flipFromS] : null;

  const renderSpine = () => (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[84px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(2,6,23,0.14), rgba(2,6,23,0.03))",
        }}
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[52px] -translate-x-1/2"
        style={{
          filter: "blur(18px)",
          background:
            "radial-gradient(60px 520px at 50% 50%, rgba(2,6,23,0.16), transparent 70%)",
          opacity: 0.9,
        }}
      />
    </>
  );

  const renderHints = () => (
    <>
      {displayS === 0 && (
        <div className="pointer-events-none absolute top-6 left-6">
          <div className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
            ← Back to cover
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
          ← / →
        </span>
        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
          Scroll
        </span>
        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
          Click edges
        </span>
        <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
          Esc
        </span>
      </div>
    </>
  );

  return (
    <div className="relative">
      <div
        className="relative mx-auto"
        style={{ perspective: "1600px" }}
        onWheel={(e) => {
          if (wheelLock.current) return;

          wheelLock.current = true;

          if (e.deltaY > 10) next();
          if (e.deltaY < -10) prev();

          // faster wheel unlock so you can scroll quickly
          window.setTimeout(() => (wheelLock.current = false), 120);
        }}
      >
        <div
          className={[
            "relative mx-auto h-[760px] w-full",
            open ? "max-w-[980px]" : "max-w-[540px]",
          ].join(" ")}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-[42px]"
            style={{ boxShadow: "0 70px 160px rgba(2,6,23,0.20)" }}
          />

          <div
            className={[
              "absolute inset-0 overflow-hidden rounded-[42px] border border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]",
              isFlipping ? "" : "backdrop-blur",
            ].join(" ")}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 2px, transparent 5px)",
              }}
            />

            {/* =================== CLOSED COVER VIEW =================== */}
            {!open && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 grid place-items-center">
                  <div className="relative h-[760px] w-full max-w-[540px]">
                    <div
                      className="pointer-events-none absolute left-0 top-0 h-full w-10"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(2,6,23,0.12), rgba(2,6,23,0.03))",
                      }}
                    />

                    <div className="absolute inset-0">
                      <motion.div
                        className="absolute inset-0 transform-gpu"
                        style={{
                          transformStyle: "preserve-3d",
                          transformOrigin: "left center",
                          willChange: "transform",
                        }}
                        animate={{ rotateY: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 24,
                          mass: 0.9,
                        }}
                        onClick={(e) => {
                          const rect = (
                            e.currentTarget as HTMLDivElement
                          ).getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          if (x > rect.width * 0.55) next();
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                          }}
                        >
                          <PageShell pageNo={1} totalPages={pages.length} variant="cover">
                            <PageRenderer page={pages[0] ?? { kind: "empty" }} />
                          </PageShell>
                        </div>
                      </motion.div>
                    </div>

                    <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex items-center justify-center">
                      <div className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                        Click right edge / scroll / → to open
                      </div>
                    </div>

                    <div
                      className="absolute right-0 top-0 h-full w-24 cursor-pointer"
                      onClick={next}
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =================== OPEN SPREAD VIEW =================== */}
            {open && isReadyForSpread && base && (
              <div className="absolute inset-0">
                {renderSpine()}

                {/* base spread (always clickable, even while flipping) */}
                <div className="absolute inset-0">
                  {renderLeftHalf(base, true, pages.length, prev)}
                  {renderRightHalf(base, true, pages.length, next)}
                  {renderHints()}
                </div>

                {/* sheet animates using snapshot */}
                {isFlipping && from && (
                  <>
                    {dir === 1 ? (
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                        <HalfTurn
                          turnKey={flipKey}
                          dir={1}
                          frontHalf={renderRightHalf(from, false, pages.length, () => {})}
                          backHalf={renderLeftHalf(base, false, pages.length, () => {})}
                          onDone={() => {
                            // If a newer flip already started, this onDone still fires.
                            // That's fine: we only clear snapshot/flag; next flip will re-set them.
                            setIsFlipping(false);
                            setFlipFromS(null);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="absolute left-0 top-0 bottom-0 w-1/2 overflow-hidden">
                        <HalfTurn
                          turnKey={flipKey}
                          dir={-1}
                          frontHalf={renderLeftHalf(from, false, pages.length, () => {})}
                          backHalf={renderRightHalf(base, false, pages.length, () => {})}
                          onDone={() => {
                            setIsFlipping(false);
                            setFlipFromS(null);
                          }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {open && (!isReadyForSpread || !base) && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Add more pages to open the passport.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {!open ? (
          <button
            type="button"
            onClick={() => {}}
            className="h-2.5 w-2.5 rounded-full transition"
            style={{
              background: THEME.brand.primary,
              boxShadow: `0 10px 22px ${THEME.brand.glow}`,
            }}
            aria-label="Cover"
          />
        ) : (
          spreads.map((_, idx) => {
            const on = idx === displayS;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx === displayS) return;
                  startFlipTo(idx, idx > displayS ? 1 : -1);
                }}
                className="h-2.5 w-2.5 rounded-full transition"
                style={{
                  background: on ? THEME.brand.primary : "rgba(148,163,184,0.45)",
                  boxShadow: on ? `0 10px 22px ${THEME.brand.glow}` : "none",
                }}
                aria-label={`Go to spread ${idx + 1}`}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function PageRenderer({ page }: { page: Page }) {
  if (page.kind === "cover") return <CoverPage {...page} />;
  if (page.kind === "inside_cover") return <InsideCoverPage />;
  if (page.kind === "summary") return <SummaryPage {...page} />;
  if (page.kind === "stamps") return <StampsPage {...page} />;
  return <EmptyPage />;
}
