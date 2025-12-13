import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PageFlipProps = {
  /** cheie unică pentru animație (ex: spreadIndex) */
  pageKey: string | number;
  /** direcție: +1 (next) sau -1 (prev) */
  dir: 1 | -1;

  /** ce se vede pe fața foii */
  front: React.ReactNode;
  /** ce se vede pe spatele foii (de obicei următoarea/precedenta pagină) */
  back: React.ReactNode;

  /** lățime/înălțime container */
  className?: string;

  /** dacă vrei să dezactivezi flip-ul (ex: copertă statică) */
  disabled?: boolean;
};

export function PageFlip({
  pageKey,
  dir,
  front,
  back,
  className,
  disabled,
}: PageFlipProps) {
  const startRotate = useMemo(() => (dir === 1 ? 0 : 0), [dir]);
  const endRotate = useMemo(() => (dir === 1 ? -180 : 180), [dir]);

  if (disabled) {
    return <div className={className}>{front}</div>;
  }

  return (
    <div
      className={className}
      style={{
        perspective: "1600px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageKey}
            initial={{ rotateY: startRotate }}
            animate={{ rotateY: endRotate }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.75,
              ease: [0.2, 0.8, 0.2, 1],
            }}
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transformOrigin: dir === 1 ? "left center" : "right center",
            }}
          >
            {/* FRONT */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
              }}
            >
              {front}

              {/* edge highlight */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 24,
                  right: dir === 1 ? 0 : undefined,
                  left: dir === -1 ? 0 : undefined,
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0), rgba(0,0,0,0.10))",
                  pointerEvents: "none",
                  mixBlendMode: "overlay",
                }}
              />

              {/* shadow that grows while turning */}
              <motion.div
                initial={{ opacity: 0.0 }}
                animate={{ opacity: 0.32 }}
                transition={{ duration: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    dir === 1
                      ? "linear-gradient(to right, rgba(0,0,0,0.28), rgba(0,0,0,0))"
                      : "linear-gradient(to left, rgba(0,0,0,0.28), rgba(0,0,0,0))",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* BACK */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
              }}
            >
              {back}

              {/* softer shadow on the back */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    dir === 1
                      ? "linear-gradient(to left, rgba(0,0,0,0.18), rgba(0,0,0,0))"
                      : "linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0))",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
