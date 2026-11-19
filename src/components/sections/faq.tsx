"use client";

import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { ColumnGuides, Cta, CubeIcon, RevealHeading, SectionHead } from "@/components/primitives";
import { FAQ } from "@/lib/content";

export function Faq() {
  return (
    <section id="faq" data-section="10" data-theme="light" className="relative bg-paper">
      <div className="wrap relative pb-24 md:pb-32">
        <SectionHead num="10" title="Good questions" aside={`${FAQ.length} answers`} />
        <div className="grid gap-12 pt-14 md:pt-20 lg:grid-cols-2 lg:gap-6">
          <div className="relative">
            <ColumnGuides className="[&>span:nth-child(n+2)]:hidden" />
            <RevealHeading className="display-lg relative" lines={[{ text: "A little more" }, { text: "clarity.", muted: true }]} />
            <p className="lede mt-5 max-w-[34ch] text-slate">
              A few things you might be wondering before bringing your farm into view.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="grid size-[42px] place-items-center bg-white">
                <CubeIcon glyph="phone" size={30} />
              </span>
              <span className="text-[14px] leading-[1.25]">
                <span className="block font-medium">Let’s talk about your farm</span>
                <span className="text-slate">Demo booking opens soon</span>
              </span>
            </div>
            <Cta href="#demo" className="mt-8">Request a demo</Cta>
          </div>

          <Accordion className="border-t border-ink/12">
            {FAQ.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-ink/12">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group flex flex-1 items-center justify-between gap-6 py-4 text-left text-[20px] tracking-[-0.03em] outline-none focus-visible:text-sun-deep md:text-[22px]">
                    {f.q}
                    <Plus
                      className="size-5 shrink-0 transition-transform duration-300 group-aria-expanded:rotate-45"
                      strokeWidth={1.6}
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="max-w-[60ch] pb-5 text-[15.5px] leading-[1.45] text-slate">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
