// src/pages/ShopPage.tsx
import React, { useMemo, useState } from "react";

const CHECKOUT_URL_ALL = "https://cristisandux.gumroad.com/l/world-passport-stamps";
// Optional: if you later create a separate Gumroad product for Europe-only
const CHECKOUT_URL_EUROPE =
  "https://cristisandux.gumroad.com/l/europe-passport-stamps";

type Pack = "all" | "europe";

const PACKS: Record<
  Pack,
  {
    badge: string;
    title: string;
    subtitle: string;
    price: string;
    includes: string[];
    previewCount: number;
    checkoutUrl: string;
    tag?: string;
    highlight?: boolean;
    cover: string; // big image
    thumb: string; // square image
  }
> = {
  all: {
    badge: "Best value • Full world pack",
    title: "World Passport Stamps",
    subtitle:
      "195 premium circular stamps (all countries) with transparent background — built as a consistent travel design system.",
    price: "€7.99",
    includes: [
      "195 stamps (World)",
      "Transparent background (PNG)",
      "Consistent circle + proportions",
      "Ready for apps, web & socials",
      "Commercial use included",
      "Instant download",
    ],
    previewCount: 8,
    checkoutUrl: CHECKOUT_URL_ALL,
    tag: "Most popular",
    highlight: true,
    cover: "/shops/products/world-cover.png",
    thumb: "/shops/products/world-thumb.png",
  },
  europe: {
    badge: "Smaller pack • Europe only",
    title: "European Passport Stamps",
    subtitle:
      "44 premium circular stamps (Europe) with transparent background — same style and proportions as the world pack.",
    price: "€4.99",
    includes: [
      "44 stamps (Europe)",
      "Transparent background (PNG)",
      "Consistent circle + proportions",
      "Ready for apps, web & socials",
      "Commercial use included",
      "Instant download",
    ],
    previewCount: 8,
    checkoutUrl: CHECKOUT_URL_EUROPE || CHECKOUT_URL_ALL, // fallback
    tag: "Starter pack",
    highlight: false,
    cover: "/shops/products/europe-cover.png",
    thumb: "/shops/products/europe-thumb.png",
  },
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const faq = [
  {
    q: "Do I get instant download after payment?",
    a: "Yes. After checkout you’ll get instant access to the files (and an email receipt with the download).",
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
    a: "High-resolution PNG files with transparent background.",
  },
  {
    q: "Is Europe included in the World pack?",
    a: "Yes. The World pack includes Europe (44) plus the rest of the world — total 195 stamps.",
  },
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

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm">
      {children}
    </span>
  );
}

function ProductCard({
  data,
  active,
  onSelect,
  onBuy,
}: {
  data: (typeof PACKS)[Pack];
  active: boolean;
  onSelect: () => void;
  onBuy: () => void;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-white shadow-[0_18px_45px_rgba(0,0,0,0.06)] transition",
        active ? "border-zinc-900/30" : "border-zinc-200 hover:border-zinc-300"
      )}
    >
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,45,64,0.14),transparent_60%)] blur-2xl" />
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="block w-full text-left"
        aria-pressed={active}
      >
        {/* media */}
        <div className="relative">
          <div className="absolute left-5 top-5 z-10 flex items-center gap-2">
            {data.tag && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-bold shadow-sm",
                  data.highlight
                    ? "bg-[rgb(124,45,64)] text-white"
                    : "bg-zinc-900 text-white"
                )}
              >
                {data.tag}
              </span>
            )}
 
          </div>

          {/* Cover image */}
          <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-50">
            <img
              src={data.cover}
              alt={`${data.title} cover`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
              onError={(e) => {
                // fallback to thumb if cover missing
                const img = e.currentTarget;
                img.src = data.thumb;
                img.className = "h-full w-full object-cover";
              }}
            />
          </div>

          {/* bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/60 to-transparent" />
        </div>

        {/* content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-zinc-500">{data.badge}</div>
              <div className="mt-1 text-xl font-black tracking-tight text-zinc-900">
                {data.title}
              </div>
              <div className="mt-2 text-sm text-zinc-600">{data.subtitle}</div>
            </div>

            {/* square thumb */}
            <div className="hidden shrink-0 md:block">
              <div className="h-16 w-16 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <img
                  src={data.thumb}
                  alt={`${data.title} thumbnail`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // if thumb missing, do nothing
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          </div>

          {/* bullets */}
          <div className="mt-5 grid gap-2">
            {data.includes.slice(0, 4).map((x) => (
              <div key={x} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-zinc-900" />
                <div className="text-sm text-zinc-700">{x}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onBuy();
              }}
              className={cn(
                "inline-flex w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition sm:w-auto",
                data.highlight
                  ? "bg-[rgb(124,45,64)] shadow-[rgba(124,45,64,0.18)] hover:brightness-110"
                  : "bg-zinc-900 shadow-zinc-900/10 hover:bg-zinc-800"
              )}
            >
              Buy now — {data.price}
              <span className="ml-2 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>

            <div className="text-xs text-zinc-500">
              One-time purchase • Instant download
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default function ShopPage() {
  const [pack, setPack] = useState<Pack>("all");
  const [open, setOpen] = useState<number | null>(0);

  const active = PACKS[pack];

  const preview = useMemo(() => {
    const folder = pack === "all" ? "world" : "europe";
    return Array.from({ length: active.previewCount }).map((_, i) => ({
      id: i,
      src: `/shops/previews/${folder}/preview-${i + 1}.png`,
    }));
  }, [pack, active.previewCount]);

  const goBuy = () => {
    const url = active.checkoutUrl;
    if (!url) {
      alert("Set your Gumroad checkout link.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,45,64,0.16),transparent_62%)] blur-2xl" />
        <div className="absolute -bottom-40 right-[-140px] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.10),transparent_60%)] blur-2xl" />
      </div>

      {/* Top bar / hero */}
      <section className="relative mx-auto max-w-6xl px-5 pb-10 pt-8 md:pb-12 md:pt-12">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatPill>Transparent PNG</StatPill>
              <StatPill>Commercial use</StatPill>
              <StatPill>Instant download</StatPill>
              <StatPill>Consistent design system</StatPill>
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
              CDXplore Shop
            </h1>
            <p className="mt-2 max-w-2xl text-base text-zinc-600 md:text-lg">
              Premium passport-style stamp packs for apps, web, and travel content.
              Start with Europe or grab the full world set.
            </p>
          </div>

          {/* “selection” pill group */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPack("all")}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition",
                pack === "all"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              )}
            >
              World (195) — €7
            </button>
            <button
              type="button"
              onClick={() => setPack("europe")}
              className={cn(
                "rounded-full border px-4 py-2 text-xs font-semibold transition",
                pack === "europe"
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              )}
            >
              Europe (44) — €5
            </button>
          </div>
        </div>

        {/* Shop grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProductCard
            data={PACKS.all}
            active={pack === "all"}
            onSelect={() => setPack("all")}
            onBuy={() => {
              setPack("all");
              window.open(PACKS.all.checkoutUrl, "_blank", "noopener,noreferrer");
            }}
          />
          <ProductCard
            data={PACKS.europe}
            active={pack === "europe"}
            onSelect={() => setPack("europe")}
            onBuy={() => {
              setPack("europe");
              window.open(PACKS.europe.checkoutUrl, "_blank", "noopener,noreferrer");
            }}
          />
        </div>

        {/* Mini “active pack” strip */}
        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-500">Selected</div>
              <div className="mt-1 text-lg font-black tracking-tight">{active.title}</div>
              <div className="mt-1 text-sm text-zinc-600">{active.subtitle}</div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="text-right">
                <div className="text-3xl font-black tracking-tight">{active.price}</div>
                <div className="text-xs text-zinc-500">VAT may apply • Gumroad</div>
              </div>
              <button
                onClick={goBuy}
                className="rounded-2xl bg-[rgb(124,45,64)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(124,45,64,0.18)] hover:brightness-110"
              >
                Checkout →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="relative mx-auto max-w-6xl px-5 pb-14">
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
            Buy {active.price}
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
            Need an extended license for client work or large distribution? Email me.
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

                <div
                  className={cn(
                    "overflow-hidden px-6 transition-[max-height,opacity] duration-300 ease-out",
                    isOpen ? "max-h-52 opacity-100" : "max-h-0 opacity-0"
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
            Buy now — {active.price}
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
