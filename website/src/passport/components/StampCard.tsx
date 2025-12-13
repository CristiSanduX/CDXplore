import React from "react";
import type { Country } from "../types";
import { motion } from "framer-motion";

type Ink = {
  ring: string;
  ink: string;
  bg1: string;
  bg2: string;
  wash: string;
};

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const RING_TEXT_TOP = "PASSPORT STAMP • AUTHENTIC •";
const RING_TEXT_BOTTOM = "COUNTRY VERIFIED • ENTRY •";

function inkForContinent(continent: Country["continent"]): Ink {
  switch (continent) {
    case "Europe":
      return {
        ring: "rgba(122,30,58,0.50)",
        ink: "rgb(88 18 41)",
        bg1: "#ffffff",
        bg2: "#fff7f9",
        wash: "rgba(122,30,58,0.12)",
      };
    case "Asia":
      return {
        ring: "rgba(2,132,199,0.42)",
        ink: "rgb(12 74 110)",
        bg1: "#ffffff",
        bg2: "#f5fbff",
        wash: "rgba(2,132,199,0.12)",
      };
    case "North America":
      return {
        ring: "rgba(16,185,129,0.36)",
        ink: "rgb(6 95 70)",
        bg1: "#ffffff",
        bg2: "#f4fff9",
        wash: "rgba(16,185,129,0.12)",
      };
    case "South America":
      return {
        ring: "rgba(245,158,11,0.36)",
        ink: "rgb(124 45 18)",
        bg1: "#ffffff",
        bg2: "#fffaf2",
        wash: "rgba(245,158,11,0.12)",
      };
    case "Africa":
      return {
        ring: "rgba(168,85,247,0.34)",
        ink: "rgb(88 28 135)",
        bg1: "#ffffff",
        bg2: "#fbf7ff",
        wash: "rgba(168,85,247,0.12)",
      };
    case "Oceania":
    default:
      return {
        ring: "rgba(14,116,144,0.34)",
        ink: "rgb(8 51 68)",
        bg1: "#ffffff",
        bg2: "#f3fbff",
        wash: "rgba(14,116,144,0.12)",
      };
  }
}

export function StampCard({ c }: { c: Country }) {
  const ink = inkForContinent(c.continent);

  const name = (c.name || "").toUpperCase();
  const cont = (c.continent || "").toUpperCase();
  const code = (c.code || "").toUpperCase();

  const uid = React.useId();
  const pathOuter = `pathOuter-${uid}`;
  const pathInner = `pathInner-${uid}`;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn(
        "group relative h-[220px] w-full overflow-hidden rounded-2xl",
        "border border-slate-200 bg-white shadow-sm",
        "transition-[box-shadow,border-color] duration-200",
        "hover:shadow-md hover:border-slate-300",
        "dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20"
      )}
    >
      {/* paper background */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(180deg, ${ink.bg1}, ${ink.bg2})` }}
      />

      {/* soft wash */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background: `radial-gradient(60% 50% at 50% 15%, ${ink.wash}, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* subtle paper lines */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(15,23,42,0.55) 0px, rgba(15,23,42,0.55) 1px, transparent 1px, transparent 7px)",
        }}
      />

      <div className="absolute top-3 left-3 right-3 text-center">
        <p
          className={cn(
            "font-serif text-[13px] font-semibold leading-tight",
            "text-slate-900 dark:text-slate-100"
          )}
          style={{
            letterSpacing: "0.01em",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {name}
        </p>

        <p className="mt-1 font-sans text-[11px] font-medium uppercase leading-none text-slate-500 dark:text-slate-400">
          {cont}
        </p>
      </div>

      {/* inner ticket outline */}
      <div
        className="absolute left-5 right-5 top-9 bottom-5 rounded-[22px]"
        style={{
          border: `1px dashed ${ink.ring}`,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.65)",
        }}
      />

      {/* big ISO */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative -mt-2">
          <div
            className="text-[52px] font-black tracking-tight"
            style={{ color: ink.ink }}
          >
            {code}
          </div>
          <div
            className="absolute left-0 top-[44px] select-none text-[20px] font-black opacity-[0.12]"
            style={{ color: ink.ink, letterSpacing: "0.14em" }}
            aria-hidden
          >
            {code}
          </div>
        </div>
      </div>

      <div className="absolute left-6 bottom-6">
        <motion.div
          className="relative h-[104px] w-[104px]"
          whileHover={{ rotate: -3 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {/* subtle drop shadow */}
          <div className="absolute inset-0 rounded-full shadow-[0_18px_40px_rgba(2,6,23,0.10)]" />

          {/* ink halo */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 50% 40%, ${ink.wash} 0%, rgba(255,255,255,0) 65%)`,
              filter: "blur(0.2px)",
            }}
          />

          {/* stamp base */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.25) 55%, rgba(255,255,255,0) 78%)",
            }}
          />

          {/* outer ring – thicker */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `3px solid ${ink.ring}`,
              opacity: 0.85,
            }}
          />

          {/* outer dotted ring */}
          <div
            className="absolute inset-[5px] rounded-full"
            style={{
              border: `2px dotted ${ink.ring}`,
              opacity: 0.85,
            }}
          />

          {/* inner ring */}
          <div
            className="absolute inset-[16px] rounded-full"
            style={{
              border: `2px solid ${ink.ring}`,
              opacity: 0.55,
            }}
          />

          {/* micro ticks */}
          <div
            className="absolute inset-[12px] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(0,0,0,0) 0 8deg, rgba(0,0,0,0.10) 8deg 9deg)",
              WebkitMask:
                "radial-gradient(circle at 50% 50%, transparent 58%, black 60%)",
              mask:
                "radial-gradient(circle at 50% 50%, transparent 58%, black 60%)",
              opacity: 0.18,
            }}
            aria-hidden
          />

          {/* curved text: top + bottom */}
          <svg className="absolute inset-0" viewBox="0 0 100 100" aria-hidden>
            <defs>
              <path
                id={pathOuter}
                d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
              />
              <path
                id={pathInner}
                d="M 50,50 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0"
              />
            </defs>

            {/* top arc */}
            <text
              fill={ink.ink}
              opacity="0.62"
              fontSize="7.0"
              fontWeight="800"
              letterSpacing="3"
              style={{ textTransform: "uppercase" }}
            >
              <textPath href={`#${pathOuter}`} startOffset="50%" textAnchor="middle">
                {RING_TEXT_TOP}
              </textPath>
            </text>

            <text
              fill={ink.ink}
              opacity="0.52"
              fontSize="6.6"
              fontWeight="800"
              letterSpacing="3"
              style={{ textTransform: "uppercase" }}
            >
              <textPath href={`#${pathInner}`} startOffset="50%" textAnchor="middle">
                {RING_TEXT_BOTTOM}
              </textPath>
            </text>
          </svg>

          {/* center emblem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative flex h-[34px] w-[34px] items-center justify-center rounded-full"
              style={{
                border: `2px solid ${ink.ring}`,
                background: "rgba(255,255,255,0.45)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.55)",
              }}
            >
              <div
                className="text-[13px] font-black"
                style={{ color: ink.ink, letterSpacing: "0.06em" }}
              >
                {code}
              </div>

              <div
                className="pointer-events-none absolute inset-0 rounded-full opacity-[0.22]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 40%, rgba(0,0,0,0.22) 0 1px, transparent 2px), radial-gradient(circle at 70% 65%, rgba(0,0,0,0.18) 0 1px, transparent 2px), radial-gradient(circle at 55% 25%, rgba(0,0,0,0.14) 0 1px, transparent 2px)",
                }}
                aria-hidden
              />
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-[0.12]"
            style={{
              background:
                "radial-gradient(circle at 35% 60%, rgba(0,0,0,0.35) 0%, transparent 55%), radial-gradient(circle at 70% 35%, rgba(0,0,0,0.25) 0%, transparent 52%)",
              mixBlendMode: "multiply",
            }}
            aria-hidden
          />
        </motion.div>
      </div>

      {/* gloss */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/40 blur-2xl dark:bg-white/10" />
    </motion.div>
  );
}
