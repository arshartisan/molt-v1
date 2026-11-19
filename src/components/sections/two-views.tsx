"use client";

import { ArrowUpRight } from "lucide-react";
import { ColumnGuides, FadeUp, RevealHeading, SectionHead } from "@/components/primitives";

const CARDS = [
  {
    tag: "Monitoring",
    big: "785",
    unit: "birds",
    under: "Last camera count · 18 min ago",
    title: "What the cameras see",
    meta: "Camera-detected birds",
    body: "Latest detected birds, with count timing and camera coverage.",
    foot: ["Count timing", "and coverage"],
  },
  {
    tag: "Recordkeeping",
    big: "799",
    unit: "birds",
    under: "Based on recorded bird activity",
    title: "What your records say",
    meta: "Recorded flock",
    body: "Placements and recorded activity through every growing cycle.",
    foot: ["Every cycle", "accounted for"],
  },
  {
    tag: "Together",
    big: "2 views",
    unit: "",
    under: "Kept separate, side by side",
    title: "One better picture",
    meta: "Molt",
    body: "A recount updates camera observations, not flock records.",
    foot: ["No guesswork", "in your ledger"],
  },
];

const STRIP = [
  ["Farm", "barn and area context"],
  ["Counts", "beside flock records"],
  ["Clear", "missing and partial states"],
  ["Per farm", "Manager or Worker access"],
];

export function TwoViews() {
  return (
    <section data-section="6" data-theme="light" className="relative bg-paper">
      <div className="wrap relative pb-24 md:pb-32">
        <SectionHead num="06" title="The count and the context" aside="Illustrative example" />
        <div className="relative pb-14 pt-14 md:pb-20 md:pt-20">
          <ColumnGuides />
          <RevealHeading className="display-lg relative" lines={[{ text: "Two views." }, { text: "One better picture.", muted: true }]} />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <FadeUp key={c.tag} delay={i * 0.1} className="flex flex-col border border-ink/10 bg-white">
              <div className="flex items-center justify-between border-b border-ink/10 px-3.5 py-3">
                <span className="mono text-ink/60">{c.tag}</span>
                <ArrowUpRight className="size-4" />
              </div>
              <div className="border-b border-ink/10 px-3.5 py-6">
                <p className="text-[46px] font-medium leading-none tracking-[-0.05em] md:text-[56px]">
                  {c.big} {c.unit && <span className="text-[20px] tracking-[-0.03em] text-slate">{c.unit}</span>}
                </p>
                <p className="mt-2 text-[14px] text-slate">{c.under}</p>
              </div>
              <div className="flex-1 border-b border-ink/10 px-3.5 py-4">
                <p className="text-[15px]">
                  <span className="font-medium">{c.title}</span> <span className="text-slate">{c.meta}</span>
                </p>
                <p className="mt-1.5 text-[15px] leading-[1.4] text-slate">{c.body}</p>
              </div>
              <p className="px-3.5 py-3 text-[14px]">
                <span className="font-medium">{c.foot[0]}</span> <span className="text-slate">{c.foot[1]}</span>
              </p>
            </FadeUp>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 border-y border-ink/12 md:grid-cols-4">
          {STRIP.map(([a, b], i) => (
            <div key={a} className={`py-4 md:px-4 md:first:pl-0 ${i < 3 ? "md:border-r md:border-ink/12" : ""}`}>
              <span className="text-[24px] font-medium tracking-[-0.04em]">{a}</span>{" "}
              <span className="text-[14px] text-slate">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
