// src/pages/ShopPage.tsx
import React, { useMemo, useState } from "react";

const CHECKOUT_URL = "https://YOUR-CHECKOUT-LINK"; // Lemon Squeezy / Gumroad product link
const PRICE = "€5";
const PRODUCT_TITLE = "European Passport Stamps";
const PRODUCT_SUBTITLE =
  "44 premium circular stamps with transparent background — built as a consistent travel design system.";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const faq = [
  {
    q: "Do I get instant download after payment?",
    a: "Yes. After checkout you’ll receive the download link immediately (and by email).",
  },
  {
    q: "Can I use these in a commercial project (app/website)?",
    a: "Yes — commercial use is included. You can use them inside your product (app, website, socials).",
  },
  {
    q: "Can I resell or redistribute the files?",
    a: "No. You can’t resell/redistribute the pack as standalone assets or re-upload it elsewhere.",
  },
  {
    q: "What file format is included?",
    a: "This pack includes high-resolution PNG files with transparent background.",
  },
];

const included = [
  "44 stamps (Europe)",
  "Transparent background (PNG)",
  "Consistent circle + proportions",
  "Ready for apps, web & socials",
  "Commercial use included",
  "Instant download",
];

const useCases = [
  { title: "Travel apps", desc: "Passport screens, achievements, collections." },
  { title: "Web projects", desc: "Interactive maps, profile badges, galleries." },
  { title: "Instagram highlights", desc: "Clean covers that look cohesive." },
  { title: "Gamification UI", desc: "Unlockable stamps and progress tracking." },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={cn(
        "h-5 w-5 text-zinc-500 transition-transform duration-200",
        open && "rotate-180"
      )}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ShopPage() {
  const [open, setOpen] = useState<number | null>(0);

  const preview = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        // Replace with your real previews. Keep them optimized.
        // Example: /shop/previews/fr.png etc.
        src: `/shop/previews/preview-${i + 1}.png`,
      })),
    []
  );

  const goBuy = () => {
    if (!CHECKOUT_URL || CHECKOUT_URL.includes("YOUR-CHECKOUT-LINK")) {
      alert("Set CHECKOUT_URL to your Lemon Squeezy / Gumroad checkout link.");
      return;
    }
    window.open(CHECKOUT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,45,64,0.18),transparent_62%)] blur-2xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.12),transparent_60%)] blur-2xl" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 pb-10 pt-6 md:grid-cols-2 md:pb-14 md:pt-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[rgb(124,45,64)]" />
            Limited: Europe pack (44)
          </div>

          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            {PRODUCT_TITLE}
          </h1>
          <p className="mt-3 max-w-xl text-base text-zinc-600 md:text-lg">
            {PRODUCT_SUBTITLE}
          </p>

          {/* Value chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["Transparent PNG", "Consistent system", "Commercial use", "Instant download"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700"
                >
                  {t}
                </span>
              )
            )}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={goBuy}
              className="group relative inline-flex items-center justify-center rounded-2xl bg-[rgb(124,45,64)] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(124,45,64,0.18)] hover:brightness-110"
            >
              Buy the pack — {PRICE}
              <span className="ml-2 inline-block transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>

            <a
              href="#license"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              License & terms
            </a>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            Secure checkout. Instant delivery. No subscription.
          </p>
        </div>

        {/* Product card */}
        <div className="relative">
          <div className="rounded-3xl border border-zinc-200 bg-white/85 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Europe Lite Pack
                </div>
                <div className="mt-1 text-xs text-zinc-500">One-time purchase</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black tracking-tight">{PRICE}</div>
                <div className="text-xs text-zinc-500">VAT may apply</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2">
              {included.map((x) => (
                <div key={x} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-zinc-900" />
                  <div className="text-sm text-zinc-700">{x}</div>
                </div>
              ))}
            </div>

            <button
              onClick={goBuy}
              className="mt-6 w-full rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 hover:bg-zinc-800"
            >
              Checkout — Pay with card
            </button>

            <div className="mt-3 text-center text-xs text-zinc-500">
              Works great for apps, websites, and highlights.
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="relative mx-auto max-w-6xl px-5 pb-14 pt-2">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Preview</h2>
            <p className="mt-1 text-sm text-zinc-600">
              A small selection — full set included after purchase.
            </p>
          </div>
          <button
            onClick={goBuy}
            className="hidden rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 md:inline"
          >
            Buy {PRICE}
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {preview.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="aspect-square p-4">
                <img
                  src={p.src}
                  alt={`Stamp preview ${p.id + 1}`}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="relative mx-auto max-w-6xl px-5 pb-14">
        <h2 className="text-2xl font-black tracking-tight">Where it fits</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Designed to look consistent in real UI — not just as decoration.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {useCases.map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="text-sm font-semibold">{c.title}</div>
              <div className="mt-1 text-sm text-zinc-600">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* License */}
      <section id="license" className="relative mx-auto max-w-6xl px-5 pb-14">
        <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-black tracking-tight">License</h2>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Allowed</div>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                <li>• Use in personal & commercial projects</li>
                <li>• Apps, websites, social media</li>
                <li>• Modify for your own product needs</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="text-sm font-semibold">Not allowed</div>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                <li>• Resell or redistribute as standalone files</li>
                <li>• Upload to stock sites / marketplaces as-is</li>
                <li>• Share the download link publicly</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 text-xs text-zinc-500">
            If you need an extended license for client work or large distribution, contact me.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative mx-auto max-w-6xl px-5 pb-16">
        <h2 className="text-2xl font-black tracking-tight">FAQ</h2>

        <div className="mt-5 grid gap-3">
          {faq.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={item.q}
                className={cn(
                  "rounded-3xl border bg-white shadow-sm transition-colors",
                  isOpen ? "border-zinc-300" : "border-zinc-200 hover:bg-zinc-50/60"
                )}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  onClick={() => setOpen((v) => (v === idx ? null : idx))}
                  aria-expanded={isOpen}
                >
                  <div className="text-sm font-semibold text-zinc-900">{item.q}</div>
                  <Chevron open={isOpen} />
                </button>

                {/* Stable accordion (no grid-rows hack) */}
                <div
                  className={cn(
                    "overflow-hidden px-6 transition-[max-height,opacity] duration-300 ease-out",
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="pb-5 text-sm text-zinc-600">{item.a}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-600">
            Ready? You’ll get the download immediately after checkout.
          </div>
          <button
            onClick={goBuy}
            className="rounded-2xl bg-[rgb(124,45,64)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(124,45,64,0.18)] hover:brightness-110"
          >
            Buy now — {PRICE}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} CDXplore</div>
          <div className="flex gap-4">
            <a className="hover:text-zinc-700" href="mailto:hello@cdxplore.com">
              Contact
            </a>
            <span className="text-zinc-300">•</span>
            <span>Designed by CSX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
