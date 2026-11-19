"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Cta, CubeIcon, FadeUp, RevealHeading } from "@/components/primitives";
import { HERO_TABS } from "@/lib/content";
import { cn } from "@/lib/utils";

const TAB_MS = 4200;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - (1 - t) ** 3;
/** Area A2 count, matching the app mock elsewhere on the page. */
const A2_COUNT = 196;

/* Scroll timeline (0–1 across the pinned hero) */
const VIDEO = [0.06, 0.86] as const; // film plays start → end over this range

/**
 * Hero (desktop): the film is the full-screen background, scrubbed by scroll - orbit, roof opens at A2, dive inside, detections.
 * Phones get the same film as a short muted loop under the headline.
 */
export function Hero() {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setTab((v) => (v + 1) % HERO_TABS.length), TAB_MS);
    return () => clearTimeout(t);
  }, [tab]);

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
    const video = useRef<HTMLVideoElement>(null);
  const { scrollYProgress: p } = useScroll({ target: section, offset: ["start start", "end end"] });

  const textOpacity = useTransform(p, [0.02, 0.1], [1, 0]);
  const textY = useTransform(p, [0.02, 0.1], [0, -70]);
  const hintOpacity = useTransform(p, [0, 0.03], [1, 0]);
  const hud = useTransform(p, [0.6, 0.66], [0, 1]);
  const panel = useTransform(p, [0.7, 0.76], [0, 1]);
  const panelX = useTransform(p, [0.7, 0.76], [24, 0]);
  const caption = useTransform(p, [0.88, 0.95], [0, 1]);
  const captionY = useTransform(p, [0.88, 0.95], [30, 0]);
  // start with the farm nudged right of the headline, then centre it
  const filmX = useTransform(p, [0.02, 0.24], ["17%", "0%"]);
  const wash = useTransform(p, [0.02, 0.2], [1, 0]);

  const [count, setCount] = useState(0);
  const [inside, setInside] = useState(false);
  const [ready, setReady] = useState(false);
  // Scroll-driven fades only run on desktop, where the hero is pinned. On phones the
  // hero can fit the screen, which would put scroll progress at 1 and hide the copy.
  const [desk, setDesk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesk(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  /* Desktop: load the film as a blob so every frame is seekable, then chase the scroll. */
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    let url: string | null = null;
    let cancelled = false;
    fetch("/video/hero-dive.mp4")
      .then((r) => r.blob())
      .then((b) => {
        if (cancelled || !video.current) return;
        url = URL.createObjectURL(b);
        video.current.src = url;
      })
      .catch(() => {
        if (video.current) video.current.src = "/video/hero-dive.mp4";
      });

    let raf = 0;
    let shown = 0;
    const tick = () => {
      const v = video.current;
      if (v && v.readyState >= 2 && v.duration) {
        const target = clamp((p.get() - VIDEO[0]) / (VIDEO[1] - VIDEO[0])) * (v.duration - 0.05);
        shown += (target - shown) * 0.22;
        if (Math.abs(target - shown) < 0.002) shown = target;
        if (Math.abs(v.currentTime - shown) > 0.008 && !v.seeking) v.currentTime = shown;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
      cancelAnimationFrame(raf);
    };
  }, [p]);

  useMotionValueEvent(p, "change", (v) => {
    const c = Math.round(ease(clamp((v - 0.72) / 0.14)) * A2_COUNT);
    setCount((prev) => (prev === c ? prev : c));
    setInside(v > 0.5);
  });

  return (
    <section ref={section} id="top" data-section="1" data-theme="light" className="relative bg-paper lg:h-[420vh]">
      <div
        ref={stage}
        className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[60px] md:pt-[68px] lg:sticky lg:top-0 lg:h-screen"
      >
        {/* ---------------- film (desktop) ---------------- */}
        <div
          data-theme={inside ? "dark" : undefined}
          className="absolute inset-0 z-0 hidden overflow-hidden bg-[#c7cfd1] lg:block"
        >
          <motion.div className="absolute inset-0" style={{ x: filmX }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/video/hero-first.webp"
            alt=""
            className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", ready && "opacity-0")}
          />
          <video
            ref={video}
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setReady(true)}
            aria-label="Film: the farm turns, the roof of Barn 01 opens at area A2 and the camera view inside detects each bird"
            className="absolute inset-0 h-full w-full object-cover"
          />
          </motion.div>

          {/* headline wash: keeps the copy legible over the opening frame */}
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#f1f2f5_0%,#f1f2f5_24%,rgba(241,242,245,.82)_40%,rgba(241,242,245,0)_62%)]"
            style={{ opacity: wash }}
          />

          {/* HUD */}
          <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: hud }}>
            {[
              "left-6 top-[84px] border-l-2 border-t-2",
              "right-6 top-[84px] border-r-2 border-t-2",
              "bottom-6 left-6 border-b-2 border-l-2",
              "bottom-6 right-6 border-b-2 border-r-2",
            ].map((c) => (
              <span key={c} className={cn("absolute size-8 border-white/80", c)} />
            ))}
            <div className="mono absolute left-10 top-[96px] flex items-center gap-2 bg-black/55 px-2 py-1 text-white">
              <span className="size-2 animate-blink rounded-full bg-[#ef4444]" /> Live · Barn 01 · Cam 02 · Area A2
            </div>
            <div className="mono absolute bottom-10 right-10 bg-black/55 px-2 py-1 text-white/85">1920×1080 · 24 fps</div>
          </motion.div>

          {/* count panel */}
          <motion.div
            className="pointer-events-none absolute right-10 top-[96px] w-[290px] bg-black/70 p-5 text-white backdrop-blur-sm"
            style={{ opacity: panel, x: panelX }}
          >
            <p className="mono text-white/60">Camera count · A2</p>
            <p className="mt-2 text-[64px] font-medium leading-none tracking-[-0.05em] tabular-nums">{count}</p>
            <p className="mt-1 text-[14px] text-white/70">birds counted in area A2</p>
            <div className="mt-4 h-[3px] bg-white/15">
              <div className="h-full bg-[#FFD60A] transition-[width] duration-200" style={{ width: `${(count / A2_COUNT) * 100}%` }} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-y-2 text-[13px]">
              <dt className="text-white/50">Recorded flock</dt>
              <dd className="text-right tabular-nums">200</dd>
              <dt className="text-white/50">Difference</dt>
              <dd className="text-right tabular-nums">{count === A2_COUNT ? "4 birds" : "Counting"}</dd>
              <dt className="text-white/50">Status</dt>
              <dd className="text-right text-[#4ade80]">{count === A2_COUNT ? "Count saved" : "Counting"}</dd>
            </dl>
          </motion.div>

          {/* closing caption */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/45 to-transparent"
            style={{ opacity: caption }}
          />
          <motion.div className="pointer-events-none absolute bottom-16 left-0 right-0" style={{ opacity: caption, y: captionY }}>
            <div className="wrap">
              <p className="display-lg max-w-[13ch] text-white [text-shadow:0_2px_30px_rgba(0,0,0,.6)]">
                Every bird, counted from the camera.
              </p>
            </div>
          </motion.div>
        </div>


        <motion.div className="wrap relative z-10 flex-1 pt-10 md:pt-12" style={desk ? { opacity: textOpacity, y: textY } : undefined}>
          <RevealHeading
            as="h1"
            className="display-xl max-w-[9.5ch]"
            lines={[{ text: "Keep your" }, { text: "flock in" }, { text: "view." }]}
          />
          <FadeUp delay={0.45}>
            <p className="lede mt-6 max-w-[34ch] text-slate">
              Your counts, cameras and flock records. One clear view of your poultry farm.
            </p>
          </FadeUp>
          <FadeUp delay={0.6} className="mt-8 flex flex-wrap items-center gap-6">
            <Cta href="#demo">Request a demo</Cta>
            <div className="flex items-center gap-3">
              <span className="grid size-[42px] place-items-center bg-white">
                <CubeIcon glyph="barn" size={30} />
              </span>
              <span className="text-[14px] leading-[1.25] tracking-[-0.01em]">
                <span className="block font-medium">A new perspective</span>
                <span className="text-slate">on poultry farming</span>
              </span>
            </div>
          </FadeUp>

          {/* phones: the film as a muted loop */}
          <div className="relative -mx-4 mt-10 aspect-video overflow-hidden sm:-mx-6 lg:hidden">
            <video
              src="/video/hero-dive-720.mp4"
              poster="/video/hero-first.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Film: the farm, the roof opening at area A2 and the camera view inside"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        {/* bottom tab strip */}
        <motion.div className="relative z-10" style={desk ? { opacity: textOpacity } : undefined}>
          <div className="wrap flex flex-col gap-3 pb-5 md:flex-row md:items-end md:justify-between">
            <div className="flex gap-5 overflow-x-auto md:gap-7" role="tablist" aria-label="What Molt brings into view">
              {HERO_TABS.map((t, i) => (
                <button
                  key={t.label}
                  role="tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
                  className={cn("relative shrink-0 pt-3 text-[14.5px] tracking-[-0.01em] transition-colors", tab === i ? "text-ink" : "text-slate hover:text-ink")}
                >
                  <span className="absolute inset-x-0 top-0 h-[2px] bg-ink/10" />
                  {tab === i && (
                    <motion.span
                      key={`bar-${tab}`}
                      className="absolute left-0 top-0 h-[2px] bg-orange"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: TAB_MS / 1000, ease: "linear" }}
                    />
                  )}
                  {t.label}
                </button>
              ))}
            </div>
            <div className="mono flex min-h-[18px] items-center gap-3 text-ink/70">
              <span className="size-[7px] shrink-0 bg-ink/40" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3 normal-case"
                >
                  <span className="uppercase">{HERO_TABS[tab].tag}</span>
                  <span className="font-sans text-[13.5px] tracking-[-0.005em] text-ink">{HERO_TABS[tab].line}</span>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mono pointer-events-none absolute bottom-[86px] right-10 z-30 hidden items-center gap-2 text-ink/60 lg:flex"
          style={{ opacity: hintOpacity }}
        >
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            ↓
          </motion.span>
          Scroll to look inside Barn 01
        </motion.p>
      </div>
    </section>
  );
}
