import { motion } from "framer-motion";
import { THEME } from "../../theme";

export function InsideCoverPage() {
  const brand = THEME?.brand?.primary ?? "rgba(122,30,58,0.92)";

  return (

      <div
        className="absolute inset-0 rounded-[24px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.06), rgba(15,23,42,0.015))",
        }}
      />

  );
}
