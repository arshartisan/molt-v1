"use client";

import { CalendarDays, Clock, Video } from "lucide-react";
import { Cta, CubeIcon, FadeUp, RevealHeading } from "@/components/primitives";
import { WireBarn } from "@/components/iso";
import { CalInline } from "@/components/cal-inline";

const COVER = [
  "Your farms, barns and areas",
  "Supported cameras and how counts work",
  "Team access for owners, managers and workers",
  "What a first batch looks like in Molt",
];

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

        {/* booking */}
        <div id="book" className="mt-12 grid scroll-mt-[90px] gap-6 border-t border-ink/25 pt-8 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <p className="mono">Book a demo</p>
            <h3 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.035em] md:text-[36px]">
              Talk through your farm setup with the FocalDive team.
            </h3>
            <ul className="mt-6 space-y-2.5 text-[15px]">
              <li className="flex items-center gap-2.5">
                <Clock className="size-4" /> 30 minutes
              </li>
              <li className="flex items-center gap-2.5">
                <Video className="size-4" /> Online video call
              </li>
              <li className="flex items-center gap-2.5">
                <CalendarDays className="size-4" /> Pick any open slot, in your time zone
              </li>
            </ul>
            <p className="mono mt-8">What we&apos;ll cover</p>
            <ul className="mt-3 border-t border-ink/25">
              {COVER.map((c) => (
                <li key={c} className="border-b border-ink/25 py-2.5 text-[15px]">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow-[0_30px_70px_-35px_rgba(11,12,15,.45)]">
            <CalInline calLink="focaldive/30min" namespace="30min" className="min-h-[560px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
