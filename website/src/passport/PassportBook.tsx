import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { THEME } from "../theme";
import type { Page } from "./types";

import { PageShell } from "./components/PageShell";
import { CoverPage } from "./components/CoverPage";
import { SummaryPage } from "./components/SummaryPage";
import { StampsPage } from "./components/StampsPage";
import { InsideCoverPage } from "./components/InsideCoverPage";

type Spread = {
  left: Page;
  right: Page;
  leftIndex: number;
  rightIndex: number;
};

type Dir = 1 | -1;

/** simple responsive hook */
function useMediaQuery(query: string) {
  const [ok, setOk] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setOk(m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, [query]);

  return ok;
}

/** tiny cn helper used in this file */
function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

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
  // ✅ mobile single-page mode
  const isMobile = useMediaQuery("(max-width: 820px)");

  const [open, setOpen] = useState(false);

  // desktop spread state
  const [displayS, setDisplayS] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [dir, setDir] = useState<Dir>(1);
  const [flipKey, setFlipKey] = useState(0);
  const [flipFromS, setFlipFromS] = useState<number | null>(null);

  // mobile page state
  const [mobileI, setMobileI] = useState(0);
  const [mobileDir, setMobileDir] = useState<Dir>(1);

  const wheelLock = useRef(false);

  const openRef = useRef(open);
  const displaySRef = useRef(displayS);
  const maxSpreadRef = useRef(0);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    displaySRef.current = displayS;
  }, [displayS]);

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
  useEffect(() => {
    maxSpreadRef.current = maxSpread;
  }, [maxSpread]);

  const clampSpread = (n: number) =>
    Math.max(0, Math.min(maxSpreadRef.current, n));

  // ✅ DESKTOP total pages (keeps your 2-page book numbering correct)
  const effectiveTotalPages = useMemo(() => {
    const rest = Math.max(0, pages.length - 1);
    const pad = rest % 2 === 1 ? 1 : 0;
    return pages.length + pad;
  }, [pages.length]);

  // ✅ MOBILE: expand stamps into multiple pages (6 stamps per mobile page) + ensure final blank page
  const mobilePages: Page[] = useMemo(() => {
    const STAMPS_PER_PAGE_MOBILE = 6;

    const out: Page[] = [];
    const cover = pages[0] ?? ({ kind: "empty" } as const);
    out.push(cover);

    for (const p of pages.slice(1)) {
      if (p?.kind === "stamps") {
        const anyP = p as any;
        const countries = Array.isArray(anyP.countries) ? (anyP.countries as any[]) : null;

        // If StampsPage has countries list -> split into multiple stamps pages on mobile
        if (countries && countries.length > STAMPS_PER_PAGE_MOBILE) {
          for (let i = 0; i < countries.length; i += STAMPS_PER_PAGE_MOBILE) {
            const slice = countries.slice(i, i + STAMPS_PER_PAGE_MOBILE);
            out.push({
              ...(p as any),
              kind: "stamps",
              countries: slice,
              // optional metadata (harmless if StampsPage ignores)
              mobilePage: Math.floor(i / STAMPS_PER_PAGE_MOBILE) + 1,
              mobilePages: Math.ceil(countries.length / STAMPS_PER_PAGE_MOBILE),
            } as any);
          }
          continue;
        }
      }

      out.push(p);
    }

    // ensure a final blank page so the passport "ends" nicely on mobile too
    const last = out[out.length - 1];
    if (!last || last.kind !== "empty") out.push({ kind: "empty" } as const);

    return out;
  }, [pages]);

  const clampMobile = (n: number) =>
    Math.max(0, Math.min(mobilePages.length - 1, n));

  const closeToCover = () => {
    openRef.current = false;
    displaySRef.current = 0;

    setOpen(false);

    // desktop reset
    setIsFlipping(false);
    setFlipFromS(null);
    setDisplayS(0);

    // mobile reset
    setMobileI(0);
  };

  // keep indices safe if pages change
  useEffect(() => {
    const clamped = clampSpread(displaySRef.current);
    displaySRef.current = clamped;
    setDisplayS(clamped);

    setFlipFromS((p) => (p == null ? null : clampSpread(p)));
    setMobileI((p) => clampMobile(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreads.length, mobilePages.length]);

  const startFlipTo = (nextIndex: number, d: Dir) => {
    if (!openRef.current) return;
    const current = displaySRef.current;
    const clamped = clampSpread(nextIndex);
    if (clamped === current) return;

    setFlipFromS(current);

    displaySRef.current = clamped;
    setDisplayS(clamped);

    setDir(d);

    setIsFlipping(true);
    setFlipKey((k) => k + 1);
  };

  const next = () => {
    if (!openRef.current) {
      openRef.current = true;
      displaySRef.current = 0;

      setOpen(true);

      // desktop open
      setDisplayS(0);
      setIsFlipping(false);
      setFlipFromS(null);
      setDir(1);

      // mobile open -> go to page 0 (cover)
      setMobileI(0);
      setMobileDir(1);
      return;
    }
    startFlipTo(displaySRef.current + 1, 1);
  };

  const prev = () => {
    if (!openRef.current) return;

    if (displaySRef.current === 0) {
      closeToCover();
      return;
    }

    startFlipTo(displaySRef.current - 1, -1);
  };

  const mobileNext = () => {
    if (!openRef.current) {
      openRef.current = true;
      setOpen(true);
      setMobileI(0);
      setMobileDir(1);
      return;
    }
    setMobileDir(1);
    setMobileI((p) => clampMobile(p + 1));
  };

  const mobilePrev = () => {
    if (!openRef.current) return;

    if (mobileI === 0) {
      closeToCover();
      return;
    }
    setMobileDir(-1);
    setMobileI((p) => clampMobile(p - 1));
  };

  // keyboard controls for both modes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isMobile) mobileNext();
        else next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isMobile) mobilePrev();
        else prev();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        closeToCover();
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileI]);

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
      </div>
    </>
  );

  const renderMobileHints = () => (
    <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
      <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
        Swipe
      </span>
      <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
        Tap edges
      </span>
      <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 dark:border-white/10 dark:bg-white/[0.04]">
        Esc
      </span>
    </div>
  );

  const totalForShell = isMobile ? mobilePages.length : effectiveTotalPages;

  return (
    <div className="relative">
      <div
        className="relative mx-auto"
        style={{ perspective: "1600px" }}
        onWheel={(e) => {
          if (wheelLock.current) return;

          wheelLock.current = true;

          if (!isMobile) {
            if (e.deltaY > 10) next();
            if (e.deltaY < -10) prev();
          }

          window.setTimeout(() => (wheelLock.current = false), 120);
        }}
      >
        <div
          className={[
            "relative mx-auto w-full",
            isMobile ? "h-[640px]" : "h-[760px]",
            open
              ? isMobile
                ? "max-w-[520px]"
                : "max-w-[980px]"
              : "max-w-[540px]",
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
                  <div
                    className={cn(
                      "relative w-full",
                      isMobile ? "h-[640px] max-w-[520px]" : "h-[760px] max-w-[540px]"
                    )}
                  >
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
                          if (x > rect.width * 0.55) {
                            if (isMobile) mobileNext();
                            else next();
                          }
                        }}
                      >
                        <div
                          className="absolute inset-0"
                          style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                          }}
                        >
                          <PageShell pageNo={1} totalPages={totalForShell} variant="cover">
                            <PageRenderer page={pages[0] ?? { kind: "empty" }} />
                          </PageShell>
                        </div>
                      </motion.div>
                    </div>

                    <div className="pointer-events-none absolute bottom-6 left-0 right-0 flex items-center justify-center">
                      <div className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-[11px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                        {isMobile
                          ? "Tap right edge / swipe to open"
                          : "Click right edge / scroll / → to open"}
                      </div>
                    </div>

                    <div
                      className="absolute right-0 top-0 h-full w-24 cursor-pointer"
                      onClick={() => (isMobile ? mobileNext() : next())}
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =================== OPEN MOBILE VIEW (SINGLE PAGE) =================== */}
            {open && isMobile && (
              <div className="absolute inset-0">
                <motion.div
                  key={mobileI}
                  className="absolute inset-0"
                  initial={{ x: mobileDir === 1 ? 36 : -36, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: mobileDir === 1 ? -36 : 36, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    const dx = info.offset.x;
                    if (dx < -60) mobileNext();
                    if (dx > 60) mobilePrev();
                  }}
                >
                  <PageShell
                    pageNo={mobileI + 1}
                    totalPages={mobilePages.length}
                    variant={mobilePages[mobileI]?.kind === "cover" ? "cover" : "page"}
                  >
                    <PageRenderer
                      page={mobilePages[mobileI] ?? ({ kind: "empty" } as const)}
                    />
                  </PageShell>

                  {/* tap zones */}
                  <div className="absolute left-0 top-0 h-full w-20" onClick={mobilePrev} />
                  <div className="absolute right-0 top-0 h-full w-20" onClick={mobileNext} />
                </motion.div>

                {renderMobileHints()}
              </div>
            )}

            {/* =================== OPEN DESKTOP SPREAD VIEW =================== */}
            {!isMobile && open && isReadyForSpread && base && (
              <div className="absolute inset-0">
                {renderSpine()}

                <div className="absolute inset-0">
                  {renderLeftHalf(base, true, effectiveTotalPages, prev)}
                  {renderRightHalf(base, true, effectiveTotalPages, next)}
                  {renderHints()}
                </div>

                {isFlipping && from && (
                  <>
                    {dir === 1 ? (
                      <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                        <HalfTurn
                          turnKey={flipKey}
                          dir={1}
                          frontHalf={renderRightHalf(from, false, effectiveTotalPages, () => {})}
                          backHalf={renderLeftHalf(base, false, effectiveTotalPages, () => {})}
                          onDone={() => {
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
                          frontHalf={renderLeftHalf(from, false, effectiveTotalPages, () => {})}
                          backHalf={renderRightHalf(base, false, effectiveTotalPages, () => {})}
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

            {!isMobile && open && (!isReadyForSpread || !base) && (
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
        ) : isMobile ? (
          mobilePages.map((_, idx) => {
            const on = idx === mobileI;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx === mobileI) return;
                  setMobileDir(idx > mobileI ? 1 : -1);
                  setMobileI(idx);
                }}
                className="h-2.5 w-2.5 rounded-full transition"
                style={{
                  background: on ? THEME.brand.primary : "rgba(148,163,184,0.45)",
                  boxShadow: on ? `0 10px 22px ${THEME.brand.glow}` : "none",
                }}
                aria-label={`Go to page ${idx + 1}`}
              />
            );
          })
        ) : (
          spreads.map((_, idx) => {
            const on = idx === displayS;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (idx === displaySRef.current) return;
                  startFlipTo(idx, idx > displaySRef.current ? 1 : -1);
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

/** Blank paper page (used for padded empty halves / mobile last page) */
function BlankSheet() {
  return (
    <div className="relative h-full w-full">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          background:
            "radial-gradient(900px 520px at 50% 45%, rgba(15,23,42,0.045), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(15,23,42,0.06) 0px, rgba(15,23,42,0.06) 1px, transparent 3px, transparent 7px)",
        }}
      />
    </div>
  );
}

function PageRenderer({ page }: { page: Page }) {
  if (page.kind === "cover") return <CoverPage {...page} />;
  if (page.kind === "inside_cover") return <InsideCoverPage />;
  if (page.kind === "summary") return <SummaryPage {...page} />;
  if (page.kind === "stamps") return <StampsPage {...(page as any)} />;
  return <BlankSheet />;
}
