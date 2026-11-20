"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Phone, PHONE_H, PHONE_W } from "@/components/phone";
import { APP_CALLOUTS } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Dark "take it apart" section: sticky phone, callouts revealed by scroll. */
export function Explore() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [shown, setShown] = useState(0);
  const [finale, setFinale] = useState(false);
  const [onHome, setOnHome] = useState(true);

  /* Size the phone to the screen. When the intro leaves room beside it, the phone
     uses the full height under the header; otherwise it fits under the intro. */
  const pin = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0.86);
  const [lift, setLift] = useState(0);
  const [mobileFit, setMobileFit] = useState(1);
  useEffect(() => {
    const el = stage.current;
    const box = pin.current;
    if (!el || !box) return;
    const measure = () => {
      const W = box.clientWidth;
      setMobileFit(Math.min(1.12, (W - 32) / PHONE_W));
      if (!el.clientHeight) return; // phones use the stacked layout
      const MAX = 1.12;
      const drift = 40 + 24; // the phone's scroll drift + bottom gap
      // full-height option: phone top just under the header
      const top = 68 + 16;
      const tall = Math.min(MAX, (box.clientHeight - top - drift) / PHONE_H);
      const textRight = Math.max(
        0,
        ...Array.from(intro.current?.children ?? []).map((c) => {
          const r = document.createRange();
          r.selectNodeContents(c);
          return r.getBoundingClientRect().right - box.getBoundingClientRect().left;
        }),
      );
      if (W / 2 - (PHONE_W * tall) / 2 > textRight + 40) {
        setFit(tall);
        setLift(top - el.offsetTop);
      } else {
        setFit(Math.max(0.5, Math.min(MAX, (el.clientHeight - drift) / PHONE_H)));
        setLift(0);
      }
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setShown(Math.min(APP_CALLOUTS.length, Math.floor(p * 10)));
    setFinale(p > 0.8);
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const phoneRotate = useTransform(scrollYProgress, [0, 0.75, 1], [-8, 0, 0]);
  /* With the phone lifted beside the intro, the left callouts share its space:
     clear the intro before the first callout draws in (callout 01 shows at 0.1). */
  const introOpacity = useTransform(scrollYProgress, [0.03, 0.08], [1, 0]);
  const introY = useTransform(scrollYProgress, [0.03, 0.08], [0, -24]);

  return (
    <section ref={ref} id="app" data-section="2" data-theme="dark" className="relative bg-ink text-white md:h-[330vh]">
      <div ref={pin} className="top-0 flex flex-col overflow-hidden pt-[84px] md:sticky md:h-screen md:pt-[96px] [@media(min-width:768px)_and_(max-height:820px)]:pt-[80px]">
        <motion.div
          ref={intro}
          className="wrap relative z-10"
          style={lift ? { opacity: introOpacity, y: introY } : undefined}
        >
          <p className="mono text-white/70">02 / The big picture. In your pocket.</p>
          <h2 className="display-lg mt-3 [@media(min-width:768px)_and_(max-height:820px)]:text-[clamp(2.6rem,5vw,4.2rem)]">Explore the app.</h2>
          <p className="lede mt-3 max-w-[36ch] text-white/60 [@media(min-width:768px)_and_(max-height:820px)]:mt-2 [@media(min-width:768px)_and_(max-height:820px)]:text-[16px]">
            Built around your farms, barns and areas. Every part of it, laid out in one place.
          </p>
        </motion.div>

        {/* desktop: phone + callouts */}
        <div ref={stage} className="relative hidden flex-1 md:block">
          <motion.div
            className="absolute left-1/2"
            style={{ top: 12 + lift, x: "-50%", y: phoneY, rotate: phoneRotate, scale: fit, originY: 0 }}
          >
            <div className="relative">
              <Phone onNavigate={setOnHome} />
              {APP_CALLOUTS.map((c, i) => (
                <Callout key={c.n} c={c} visible={i < shown && !finale && onHome} />
              ))}
            </div>
          </motion.div>

          <motion.p
            className="display-lg pointer-events-none absolute bottom-[8%] left-0 right-0 z-10"
            initial={false}
            animate={{ opacity: finale ? 1 : 0, y: finale ? 0 : 30 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="wrap block">
              Less switching.
              <br />
              More seeing.
            </span>
          </motion.p>
        </div>

        {/* mobile: stacked */}
        <div className="wrap pb-20 pt-10 md:hidden">
          {/* phone scaled to the screen width; the outer box reserves the scaled height */}
          <div className="flex justify-center" style={{ height: PHONE_H * mobileFit }}>
            <div style={{ transform: `scale(${mobileFit})`, transformOrigin: "top center" }}>
              <Phone />
            </div>
          </div>
          <ol className="mt-8 divide-y divide-white/12 border-y border-white/12">
            {APP_CALLOUTS.map((c) => (
              <li key={c.n} className="py-4">
                <span className="mono text-orange">{c.n}</span>
                <h3 className="mt-1 text-[22px] font-medium tracking-[-0.03em]">{c.title}</h3>
                <p className="text-[14.5px] text-white/60">{c.body}</p>
              </li>
            ))}
          </ol>
          <p className="display-md mt-10">
            Less switching.
            <br />
            More seeing.
          </p>
        </div>
      </div>
    </section>
  );
}

function Callout({ c, visible }: { c: (typeof APP_CALLOUTS)[number]; visible: boolean }) {
  const [dx, dy] = c.dot;
  const left = c.side === "left";
  // line runs horizontally from the dot to beyond the phone edge (+ 200px)
  const reach = 330;
  const lineW = left ? dx + reach : PHONE_W - dx + reach;
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ top: dy, left: left ? dx - lineW : dx, width: lineW }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45 }}
    >
      <span
        className={cn("absolute top-[-4px] size-[9px] bg-orange", left ? "right-[-4px]" : "left-[-4px]")}
        style={{ boxShadow: "0 0 0 3px rgba(255,214,10,.25)" }}
      />
      <motion.span
        className={cn("absolute top-0 h-px bg-white/35", left ? "right-0" : "left-0")}
        initial={false}
        animate={{ width: visible ? "100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className={cn("absolute top-2.5 w-[260px]", left ? "left-0" : "right-0 text-left")}>
        <span className="mono text-orange">{c.n}</span>
        <h3 className="mt-0.5 text-[20px] font-medium leading-[1.1] tracking-[-0.03em]">{c.title}</h3>
        <p className="mt-0.5 whitespace-nowrap text-[13px] leading-[1.35] text-white/60">{c.body}</p>
      </div>
    </motion.div>
  );
}
