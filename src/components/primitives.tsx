"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Logo                                                                 */
/* ------------------------------------------------------------------ */

/** Molt "M" mark, traced from the brand logo (900×900 source). */
export const MOLT_M_PATHS = [
  "M160 512 L384 334 Q392 328 393 338 L395 494 L168 670 Q160 676 160 664 Z",
  "M395 494 L730 232 Q741 224 741 238 L741 576 Q741 582 736 586 L628 669 Q616 678 616 664 L615 522 Q614 510 604 518 L408 669 Q397 677 397 665 Z",
];

/** Square app-icon mark: yellow tile + black M (tone "orange"), or a bare black M on yellow surfaces (tone "ink"). */
export function MoltMark({ className, tone = "orange" }: { className?: string; tone?: "orange" | "ink" }) {
  const tile = tone === "orange";
  return (
    <svg viewBox="0 0 900 900" className={cn("size-[22px]", className)} aria-hidden>
      {tile && <rect width="900" height="900" fill="#FFD60A" />}
      <g transform={tile ? undefined : "translate(450 450) scale(1.4) translate(-450 -450)"}>
        {MOLT_M_PATHS.map((d) => (
          <path key={d} d={d} fill="#0B0C0F" />
        ))}
      </g>
    </svg>
  );
}

export function Logo({ tone = "orange", className }: { tone?: "orange" | "ink"; className?: string }) {
  return (
    <Link href="#top" className={cn("flex items-center gap-2", className)} aria-label="Molt home">
      <MoltMark tone={tone} />
      <span className="text-[19px] font-medium tracking-[-0.035em]">Molt</span>
    </Link>
  );
}

/** Backer emblem (from dark_emblem.svg). The dark facet turns light on dark surfaces. */
export function BackerEmblem({ className, dark }: { className?: string; dark?: boolean }) {
  const base = dark ? "#E9EBEF" : "#212D34";
  return (
    <svg viewBox="0 0 888 1026" className={className} aria-hidden>
      <path
        d="M853.82 236.49L717.4 157.73V395L648.31 434.91L425 563.81L239.15 671.1V907.86L273.38 927.68L443.65 1026H443.73L887.46 769.79V255.89L853.82 236.49ZM717.4 671.32L648.31 711.23L425 840.16V760.44L648.31 631.51L717.4 591.6V671.32Z"
        fill={base}
      />
      <path d="M614.51 98.32L425 207.74L239.15 315.04L170.06 354.9L0 453.11V256.47L170.06 158.26L239.15 118.41L425 11.11L444.23 0L614.51 98.32Z" fill="#00E48E" />
      <path d="M648.31 158.53V355.16L425 484.09L239.15 591.39L170.06 631.25L0 729.46V532.82L170.06 434.61L239.15 394.75L425 287.46L648.31 158.53Z" fill="#00E48E" />
      <path d="M170.06 710.96V868L34.0698 789.51L170.06 710.96Z" fill="#00E48E" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CTA – black block + orange arrow square                              */
/* ------------------------------------------------------------------ */

type CtaProps = {
  href: string;
  children: React.ReactNode;
  size?: "sm" | "lg";
  tone?: "dark" | "light" | "ink-on-orange" | "solid";
  className?: string;
  wide?: boolean;
};

export function Cta({ href, children, size = "lg", tone = "dark", className, wide }: CtaProps) {
  const h = size === "lg" ? "h-[58px]" : "h-[42px]";
  const box = size === "lg" ? "w-[58px]" : "w-[42px]";
  const body =
    tone === "light"
      ? "bg-white text-ink"
      : tone === "ink-on-orange"
        ? "bg-ink text-orange"
        : "bg-ink text-white";
  const arrow =
    tone === "ink-on-orange" ? "bg-ink text-orange" : tone === "solid" ? "bg-ink text-white" : "bg-orange text-ink";
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-stretch", h, wide && "w-full", className)}
    >
      <span
        className={cn(
          "flex items-center whitespace-nowrap font-medium tracking-[-0.02em]",
          size === "lg" ? "px-[22px] text-[16.5px]" : "px-[13px] text-[14.5px]",
          wide && "flex-1",
          body,
        )}
      >
        {children}
      </span>
      <span className={cn("grid place-items-center overflow-hidden", box, arrow)}>
        <ArrowRight
          className={cn(
            "transition-transform duration-300 group-hover:translate-x-[3px]",
            size === "lg" ? "size-[18px]" : "size-[15px]",
          )}
          strokeWidth={1.8}
        />
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Section head – the "+" crosshair rule with three mono labels         */
/* ------------------------------------------------------------------ */

export function SectionHead({
  num,
  title,
  aside,
  dark,
}: {
  num: string;
  title: string;
  aside?: string;
  dark?: boolean;
}) {
  const plus = dark ? "text-white/70" : "text-ink/70";
  return (
    <div className="relative pt-7">
      <div className={cn("absolute inset-x-0 top-[34px] h-px", dark ? "bg-white/15" : "bg-ink/12")} />
      <div className="pointer-events-none absolute inset-x-0 top-[27px] hidden md:block">
        {[0, 25, 50, 75, 100].map((p) => (
          <span
            key={p}
            className={cn("absolute -translate-x-1/2 text-[14px] leading-none font-light", plus)}
            style={{ left: `${p}%` }}
          >
            +
          </span>
        ))}
      </div>
      <div
        className={cn(
          "mono relative grid grid-cols-2 pt-[22px] md:grid-cols-4",
          dark ? "text-white/65" : "text-ink/60",
        )}
      >
        <span>{num}</span>
        <span className="hidden md:block">{title}</span>
        <span className="hidden md:block" />
        <span className="text-right">{aside ?? ""}</span>
        <span className="col-span-2 mt-2 md:hidden">{title}</span>
      </div>
    </div>
  );
}

/** Faint dashed column guides that sit behind section intros. */
export function ColumnGuides({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 hidden md:block", className)} aria-hidden>
      {[25, 47, 69].map((p) => (
        <span
          key={p}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${p}%`,
            backgroundImage: `linear-gradient(to bottom, ${dark ? "rgba(255,255,255,.12)" : "rgba(11,12,15,.13)"} 50%, transparent 50%)`,
            backgroundSize: "1px 6px",
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Headline reveal – word by word, two-tone                             */
/* ------------------------------------------------------------------ */

export function RevealHeading({
  lines,
  className,
  as = "h2",
  dark,
  delay = 0,
}: {
  /** Each line is [text, tone]. tone "muted" renders grey like the reference. */
  lines: { text: string; muted?: boolean }[];
  className?: string;
  as?: "h1" | "h2" | "p";
  dark?: boolean;
  delay?: number;
}) {
  const Tag = motion[as];
  let i = 0;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
    >
      {lines.map((line, li) => (
        <span key={li} className={cn("block", line.muted && (dark ? "text-fog-dark" : "text-fog"))}>
          {line.text.split(" ").map((word, wi) => {
            const idx = i++;
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-top -mb-[0.08em]">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "105%", opacity: 0 },
                    show: {
                      y: "0%",
                      opacity: 1,
                      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: delay + idx * 0.05 },
                    },
                  }}
                >
                  {word}
                </motion.span>
                {wi < line.text.split(" ").length - 1 && " "}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

export function FadeUp({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Isometric cube icon (orange face + glyph)                            */
/* ------------------------------------------------------------------ */

export type Glyph = "camera" | "count" | "batch" | "team" | "record" | "bell" | "phone" | "barn";

const GLYPHS: Record<Glyph, React.ReactNode> = {
  camera: (
    <>
      <rect x="0.18" y="0.34" width="0.46" height="0.34" />
      <path d="M0.64 0.44 L0.84 0.34 L0.84 0.68 L0.64 0.58 Z" />
    </>
  ),
  count: (
    <>
      <path d="M0.22 0.78 V0.55" />
      <path d="M0.4 0.78 V0.36" />
      <path d="M0.58 0.78 V0.46" />
      <path d="M0.76 0.78 V0.24" />
    </>
  ),
  batch: (
    <>
      <rect x="0.2" y="0.22" width="0.6" height="0.16" />
      <rect x="0.2" y="0.44" width="0.6" height="0.16" />
      <rect x="0.2" y="0.66" width="0.6" height="0.14" />
    </>
  ),
  team: (
    <>
      <circle cx="0.38" cy="0.36" r="0.11" />
      <circle cx="0.66" cy="0.4" r="0.09" />
      <path d="M0.18 0.8 Q0.38 0.5 0.58 0.8" />
      <path d="M0.54 0.72 Q0.66 0.52 0.84 0.74" />
    </>
  ),
  record: (
    <>
      <rect x="0.24" y="0.18" width="0.52" height="0.66" />
      <path d="M0.34 0.36 H0.66 M0.34 0.5 H0.66 M0.34 0.64 H0.54" />
    </>
  ),
  bell: (
    <>
      <path d="M0.28 0.66 Q0.3 0.26 0.5 0.24 Q0.7 0.26 0.72 0.66 Z" />
      <path d="M0.22 0.68 H0.78 M0.45 0.78 H0.55" />
    </>
  ),
  phone: (
    <>
      <rect x="0.3" y="0.16" width="0.4" height="0.7" rx="0.06" />
      <path d="M0.44 0.76 H0.56" />
    </>
  ),
  barn: (
    <>
      <path d="M0.18 0.82 V0.46 L0.5 0.2 L0.82 0.46 V0.82 Z" />
      <path d="M0.4 0.82 V0.6 H0.6 V0.82" />
    </>
  ),
};

export function CubeIcon({
  glyph = "camera",
  size = 40,
  className,
  dark,
  orange = true,
}: {
  glyph?: Glyph;
  size?: number;
  className?: string;
  dark?: boolean;
  orange?: boolean;
}) {
  // unit cube in iso, edge 1 → width 2*0.866
  const s = 14;
  const cx = 20;
  const top = 6;
  const c = 0.866 * s;
  const h = s * 0.5;
  const P = {
    t: [cx, top],
    tl: [cx - c, top + h],
    tr: [cx + c, top + h],
    m: [cx, top + 2 * h],
    bl: [cx - c, top + h + s],
    br: [cx + c, top + h + s],
    b: [cx, top + 2 * h + s],
  };
  const pt = (k: keyof typeof P) => P[k].join(",");
  const stroke = dark ? "#e9ebef" : "#0B0C0F";
  const faceL = dark ? "#1d2027" : "#ffffff";
  const faceT = dark ? "#2a2e36" : "#ffffff";
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden>
      <defs>
        <pattern id={`dots-${glyph}`} width="2.2" height="2.2" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r="0.35" fill={stroke} opacity="0.35" />
        </pattern>
      </defs>
      <polygon points={`${pt("t")} ${pt("tr")} ${pt("m")} ${pt("tl")}`} fill={faceT} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
      <polygon points={`${pt("tl")} ${pt("m")} ${pt("b")} ${pt("bl")}`} fill={faceL} stroke={stroke} strokeWidth="0.9" strokeLinejoin="round" />
      <polygon points={`${pt("tl")} ${pt("m")} ${pt("b")} ${pt("bl")}`} fill={`url(#dots-${glyph})`} />
      <polygon
        points={`${pt("m")} ${pt("tr")} ${pt("br")} ${pt("b")}`}
        fill={orange ? "#FFD60A" : faceL}
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* glyph mapped onto the right face: unit square → parallelogram */}
      <g
        transform={`matrix(${c} ${-h} 0 ${s} ${P.m[0]} ${P.m[1]})`}
        fill="none"
        stroke={orange ? "#0B0C0F" : stroke}
        strokeWidth={0.065}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[glyph]}
      </g>
    </svg>
  );
}
