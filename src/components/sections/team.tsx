"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ColumnGuides, CubeIcon, RevealHeading, SectionHead } from "@/components/primitives";
import { cn } from "@/lib/utils";

type NodeId = "owner" | "sms" | "manager" | "worker" | "batch" | "records" | "farm";

const NODES: { id: NodeId; title: string; sub: string; tag: string; col: number; row: number }[] = [
  { id: "owner", title: "Owner", sub: "Setup & permissions", tag: "Role", col: 0, row: 0 },
  { id: "sms", title: "SMS invite", sub: "Six-digit code", tag: "Sign-in", col: 1, row: 0 },
  { id: "manager", title: "Manager", sub: "Assigned farm access", tag: "Role", col: 2, row: 0 },
  { id: "worker", title: "Worker", sub: "Daily bird records", tag: "Role", col: 0, row: 2 },
  { id: "batch", title: "Batch 14", sub: "Deaths & culls", tag: "Batch", col: 1, row: 2 },
  { id: "records", title: "Area A3", sub: "Tied to the record", tag: "Area", col: 2, row: 2 },
];

const STEPS: { text: string; on: NodeId[] }[] = [
  { text: "The owner sends an SMS invitation.", on: ["owner", "sms"] },
  { text: "A new worker signs in with a six-digit code.", on: ["sms", "worker"] },
  { text: "The owner assigns Worker access for Barn 01.", on: ["owner", "farm", "worker"] },
  { text: "Deaths and culls stay tied to the batch and area.", on: ["worker", "batch", "records", "farm"] },
];

export function Team() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), 3200);
    return () => clearTimeout(t);
  }, [step]);
  const on = STEPS[step].on;

  return (
    <section id="team" data-section="8" data-theme="light" className="relative bg-paper">
      <div className="wrap relative pb-24 md:pb-32">
        <SectionHead num="08" title="The right people. The right access." aside="Per farm" />
        <div className="relative pb-14 pt-14 md:pb-20 md:pt-20">
          <ColumnGuides />
          <RevealHeading className="display-lg relative" lines={[{ text: "A shared view." }, { text: "A connected team.", muted: true }]} />
        </div>

        <div className="overflow-hidden bg-ink text-white">
          <div className="flex items-start justify-between border-b border-white/10 px-5 py-6 md:px-8">
            <div>
              <p className="mono text-white/55">An invite, step {step + 1} of {STEPS.length}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-2 text-[22px] font-medium tracking-[-0.03em] md:text-[26px]"
                >
                  {STEPS[step].text}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="mt-1 hidden gap-1 sm:flex">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  aria-label={`Step ${i + 1}`}
                  className={cn("h-[3px] w-[18px] transition-colors", i === step ? "bg-orange" : "bg-white/20")}
                />
              ))}
            </div>
          </div>

          <div className="dot-grid relative grid grid-cols-1 gap-3 p-5 sm:grid-cols-3 sm:grid-rows-[auto_auto_auto] sm:gap-y-8 md:p-10">
            {/* connectors */}
            <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
              <g fill="none" stroke="rgba(255,255,255,.22)" strokeDasharray="1 1.2" vectorEffect="non-scaling-stroke">
                <path d="M17 25 V50 H40" vectorEffect="non-scaling-stroke" />
                <path d="M83 25 V50 H60" vectorEffect="non-scaling-stroke" />
                <path d="M50 25 V38" vectorEffect="non-scaling-stroke" />
                <path d="M17 75 V50" vectorEffect="non-scaling-stroke" />
                <path d="M83 75 V50" vectorEffect="non-scaling-stroke" />
                <path d="M50 62 V75" vectorEffect="non-scaling-stroke" />
              </g>
            </svg>

            {NODES.filter((n) => n.row === 0).map((n) => (
              <Node key={n.id} n={n} active={on.includes(n.id)} />
            ))}
            <div className="relative z-10 flex justify-center sm:col-span-3">
              <div
                className={cn(
                  "flex items-center gap-4 border px-5 py-3 transition-colors duration-500",
                  on.includes("farm") ? "border-orange bg-ink-2" : "border-white/20 bg-ink",
                )}
              >
                <CubeIcon glyph="barn" size={52} dark />
                <div>
                  <p className="mono text-white/55">Your farm</p>
                  <p className="text-[20px] font-medium tracking-[-0.03em]">Barn 01</p>
                </div>
              </div>
            </div>
            {NODES.filter((n) => n.row === 2).map((n) => (
              <Node key={n.id} n={n} active={on.includes(n.id)} />
            ))}
          </div>
          <p className="mono border-t border-white/10 px-5 py-3 text-white/45 md:px-8">
            Illustrative roles · available actions depend on account permissions
          </p>
        </div>
      </div>
    </section>
  );
}

function Node({ n, active }: { n: (typeof NODES)[number]; active: boolean }) {
  return (
    <div
      className={cn(
        "relative z-10 border p-3.5 transition-all duration-500",
        active ? "border-orange bg-white text-ink" : "border-white/10 bg-[#2a2d34] text-white/55",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[15px] font-medium">
          <span className={cn("size-[7px]", active ? "bg-leaf" : "bg-white/30")} />
          {n.title}
        </span>
        <span className={cn("mono text-[10px]", active ? "text-ink/50" : "text-white/35")}>{n.tag}</span>
      </div>
      <p className={cn("mt-1 font-mono text-[12px]", active ? "text-ink/70" : "text-white/40")}>{n.sub}</p>
    </div>
  );
}
