"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Bell, MessageSquare } from "lucide-react";
import { ColumnGuides, CubeIcon, FadeUp, RevealHeading, SectionHead } from "@/components/primitives";
import { EVERYDAY } from "@/lib/content";
import { cn } from "@/lib/utils";

const STEP_MS = 5200;

export function Everyday() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setActive((a) => (a + 1) % EVERYDAY.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <section data-section="4" className="relative">
      {/* dark intro */}
      <div data-theme="dark" className="relative bg-ink text-white">
        <div className="wrap relative">
          <SectionHead num="04" title="Made for the everyday" aside="6 tools, one view" dark />
          <div className="relative grid gap-10 pb-0 pt-14 md:grid-cols-2 md:pt-20">
            <ColumnGuides dark className="md:right-1/2" />
            <div className="relative flex flex-col justify-between pb-10 md:pb-14">
              <RevealHeading
                dark
                className="display-lg"
                lines={[{ text: "Big on the picture." }, { text: "Close to the details.", muted: true }]}
              />
              <FadeUp delay={0.3}>
                <p className="lede mt-16 max-w-[40ch] text-white/65 md:mt-40">
                  From your first check of the day to your latest flock record, the tools you need are right where you
                  need them.
                </p>
              </FadeUp>
            </div>
            <CameraPanel />
          </div>
        </div>
      </div>

      {/* light list + preview */}
      <div data-theme="light" className="bg-paper">
        <div className="wrap grid gap-8 py-16 md:py-24 lg:grid-cols-2 lg:gap-6">
          <ol className="border-t border-ink/12">
            {EVERYDAY.map((item, i) => (
              <li key={item.title} className="relative border-b border-ink/12">
                <button
                  className="flex w-full items-center gap-6 py-5 text-left md:py-6"
                  onClick={() => setActive(i)}
                  aria-expanded={active === i}
                >
                  <span className="mono w-6 text-ink/50">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={cn(
                      "flex-1 text-[24px] tracking-[-0.035em] transition-colors md:text-[30px]",
                      active === i ? "text-ink" : "text-fog hover:text-ink/70",
                    )}
                  >
                    {item.title}
                  </span>
                  <AnimatePresence>
                    {active === i && (
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                        <CubeIcon glyph={item.glyph} size={38} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
                {active === i && (
                  <motion.span
                    key={`p-${active}`}
                    className="absolute bottom-[-1px] left-0 h-[2px] bg-orange"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                  />
                )}
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-12 pr-6 text-[15px] text-slate lg:hidden"
                    >
                      <span className="block pb-5">{item.body}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ol>

          <div className="relative flex min-h-[460px] flex-col overflow-hidden bg-ink text-white">
            <div className="dot-grid relative flex flex-1 items-center justify-center p-6 md:p-10">
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(255,214,10,.28),transparent_70%)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-[400px]"
                >
                  <Preview i={active} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex items-end justify-between gap-6 border-t border-white/10 px-5 py-5">
              <p className="max-w-[44ch] text-[15px] text-white/65">{EVERYDAY[active].body}</p>
              <Link href="#how" className="flex shrink-0 items-center gap-1.5 text-[15px] font-medium hover:text-orange">
                See how it works <ArrowRight className="size-4 text-orange" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CameraPanel() {
  return (
    <div className="relative min-h-[380px] overflow-hidden border-l border-white/10 md:min-h-[520px]">
      <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_55%_50%,#1f232b,transparent_70%)]" />
      <div className="absolute right-5 top-5 text-right">
        <p className="mono text-white/60">Coverage</p>
        <p className="text-[24px] font-medium tracking-[-0.03em]">A1 – A4</p>
      </div>
      {/* camera feed frame */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[78%] max-w-[420px] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <CameraFeed />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 px-5 py-4">
        <p className="mono text-white/50">Context</p>
        <p className="text-[19px] font-medium tracking-[-0.03em]">The area behind the count.</p>
      </div>
    </div>
  );
}

/** Stylised top-down barn camera view with detection boxes (illustrative). */
export function CameraFeed({ compact, src = "/snapshots/live-a2.webp" }: { compact?: boolean; src?: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-white/15 bg-[#191b20]">
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1.04, 1.08, 1.04] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={src} alt="Overhead camera view of broiler chickens in Barn 01, area A2" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,.03)_0_1px,transparent_1px_3px)]" />
      <div className="mono absolute left-2 top-2 flex items-center gap-1.5 bg-black/60 px-1.5 py-1 text-[10px] text-white">
        <span className="size-[6px] animate-blink rounded-full bg-[#ff3b30]" /> Live · A2
      </div>
      {!compact && (
        <div className="mono absolute bottom-2 right-2 flex items-center gap-2 bg-black/60 px-1.5 py-1 text-[10px] text-white/85">
          Barn 01 · Cam 02 <span className="bg-[#7c5cff]/30 px-1 text-[#c9b8ff]">171 birds</span>
        </div>
      )}
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-white p-4 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)]", className)}>{children}</div>;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="mono bg-paper-2 px-1.5 py-1 text-[10px] normal-case text-ink/80">{children}</span>;
}

function Preview({ i }: { i: number }) {
  switch (i) {
    case 0:
      return (
        <Card>
          <div className="flex items-center justify-between text-[13px]">
            <span className="flex items-center gap-2 font-medium"><span className="size-2 bg-leaf" />Area A2 · Barn 01</span>
            <span className="mono text-ink/50">Illustrative</span>
          </div>
          <div className="mt-4 flex h-[70px] items-end gap-[3px]">
            {[40, 52, 48, 60, 58, 62, 64, 61, 66, 70, 68, 72, 71, 74, 73, 76, 75, 78, 77, 79].map((h, k) => (
              <motion.span
                key={k}
                className={cn("flex-1", k > 15 ? "bg-orange" : "bg-ink")}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: k * 0.02, duration: 0.4 }}
              />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-paper p-2.5">
              <p className="mono text-ink/50">Detected</p>
              <p className="text-[22px] font-medium tracking-[-0.04em]">196</p>
            </div>
            <div className="bg-ink p-2.5 text-white">
              <p className="mono text-white/50">Recorded</p>
              <p className="text-[22px] font-medium tracking-[-0.04em]">200</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5"><Chip>Counted 4 min ago</Chip><Chip>1 camera</Chip><Chip>Full coverage</Chip></div>
        </Card>
      );
    case 1:
      return (
        <div>
          <CameraFeed />
          <div className="mt-2 flex gap-1.5">
            {["A1", "A2", "A3", "A4"].map((a) => (
              <span key={a} className={cn("mono px-2 py-1 text-[10px]", a === "A2" ? "bg-orange text-ink" : "bg-white/10 text-white/70")}>{a}</span>
            ))}
          </div>
        </div>
      );
    case 2:
      return (
        <Card className="p-0">
          <div className="flex border-b border-ink/10 text-[12.5px]">
            {["Active", "Completed", "Archived"].map((t, k) => (
              <span key={t} className={cn("px-4 py-3", k === 0 ? "border-b-2 border-orange font-medium" : "text-slate")}>{t}</span>
            ))}
          </div>
          {[
            ["Batch 14", "Barn 01 · placed day 1", "800"],
            ["Batch 13", "Barn 02 · growing", "650"],
            ["Batch 12", "Barn 03 · arrivals", "720"],
          ].map(([n, d, c]) => (
            <div key={n} className="flex items-center justify-between border-b border-ink/8 px-4 py-3 last:border-0">
              <div>
                <p className="text-[14px] font-medium">{n}</p>
                <p className="text-[12px] text-slate">{d}</p>
              </div>
              <span className="mono text-ink/70">{c} birds</span>
            </div>
          ))}
        </Card>
      );
    case 3:
      return (
        <Card>
          <p className="mono text-ink/50">Batch 14 · Area A3</p>
          {[
            ["Deaths", "2", "Recorded by Worker"],
            ["Culls", "1", "Recorded by Manager"],
            ["Movement", "A1 → A2", "Permitted transfer"],
          ].map(([k, v, s]) => (
            <div key={k} className="mt-3 flex items-center justify-between border-t border-ink/8 pt-3">
              <div>
                <p className="text-[14px] font-medium">{k}</p>
                <p className="text-[12px] text-slate">{s}</p>
              </div>
              <span className="text-[18px] font-medium tracking-[-0.03em]">{v}</span>
            </div>
          ))}
          <p className="mt-3 bg-paper p-2 text-[12px] text-slate">Tied to the batch and area where it happened.</p>
        </Card>
      );
    case 4:
      return (
        <div className="space-y-2">
          <Card className="flex items-start gap-3">
            <Bell className="mt-0.5 size-4 text-sun-deep" />
            <div className="flex-1">
              <p className="text-[14px] font-medium">Incident · Area A3</p>
              <p className="text-[12.5px] text-slate">Count differs from the recorded flock. Review the camera view.</p>
            </div>
            <span className="mono text-ink/50">2m</span>
          </Card>
          <div className="w-[70%]"><CameraFeed compact /></div>
          <p className="mono text-white/50">Monitoring context, not a diagnosis.</p>
        </div>
      );
    default:
      return (
        <Card>
          <div className="flex items-center gap-2 text-[13px] font-medium"><MessageSquare className="size-4 text-sun-deep" />SMS invitation</div>
          <p className="mt-2 bg-paper p-3 text-[13px] text-slate">You’ve been invited to Barn 01 on Molt. Sign in with your mobile number.</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[12px]">
            {["Owner", "Manager", "Worker"].map((r) => (
              <span key={r} className={cn("py-2", r === "Worker" ? "bg-ink text-white" : "bg-paper-2")}>{r}</span>
            ))}
          </div>
        </Card>
      );
  }
}
