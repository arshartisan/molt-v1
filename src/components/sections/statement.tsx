"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ColumnGuides, CubeIcon, FadeUp } from "@/components/primitives";
import { FEATURES, STATS } from "@/lib/content";

const LEAD = "A camera observation and a flock record answer different questions.";
const REST = "Molt brings both into view so you can understand changes without losing track of your flock.";

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = [...LEAD.split(" ").map((w) => ({ w, lead: true })), ...REST.split(" ").map((w) => ({ w, lead: false }))];

  return (
    <section id="features" data-section="3" data-theme="light" className="relative bg-paper">
      {/* marquee */}
      <div className="overflow-hidden border-b border-ink/10 bg-paper py-4">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {[...FEATURES, ...FEATURES].map((f, i) => (
                <span key={i} className="flex items-center text-[22px] tracking-[-0.03em] text-ink/80 md:text-[26px]">
                  <span className="px-9">{f}</span>
                  <span className="size-[7px] bg-orange" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="wrap relative py-24 md:py-36">
        <ColumnGuides />
        <p ref={ref} className="display-md relative max-w-[22ch] md:max-w-[24ch]">
          {words.map((item, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} lead={item.lead}>
              {item.w}
            </Word>
          ))}
        </p>
      </div>

      <div className="wrap pb-24 md:pb-32">
        <div className="grid grid-cols-2 border-t border-ink/12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <FadeUp
              key={s.n}
              delay={i * 0.08}
              className="flex min-h-[150px] flex-col justify-between border-b border-ink/12 py-4 pr-4 md:min-h-[240px] lg:border-b-0 lg:border-r lg:px-4 lg:first:pl-0 lg:last:border-r-0"
            >
              <div className="flex items-start justify-between">
                <span className="mono text-ink/50">{s.n}</span>
                {i === 3 ? (
                  <span className="mt-1 flex h-[14px] items-stretch gap-[2px]">
                    {Array.from({ length: 28 }).map((_, k) => (
                      <span key={k} className="bg-ink" style={{ width: k % 3 === 0 ? 2 : 1 }} />
                    ))}
                  </span>
                ) : (
                  <CubeIcon glyph={s.glyph} size={34} />
                )}
              </div>
              <div>
                <div className="text-[32px] font-medium leading-none tracking-[-0.05em] sm:text-[44px] md:text-[64px]">{s.value}</div>
                <div className="mt-2 text-[13px] text-slate md:text-[14px]">{s.label}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  lead,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  lead: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={lead ? "text-ink" : "text-fog"}>
        {children}
      </motion.span>{" "}
    </>
  );
}
