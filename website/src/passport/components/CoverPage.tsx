import React, { useRef, useState } from "react";
import {
  motion,
  animate,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { THEME } from "../../theme";

export type CoverProps = {
  kind: "cover";
  issued: string;
  visited: number;
  continents: number;
  progress: number; 
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function CoverPage({ issued, visited, continents, progress }: CoverProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [hover, setHover] = useState(false);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const gx = useMotionValue(50);
  const gy = useMotionValue(40);
  const ga = useMotionValue(0);

  const transform = useMotionTemplate`
    perspective(1200px)
    rotateX(${rx}deg)
    rotateY(${ry}deg)
    translateZ(0)
  `;

  const glare = useMotionTemplate`
    radial-gradient(
      700px circle at ${gx}% ${gy}%,
      rgba(255,255,255,${ga}),
      rgba(255,255,255,0) 62%
    )
  `;

  const brand = THEME?.brand?.primary ?? "rgba(122,30,58,0.92)";
  const brandGlow = THEME?.brand?.glow ?? "rgba(122,30,58,0.25)";

  const earthGlowA = "rgba(56,189,248,0.22)"; 
  const earthGlowB = "rgba(34,197,94,0.14)"; 
  const earthGlowC = "rgba(59,130,246,0.18)"; 

  const pct = progress <= 1 ? Math.round(progress * 100) : Math.round(progress);
  const pctClamped = clamp(pct, 0, 100);

  function onMove(e: React.MouseEvent) {
    const el = cardRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    rx.set(clamp((0.5 - py) * 8, -7, 7));
    ry.set(clamp((px - 0.5) * 10, -9, 9));

    gx.set(clamp(px * 100, 0, 100));
    gy.set(clamp(py * 100, 0, 100));
    ga.set(0.22);
  }

  function reset() {
    animate(rx, 0, { duration: 0.35 });
    animate(ry, 0, { duration: 0.35 });
    animate(ga, 0, { duration: 0.35 });
  }

  return (
    <div className="relative h-full w-full">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 420px at 55% 15%, rgba(255,255,255,0.10), transparent 60%)",
          opacity: 0.9,
        }}
      />

      <div className="absolute inset-6 rounded-[30px]">
        <motion.div
          ref={cardRef}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false);
            reset();
          }}
          onMouseMove={onMove}
          style={{ transform }}
          className="relative h-full w-full rounded-[28px]"
        >
          <motion.div
            aria-hidden
            animate={{ y: hover ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="absolute inset-0 rounded-[28px]"
            style={{
              boxShadow: hover
                ? `0 34px 110px -45px rgba(2,6,23,0.78), 0 0 0 1px rgba(255,255,255,0.08) inset`
                : `0 28px 95px -55px rgba(2,6,23,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset`,
            }}
          />

          {/* cover body */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden border border-black/15 dark:border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,12,22,1),rgba(6,10,18,1),rgba(10,16,26,1))]" />

            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  `radial-gradient(900px 520px at 20% 15%, ${earthGlowA}, transparent 60%),` +
                  `radial-gradient(820px 520px at 85% 35%, ${earthGlowB}, transparent 62%),` +
                  `radial-gradient(900px 520px at 50% 115%, ${earthGlowC}, transparent 65%)`,
              }}
            />

            {/* “globe” watermark – lat/long rings */}
            <div
              className="absolute inset-0 opacity-[0.10] mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 55% 45%, rgba(239, 239, 239, 0.22) 0px, transparent 55%)," +
                  "radial-gradient(circle at 55% 45%, transparent 0px, transparent 120px, rgba(255,255,255,0.09) 121px, transparent 122px)," +
                  "radial-gradient(circle at 55% 45%, transparent 0px, transparent 165px, rgba(255,255,255,0.07) 166px, transparent 167px)," +
                  "radial-gradient(circle at 55% 45%, transparent 0px, transparent 210px, rgba(255,255,255,0.05) 211px, transparent 212px)",
              }}
            />

            {/* micro grain */}
            <div
              className="absolute inset-0 opacity-[0.18] mix-blend-overlay"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 2px, transparent 6px)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.16] mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)",
                backgroundSize: "3px 3px",
              }}
            />

            {/* stitching */}
            <div className="absolute inset-[14px] rounded-[22px] border border-white/12" />
            <div className="absolute inset-[18px] rounded-[20px] border border-white/5" />

            {/* glare */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{ backgroundImage: glare }}
            />

            {/* foil sweep */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(75deg, transparent, rgba(255,255,255,0.14), transparent)",
                mixBlendMode: "screen",
                opacity: hover ? 0.65 : 0.24,
              }}
              animate={{ x: hover ? "140%" : "-40%" }}
              transition={{ duration: hover ? 0.95 : 0.75, ease: "easeOut" }}
            />

            <div
              className="absolute left-0 right-0 top-[46%] h-24 pointer-events-none"
              style={{
                background: `radial-gradient(520px 140px at 50% 50%, ${brandGlow}, transparent 70%)`,
                opacity: 0.55,
              }}
            />

            {/* bottom bevel */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent)] pointer-events-none" />

            {/* content */}
            <div className="relative z-10 h-full p-7 flex flex-col">
              {/* header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-semibold tracking-[0.34em] text-white/75">
                    CDXPLORE
                  </div>
                  <div className="mt-1 text-[12px] tracking-[0.22em] text-white/60 uppercase">
                    Travel passport
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.04] px-3 py-2">
                  <div className="text-[10px] tracking-[0.28em] text-white/70">NFC</div>
                  <div className="mt-1 h-3 w-8 rounded-md border border-white/20" />
                </div>
              </div>

              {/* center */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-[12px] tracking-[0.42em] uppercase text-white/70">
                  Passport
                </div>

                <div className="mt-2 text-[30px] font-semibold text-white/95 tracking-tight">
                  ROMÂNIA
                </div>

                {/* foil line (brand) */}
                <div
                  className="mt-4 h-[2px] w-44 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${brand}, transparent)`,
                    boxShadow: `0 10px 35px ${brandGlow}`,
                    opacity: 0.9,
                  }}
                />

                {/* progress card */}
                <div className="mt-8 w-full max-w-[420px] rounded-2xl border border-white/12 bg-white/[0.035] p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] tracking-[0.28em] text-white/60 uppercase">
                      Progress
                    </div>
                    <div className="text-[12px] font-semibold text-white/85">
                      {pctClamped}%
                    </div>
                  </div>

                  <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pctClamped}%`,
                        background:
                          "linear-gradient(90deg, rgba(56,189,248,0.95), rgba(59,130,246,0.75), rgba(255,255,255,0.20))",
                        boxShadow: "0 12px 26px rgba(56,189,248,0.18)",
                      }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <Stat label="Visited" value={String(visited)} />
                    <Stat label="Continents" value={String(continents)} />
                    <Stat label="Issued" value={issued} />
                  </div>
                </div>
              </div>

              <motion.div
                className="mt-auto flex items-center justify-between rounded-2xl border border-white/12 bg-white/[0.035] p-4"
                animate={{ y: hover ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                style={{
                  boxShadow: hover
                    ? "0 18px 45px rgba(59,130,246,0.12)"
                    : "none",
                }}
              >
                <div className="text-[10px] uppercase tracking-[0.32em] text-white/60">
                  Verified
                </div>
                <div className="text-[11px] font-semibold text-white/80">
                  CDX Authority
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
      <div className="text-[10px] tracking-[0.26em] text-white/60 uppercase">
        {label}
      </div>
      <div className="mt-2 text-[12px] font-semibold text-white/90 truncate">
        {value}
      </div>
    </div>
  );
}
