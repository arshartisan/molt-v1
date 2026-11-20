"use client";

import { Cta, CubeIcon, FadeUp, RevealHeading } from "@/components/primitives";
import { WireBarn } from "@/components/iso";

export function Demo() {
  return (
    <section id="demo" data-section="11" data-theme="orange" className="relative overflow-hidden bg-orange text-ink">
      <div className="wrap relative pb-16 pt-[96px] md:pt-[110px]">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <p className="mono">11 / Your next chapter starts with a clearer view</p>
            <RevealHeading
              as="h2"
              className="display-xl mt-4 !text-[clamp(3rem,6.6vw,6rem)]"
              lines={[{ text: "Bring your farm" }, { text: "into view" }, { text: "with Molt." }]}
            />
            <FadeUp delay={0.3} className="mt-8 flex flex-wrap items-center gap-6">
              <Cta href="#book" tone="ink-on-orange">
                Book a 30-minute demo
              </Cta>
              <div className="flex items-center gap-3">
                <span className="grid size-[42px] place-items-center bg-ink/10">
                  <CubeIcon glyph="barn" size={30} orange={false} />
                </span>
                <span className="text-[14px] leading-[1.25]">
                  <span className="block font-medium">Camera monitoring</span>
                  <span>and flock records, together</span>
                </span>
              </div>
            </FadeUp>
          </div>
          <div className="relative min-h-[320px]">
            <p className="mono absolute left-0 top-2">Barn 01, general arrangement</p>
            <p className="mono absolute right-0 top-[38%]">Areas A1 - A4</p>
            <p className="mono absolute bottom-2 left-0">In view from day one</p>
            <WireBarn className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
