import React from "react";

export function PageShell({
  children,
  pageNo,
  totalPages,
  variant = "page",
}: {
  children: React.ReactNode;
  pageNo: number;
  totalPages: number;
  variant?: "page" | "cover";
}) {
  const isCover = variant === "cover";

  return (
    <div className="relative h-full w-full">
      {/* ================= COVER ================= */}
      {isCover ? (
        <div className="absolute inset-0">{children}</div>
      ) : (
        <>
          {/* ================= PAPER PAGE ================= */}

          {/* page base */}
          <div
            className="absolute inset-6 rounded-[26px] border"
            style={{
              background: "#fbfaf7", // paper cream
              borderColor: "rgba(0,0,0,0.08)",
              boxShadow:
                "0 20px 60px rgba(2,6,23,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          />

          {/* paper fibers */}
          <div
            className="pointer-events-none absolute inset-6 rounded-[26px] opacity-[0.25]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
              mixBlendMode: "multiply",
            }}
          />

          {/* subtle vertical paper shading */}
          <div
            className="pointer-events-none absolute inset-6 rounded-[26px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.04), transparent 18%, transparent 82%, rgba(0,0,0,0.03))",
              opacity: 0.6,
            }}
          />

          {/* globe watermark */}
          <div
            className="pointer-events-none absolute inset-6 rounded-[26px] opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 55% 45%, rgba(0,0,0,0.18) 0px, transparent 55%)," +
                "radial-gradient(circle at 55% 45%, transparent 0px, transparent 120px, rgba(0,0,0,0.08) 121px, transparent 122px)",
            }}
          />

          {/* page number */}
          <div className="pointer-events-none absolute right-12 top-10 text-[11px] font-medium tracking-wider text-slate-400">
            {String(pageNo).padStart(2, "0")} /{" "}
            {String(totalPages).padStart(2, "0")}
          </div>

          {/* content */}
          <div className="absolute inset-0 p-12">{children}</div>
        </>
      )}
    </div>
  );
}
