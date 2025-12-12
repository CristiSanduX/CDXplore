export const THEME = {
  // base ink/text (folosite pt elemente “serioase”)
  ink: "#020617",
  text: "#0F172A",

  // surfaces (mai albe / minimaliste)
  border: "#E2E8F0",
  surface: "#FFFFFF",
  surface2: "#F8FAFC",

  // brand system
  brand: {
    // ✅ CDXplore burgundy (principal)
    primary: "#7A1E3A",
    glow: "rgba(122, 30, 58, 0.22)",

    // ✅ “glob pământesc” (secondary accent, doar dacă îl folosești în gradients)
    ocean: "#0EA5E9", // sky/cyan
    oceanGlow: "rgba(14, 165, 233, 0.22)",

    // status
    success: "#22C55E",

    // ✅ soft backgrounds (menține alb, nu gri)
    soft: "rgba(122, 30, 58, 0.05)",
    softOcean: "rgba(14, 165, 233, 0.06)",
  },

  // dark theme tokens
  dark: {
    bg: "#020617",
    text: "#E5E7EB",
    border: "rgba(148,163,184,0.18)",
    surface: "rgba(255,255,255,0.04)",

    // păstrăm burgundy ca glow principal în dark
    brandGlow: "rgba(122, 30, 58, 0.30)",
    // și ocean foarte subtil ca highlight (glob vibe)
    oceanGlow: "rgba(14, 165, 233, 0.20)",

    success: "#4ADE80",
  },
} as const;
