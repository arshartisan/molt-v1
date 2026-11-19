"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Cta, CubeIcon, FadeUp, RevealHeading } from "@/components/primitives";
import { WireBarn } from "@/components/iso";
import { cn } from "@/lib/utils";

const field =
  "h-auto rounded-none border-0 bg-transparent p-0 text-[19px] tracking-[-0.02em] text-ink shadow-none placeholder:text-ink/45 focus-visible:ring-0 md:text-[19px]";

export function Demo() {
  const [sent, setSent] = useState(false);

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
              <Cta href="#demo-form" tone="ink-on-orange">Discuss your farm setup</Cta>
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
            <p className="mono absolute right-0 top-[38%]">Areas A1 – A4</p>
            <p className="mono absolute bottom-2 left-0">In view from day one</p>
            <WireBarn className="h-full w-full" />
          </div>
        </div>

        <form
          id="demo-form"
          className="mt-10 grid gap-2 md:grid-cols-[1fr_1fr_1fr_1.05fr]"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <Field label="Name" className="">
            <Input name="name" placeholder="Your name" className={field} autoComplete="name" />
          </Field>
          <Field label="Mobile number">
            <Input name="phone" type="tel" placeholder="+94 7X XXX XXXX" className={field} autoComplete="tel" />
          </Field>
          <Field label="Farm">
            <Input name="farm" placeholder="Farm name" className={field} />
          </Field>
          <Button
            type="submit"
            className="row-span-2 h-auto min-h-[88px] rounded-none bg-ink text-[30px] font-medium tracking-[-0.04em] text-orange hover:bg-ink/90 md:col-start-4 md:row-start-1"
          >
            Send it
          </Button>
          <Field label="What should Molt keep in view?" className="md:col-span-3">
            <Textarea
              name="message"
              rows={1}
              placeholder="Four areas in Barn 01, with cameras we already have"
              className={cn(field, "min-h-0 resize-none")}
            />
          </Field>
        </form>

        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-ink p-4 text-white"
            >
              <p className="text-[15px]">
                <span className="font-medium text-orange">Demo booking is not available yet.</span>{" "}
                Molt’s demo booking is being set up. Once it’s available, you’ll be able to discuss your farm, team access
                and supported camera setup here.
              </p>
              <button onClick={() => setSent(false)} className="mono text-white/70 hover:text-white">
                Keep exploring
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-col gap-2 border border-ink/70 px-2.5 pb-3 pt-2.5", className)}>
      <span className="mono text-[10.5px]">{label}</span>
      {children}
    </label>
  );
}
