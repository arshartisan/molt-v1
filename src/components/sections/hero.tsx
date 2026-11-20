"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { Cta, CubeIcon, FadeUp, RevealHeading } from "@/components/primitives";
import { HERO_TABS } from "@/lib/content";
import { cn } from "@/lib/utils";

const TAB_MS = 4200;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
/** Farm bounds in the film's first frame (1920×1080 source pixels). */
const FARM = { w: 1500, h: 740, cx: 960, cy: 420 };
const ease = (t: number) => 1 - (1 - t) ** 3;
/** Area A2 count, matching the app mock elsewhere on the page. */
const A2_COUNT = 196;

/* Scroll timeline (0–1 across the pinned hero) */
const VIDEO = [0.06, 0.86] as const; // film plays start → end over this range

/**
 * Hero: the film is the full-screen background, scrubbed by scroll - orbit, roof opens at A2, dive inside, detections.
 * Same experience on every screen; phones open with the farm framed under the headline instead of beside it.
 */
export function Hero() {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    const t = setTimeout(
      () => setTab((v) => (v + 1) % HERO_TABS.length),
      TAB_MS,
    );
    return () => clearTimeout(t);
  }, [tab]);

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const headline = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const washEl = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  const textOpacity = useTransform(p, [0.02, 0.1], [1, 0]);
  const textY = useTransform(p, [0.02, 0.1], [0, -70]);
  const hintOpacity = useTransform(p, [0, 0.03], [1, 0]);
  const hud = useTransform(p, [0.6, 0.66], [0, 1]);
  const panel = useTransform(p, [0.7, 0.76], [0, 1]);
  const panelX = useTransform(p, [0.7, 0.76], [24, 0]);
  const caption = useTransform(p, [0.88, 0.95], [0, 1]);
  const captionY = useTransform(p, [0.88, 0.95], [30, 0]);
  const wash = useTransform(p, [0.02, 0.2], [1, 0]);

  /* Opening framing: fit the whole farm in the free space right of the headline,
     for any screen size, then ease to the full-bleed film as the visitor scrolls. */
  const filmScale = useMotionValue(1);
  const filmX = useMotionValue(0);
  const filmY = useMotionValue(0);
  const fit = useRef({ s: 1, x: 0, y: 0 });
  const measure = () => {
    const st = stage.current;
    if (!st) return;
    const W = st.clientWidth;
    const H = st.clientHeight;
    const k = Math.max(W / 1920, H / 1080); // object-cover factor
    // Size the film box to the full 16:9 frame (cover, centred) so no part of the
    // farm is cropped by the box itself when it is scaled down on tall screens.
    if (box.current) {
      const bw = 1920 * k;
      const bh = 1080 * k;
      Object.assign(box.current.style, {
        width: `${bw}px`,
        height: `${bh}px`,
        left: `${(W - bw) / 2}px`,
        top: `${(H - bh) / 2}px`,
      });
    }
    let left: number, right: number, top: number, bottom: number;
    if (W >= 1024) {
      const pad = Math.max(40, (W - 1440) / 2 + 40); // matches .wrap
      const textRight = headline.current
        ? headline.current.getBoundingClientRect().right -
          st.getBoundingClientRect().left
        : W * 0.4;
      left = Math.min(textRight + 32, W * 0.5);
      right = W - pad * 0.5;
      top = 68 + 24;
      bottom = H - 96;
      if (washEl.current) {
        washEl.current.style.background = `linear-gradient(90deg, #f1f2f5 0px, #f1f2f5 ${Math.max(0, textRight - 80)}px, rgba(241,242,245,.8) ${textRight}px, rgba(241,242,245,.5) ${left + 60}px, rgba(241,242,245,.28) ${left + (right - left) * 0.45}px, rgba(241,242,245,.18) ${right}px)`;
      }
    } else {
      // phones and tablets: the farm sits in the band between the copy and the tab strip
      // layout offsets, so the copy's scroll fade and reveal transforms don't skew the read
      const topIn = (el: HTMLElement | null) => {
        let y = 0;
        for (let n = el; n && n !== st; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
        return y;
      };
      const copyBottom = copy.current ? topIn(copy.current) + copy.current.offsetHeight : H * 0.55;
      const stripTop = strip.current ? topIn(strip.current) : H - 90;
      left = 12;
      right = W - 12;
      top = copyBottom + 12;
      bottom = Math.max(top + 80, stripTop - 8);
      if (washEl.current) {
        washEl.current.style.background = `linear-gradient(180deg, #f1f2f5 0px, #f1f2f5 ${Math.max(0, copyBottom - 24)}px, rgba(241,242,245,.4) ${copyBottom + 36}px, rgba(241,242,245,.15) ${(copyBottom + stripTop) / 2}px, rgba(241,242,245,.4) ${stripTop - 30}px, #f1f2f5 ${stripTop + 12}px)`;
      }
    }
    const s = Math.min(
      1,
      (right - left) / (k * FARM.w),
      (bottom - top) / (k * FARM.h),
    );
    fit.current = {
      s,
      x: (left + right) / 2 - W / 2 - s * k * (FARM.cx - 960),
      y: (top + bottom) / 2 - H / 2 - s * k * (FARM.cy - 540),
    };
  };
  const place = (v: number) => {
    const t = ease(clamp((v - 0.02) / 0.24));
    const f = fit.current;
    filmScale.set(f.s + (1 - f.s) * t);
    filmX.set(f.x * (1 - t));
    filmY.set(f.y * (1 - t));
  };
  useEffect(() => {
    const run = () => {
      measure();
      place(p.get());
    };
    run();
    const t = setTimeout(run, 1200); // after the headline reveal settles
    window.addEventListener("resize", run);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", run);
    };
    // measure/place only read refs and motion values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p]);

  const [count, setCount] = useState(0);
  const [inside, setInside] = useState(false);
  const [ready, setReady] = useState(false);

  /* Load the film as a blob so every frame is seekable, then chase the scroll.
     Phones and tablets get the lighter 720p cut. */
  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    const size = window.matchMedia("(min-width: 1024px)").matches ? "" : "-720";
    // WebM (VP9) where supported; H.264 MP4 for Safari, which seeks WebM poorly
    const safari = /^((?!chrome|chromium|android|crios|fxios).)*safari/i.test(navigator.userAgent);
    const webm = !safari && document.createElement("video").canPlayType('video/webm; codecs="vp9"');
    const film = `/video/hero-dive${size}.${webm ? "webm" : "mp4"}`;
    fetch(film)
      .then((r) => r.blob())
      .then((b) => {
        if (cancelled || !video.current) return;
        url = URL.createObjectURL(b);
        video.current.src = url;
      })
      .catch(() => {
        if (video.current) video.current.src = film;
      });

    let raf = 0;
    let shown = 0;
    const tick = () => {
      const v = video.current;
      if (v && v.readyState >= 2 && v.duration) {
        const target =
          clamp((p.get() - VIDEO[0]) / (VIDEO[1] - VIDEO[0])) *
          (v.duration - 0.05);
        shown += (target - shown) * 0.22;
        if (Math.abs(target - shown) < 0.002) shown = target;
        if (Math.abs(v.currentTime - shown) > 0.008 && !v.seeking)
          v.currentTime = shown;
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
    place(v);
    const c = Math.round(ease(clamp((v - 0.72) / 0.14)) * A2_COUNT);
    setCount((prev) => (prev === c ? prev : c));
    setInside(v > 0.5);
  });

  return (
    <section
      ref={section}
      id="top"
      data-section="1"
      data-theme="light"
      className="relative h-[360vh] bg-paper lg:h-[420vh]"
    >
      <div
        ref={stage}
        className="sticky top-0 flex h-dvh flex-col overflow-hidden pt-[60px] md:pt-[68px] lg:h-screen"
      >
        {/* ---------------- film ---------------- */}
        <div
          data-theme={inside ? "dark" : undefined}
          className="absolute inset-0 z-0 overflow-hidden bg-[#c7cfd1]"
        >
          <motion.div
            ref={box}
            className="absolute inset-0"
            style={{ x: filmX, y: filmY, scale: filmScale }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/video/hero-first.webp"
              alt=""
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                ready && "opacity-0",
              )}
            />
            <video
              ref={video}
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setReady(true)}
              onLoadedMetadata={(e) => {
                // iOS only decodes frames after a play; prime it so scroll seeking shows frames
                const v = e.currentTarget;
                if (v.readyState < 2) v.play().then(() => v.pause()).catch(() => {});
              }}
              aria-label="Film: the farm turns, the roof of Barn 01 opens at area A2 and the camera view inside detects each bird"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* feather the film's edges into the backdrop while it is framed */}
            <motion.div
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_70px_#c7cfd1]"
              style={{ opacity: wash }}
            />
          </motion.div>

          {/* headline wash: keeps the copy legible over the opening frame */}
          <motion.div
            ref={washEl}
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#f1f2f5_0%,#f1f2f5_24%,rgba(241,242,245,.82)_40%,rgba(241,242,245,0)_62%)]"
            style={{ opacity: wash }}
          />

          {/* HUD */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ opacity: hud }}
          >
            <div className="wrap h-full">
              <div className="relative h-full">
                {[
                  "-left-4 top-[84px] border-l-2 border-t-2",
                  "-right-4 top-[84px] border-r-2 border-t-2",
                  "bottom-6 -left-4 border-b-2 border-l-2",
                  "bottom-6 -right-4 border-b-2 border-r-2",
                ].map((c) => (
                  <span
                    key={c}
                    className={cn("absolute size-8 border-white/80", c)}
                  />
                ))}
                <div className="mono absolute left-0 top-[96px] flex items-center gap-2 bg-black/55 px-2 py-1 text-white">
                  <span className="size-2 animate-blink rounded-full bg-[#ef4444]" />{" "}
                  Live · Barn 01 · Cam 02 · Area A2
                </div>
                <div className="mono absolute bottom-10 right-0 bg-black/55 px-2 py-1 text-white/85">
                  1920×1080 · 24 fps
                </div>
              </div>
            </div>
          </motion.div>

          {/* count panel */}
          <div className="pointer-events-none absolute inset-0">
            <div className="wrap h-full">
              <div className="relative h-full">
                <motion.div
                  className="absolute inset-x-0 top-[132px] bg-black/70 p-4 text-white backdrop-blur-sm lg:left-auto lg:right-0 lg:top-[96px] lg:w-[290px] lg:p-5"
                  style={{ opacity: panel, x: panelX }}
                >
                  <p className="mono text-white/60">Camera count · A2</p>
                  <p className="mt-2 text-[44px] font-medium leading-none tracking-[-0.05em] tabular-nums lg:text-[64px]">
                    {count}
                  </p>
                  <p className="mt-1 text-[14px] text-white/70">
                    birds counted in area A2
                  </p>
                  <div className="mt-3 h-[3px] bg-white/15 lg:mt-4">
                    <div
                      className="h-full bg-[#FFD60A] transition-[width] duration-200"
                      style={{ width: `${(count / A2_COUNT) * 100}%` }}
                    />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-[13px] lg:mt-4 lg:gap-y-2">
                    <dt className="text-white/50">Recorded flock</dt>
                    <dd className="text-right tabular-nums">200</dd>
                    <dt className="text-white/50">Difference</dt>
                    <dd className="text-right tabular-nums">
                      {count === A2_COUNT ? "4 birds" : "Counting"}
                    </dd>
                    <dt className="text-white/50">Status</dt>
                    <dd className="text-right text-[#4ade80]">
                      {count === A2_COUNT ? "Count saved" : "Counting"}
                    </dd>
                  </dl>
                </motion.div>
              </div>
            </div>
          </div>

          {/* closing caption */}
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/45 to-transparent"
            style={{ opacity: caption }}
          />
          <motion.div
            className="pointer-events-none absolute bottom-10 left-0 right-0 lg:bottom-16"
            style={{ opacity: caption, y: captionY }}
          >
            <div className="wrap">
              <p className="display-lg max-w-[13ch] text-white [text-shadow:0_2px_30px_rgba(0,0,0,.6)]">
                Every bird, counted from the camera.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="wrap relative z-10 flex-1 pt-10 md:pt-12"
          style={{ opacity: textOpacity, y: textY }}
        >
          <div ref={copy}>
            <div ref={headline} className="w-fit">
              <RevealHeading
                as="h1"
                className="display-xl max-w-[9.5ch] lg:!text-[clamp(4.25rem,6.4vw,7.25rem)]"
                lines={[
                  { text: "Keep your" },
                  { text: "flock in" },
                  { text: "view." },
                ]}
              />
            </div>
            <FadeUp delay={0.45}>
              <p className="lede mt-6 max-w-[34ch] text-slate">
                Your counts, cameras and flock records. One clear view of your
                poultry farm.
              </p>
            </FadeUp>
            <FadeUp
              delay={0.6}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              <Cta href="#demo">Request a demo</Cta>
              <div className="hidden items-center gap-3 sm:flex">
                <span className="grid size-[42px] place-items-center bg-white">
                  <CubeIcon glyph="barn" size={30} />
                </span>
                <span className="text-[14px] leading-[1.25] tracking-[-0.01em]">
                  <span className="block font-medium">A new perspective</span>
                  <span className="text-slate">on poultry farming</span>
                </span>
              </div>
            </FadeUp>
          </div>
        </motion.div>

        {/* bottom tab strip */}
        <motion.div
          className="relative z-10"
          style={{ opacity: textOpacity }}
        >
          <div ref={strip} className="wrap flex flex-col gap-3 pb-5 md:flex-row md:items-end md:justify-between">
            <div
              className="flex gap-5 overflow-x-auto md:gap-7"
              role="tablist"
              aria-label="What Molt brings into view"
            >
              {HERO_TABS.map((t, i) => (
                <button
                  key={t.label}
                  role="tab"
                  aria-selected={tab === i}
                  onClick={() => setTab(i)}
                  className={cn(
                    "relative shrink-0 pt-3 text-[14.5px] tracking-[-0.01em] transition-colors",
                    tab === i ? "text-ink" : "text-slate hover:text-ink",
                  )}
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
                  <span className="font-sans text-[13.5px] tracking-[-0.005em] text-ink">
                    {HERO_TABS[tab].line}
                  </span>
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.p
          className="mono pointer-events-none absolute bottom-[86px] right-10 z-30 hidden items-center gap-2 text-ink/60 lg:flex"
          style={{ opacity: hintOpacity }}
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            ↓
          </motion.span>
          Scroll to look inside Barn 01
        </motion.p>
      </div>
    </section>
  );
}
