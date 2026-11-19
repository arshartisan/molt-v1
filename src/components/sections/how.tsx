"use client";

import { motion } from "motion/react";
import { ColumnGuides, FadeUp, RevealHeading, SectionHead } from "@/components/primitives";
import { STEPS } from "@/lib/content";

/** Bars use at most this share of the chart, leaving headroom for the step label. */
const SCALE = 0.74;

export function How() {
  return (
    <section id="how" data-section="7" data-theme="dark" className="relative bg-ink text-white">
      <div className="wrap relative pb-24 md:pb-32">
        <SectionHead num="07" title="A clearer way to work" aside="Step 01 to step 03" dark />
        <div className="relative flex flex-col gap-6 pb-12 pt-14 md:flex-row md:items-end md:justify-between md:pt-20">
          <ColumnGuides dark />
          <RevealHeading
            dark
            className="display-lg relative max-w-[20ch]"
            lines={[{ text: "Your farm." }, { text: "Connected, step by step.", muted: true }]}
          />
          <p className="mono relative text-white/60 md:text-right">Set up together. Keep the daily view simple.</p>
        </div>

        {/* stepped chart */}
        <div className="relative hidden h-[400px] overflow-hidden border border-white/12 md:grid md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative border-r border-white/12 last:border-r-0">
              <motion.div
                className="hatch absolute inset-x-0 bottom-0 border-t-2 border-orange"
                initial={{ height: "0%" }}
                whileInView={{ height: `${s.height * SCALE}%` }}
                viewport={{ once: true, margin: "-20% 0px" }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {i > 0 && (
                  <span
                    className="absolute left-0 w-[2px] bg-orange"
                    style={{ bottom: "100%", height: `${((s.height - STEPS[i - 1].height) / s.height) * 100}%`, transform: "translateY(0)" }}
                  />
                )}
                <motion.span
                  className="absolute bottom-full left-3 mb-2 text-[36px] font-medium tracking-[-0.045em] lg:text-[44px]"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + i * 0.45 }}
                >
                  {s.level}
                </motion.span>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.12}>
              <p className="mono text-white/60">{s.when}</p>
              <h3 className="mt-2 text-[28px] font-medium tracking-[-0.035em] md:text-[34px]">{s.title}</h3>
              <p className="mt-2 max-w-[38ch] text-[15px] leading-[1.4] text-white/65">{s.body}</p>
              <p className="mono mt-3 text-orange">{s.tag}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
