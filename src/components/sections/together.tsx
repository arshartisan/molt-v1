"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useSpring } from "motion/react";
import { KeyRound, MessageSquare, ShieldCheck, UsersRound } from "lucide-react";
import { FadeUp, RevealHeading } from "@/components/primitives";
import { makeIso } from "@/components/iso";

const RULES = [
  { I: MessageSquare, t: "Invite staff with an SMS invitation", d: "Owners add the people who work on each farm, by mobile number." },
  { I: UsersRound, t: "Manager or Worker access, per farm", d: "Each team member’s actions depend on their role and farm access." },
  { I: ShieldCheck, t: "Owners keep control", d: "Owners manage setup, sales, corrections and permissions." },
  { I: KeyRound, t: "Sign in with a six-digit code", d: "A mobile number and an SMS verification code. No passwords to share." },
];

export function Together() {
  return (
    <section data-section="9" data-theme="dark" className="relative grid bg-ink text-white lg:grid-cols-[46%_1fr]">
      <CameraRender />
      <div className="flex flex-col justify-center px-4 py-20 sm:px-6 lg:px-14">
        <p className="mono text-white/60">09 / Better together</p>
        <RevealHeading
          dark
          className="display-lg mt-3"
          lines={[{ text: "Everyone on" }, { text: "the same page.", muted: true }]}
        />
        <p className="lede mt-5 max-w-[46ch] text-white/60">
          Keep everyone connected to the farms they work on. Owners manage setup and permissions. Assigned teams keep the
          daily work moving.
        </p>
        <ul className="mt-10 border-t border-white/12">
          {RULES.map(({ I, t, d }, i) => (
            <FadeUp key={t} delay={i * 0.08}>
              <li className="flex gap-4 border-b border-white/12 py-5">
                <I className="mt-1 size-5 shrink-0 text-orange" strokeWidth={1.7} />
                <div>
                  <p className="text-[21px] font-medium tracking-[-0.03em]">{t}</p>
                  <p className="mt-0.5 text-[14.5px] text-white/60">{d}</p>
                </div>
              </li>
            </FadeUp>
          ))}
        </ul>
        <p className="mt-6 text-[13px] text-white/45">
          Camera views and fresh counts depend on your connected hardware and monitoring services.
        </p>
      </div>
    </section>
  );
}

/** Large isometric box camera, drawn as line art on a light panel. It turns toward the pointer. */
type V3 = [number, number, number];

const INK = "#0b0c0f";
const clampN = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* Fixed geometry (module level so hooks never see it change). */
const iso = makeIso(66, 330, 300);
const P = (pts: V3[]) => pts.map(([a, b, c]) => iso(a, b, c).map((n) => n.toFixed(1)).join(",")).join(" ");
const line = { stroke: INK, strokeWidth: 1.4, strokeLinejoin: "round" as const };

// housing: octagon profile (y, z) extruded along x
const W = 4.4, D = 1.7, H = 1.5, CH = 0.36;
const prof: [number, number][] = [
  [CH, 0], [D - CH, 0], [D, CH], [D, H - CH], [D - CH, H], [CH, H], [0, H - CH], [0, CH],
];
const strip = (i: number, x0: number, x1: number): V3[] => {
  const [ay, az] = prof[i];
  const [by, bz] = prof[(i + 1) % prof.length];
  return [[x0, ay, az], [x1, ay, az], [x1, by, bz], [x0, by, bz]];
};
// visible faces for this view: +y side (2), +y+z chamfer (3), top (4)
const FACES = [
  { i: 2, fill: "url(#camHatch)" },
  { i: 3, fill: "#f3f4f6" },
  { i: 4, fill: "#ffffff" },
];
const cy = D / 2, cz = H / 2;
const ring = (r: number, n: number, rot = 0): V3[] =>
  Array.from({ length: n }, (_, k) => {
    const t = rot + (k / n) * Math.PI * 2;
    return [W + 0.02, cy + Math.cos(t) * r, cz + Math.sin(t) * r] as V3;
  });
const LEDS = Array.from({ length: 18 }, (_, k) => {
  const t = (k / 18) * Math.PI * 2;
  return iso(W + 0.03, cy + Math.cos(t) * 0.56, cz + Math.sin(t) * 0.56);
});
const LENS = iso(W + 0.05, cy, cz);
const PIVOT = iso(2.1, 0.85, -0.2); // swivel on the bracket
/** The lens axis on screen: straight out of the front face (+x in the iso frame). */
const AHEAD = iso(W + 1, cy, cz);
const AXIS = Math.atan2(AHEAD[1] - LENS[1], AHEAD[0] - LENS[0]);
/** Where the camera looks when nobody is pointing: along its own axis. */
const REST: [number, number] = [LENS[0] + Math.cos(AXIS) * 360, LENS[1] + Math.sin(AXIS) * 360];
// box helper for bracket parts (draws +z, +y, +x faces)
const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, k: string) => (
  <g key={k}>
    <polygon points={P([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill="#ffffff" {...line} />
    <polygon points={P([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill="#eceef1" {...line} />
    <polygon points={P([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])} fill="url(#camHatch)" {...line} />
  </g>
);

function CameraRender() {
  // Target point in SVG units; springs smooth it so the camera eases after the cursor.
  const tx = useMotionValue(REST[0]);
  const ty = useMotionValue(REST[1]);
  const ax = useSpring(tx, { stiffness: 70, damping: 16 });
  const ay = useSpring(ty, { stiffness: 70, damping: 16 });

  const svg = useRef<SVGSVGElement>(null);
  const body = useRef<SVGGElement>(null);
  const pupil = useRef<SVGGElement>(null);
  const glow = useRef<SVGCircleElement>(null);

  const draw = () => {
    const x = ax.get();
    const y = ay.get();
    // camera turn: angle toward the target relative to the resting aim, kept subtle
    const want = Math.atan2(y - LENS[1], x - LENS[0]);
    const deg = clampN(((want - AXIS) * 180) / Math.PI, -14, 12);
    body.current?.setAttribute("transform", `rotate(${deg.toFixed(2)} ${PIVOT[0]} ${PIVOT[1]})`);
    const r = (deg * Math.PI) / 180;
    // the iris drifts a little toward the target, inside the turned body
    pupil.current?.setAttribute(
      "transform",
      `translate(${(Math.cos(want - r) * 4).toFixed(2)} ${(Math.sin(want - r) * 4).toFixed(2)})`,
    );
    glow.current?.setAttribute("cx", x.toFixed(1));
    glow.current?.setAttribute("cy", y.toFixed(1));
  };
  useMotionValueEvent(ax, "change", draw);
  useMotionValueEvent(ay, "change", draw);
  // first paint: draw the resting pose (draw only touches refs and springs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(draw, []);

  /* Touch screens have no cursor: sweep slowly across the barn instead. */
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !window.matchMedia("(hover: none)").matches) return;
    const opts = { duration: 9, repeat: Infinity, ease: "easeInOut" } as const;
    const a = animate(tx, [REST[0], REST[0] - 120, REST[0] + 40, REST[0]], opts);
    const b = animate(ty, [REST[1], REST[1] + 170, REST[1] - 160, REST[1]], opts);
    return () => {
      a.stop();
      b.stop();
    };
  }, [tx, ty]);

  const follow = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const m = svg.current?.getScreenCTM();
    if (!m) return;
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    tx.set(pt.x);
    ty.set(pt.y);
  };

  return (
    <div
      className="dot-grid-light relative min-h-[420px] overflow-hidden bg-paper text-ink lg:min-h-[760px]"
      onPointerMove={follow}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        tx.set(REST[0]);
        ty.set(REST[1]);
      }}
    >
      <motion.svg
        ref={svg}
        viewBox="0 0 720 720"
        className="absolute inset-0 h-full w-full"
        initial={{ scale: 1.06, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      >
        <defs>
          <radialGradient id="camGlow">
            <stop offset="0" stopColor="#ffd60a" stopOpacity="0.38" />
            <stop offset="1" stopColor="#ffd60a" stopOpacity="0" />
          </radialGradient>
          <pattern id="camHatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <rect width="7" height="7" fill="#ffffff" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(11,12,15,.22)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* soft light that follows the pointer */}
        <circle ref={glow} cx={REST[0]} cy={REST[1]} r="300" fill="url(#camGlow)" />


        {/* wall bracket: plate, arm, post (fixed to the wall) */}
        <polygon points={P([[-0.9, -0.2, -0.4], [-0.9, 1.9, -0.4], [-0.9, 1.9, -2.9], [-0.9, -0.2, -2.9]])} fill="#f6f7f9" {...line} />
        {box(-0.9, 0.55, -2.1, 2.3, 1.15, -1.75, "arm")}
        {box(1.9, 0.55, -1.75, 2.3, 1.15, -0.35, "post")}
        {(() => {
          const [sx, sy] = iso(-0.9, 1.45, -2.55);
          return <ellipse cx={sx} cy={sy} rx="6" ry="7" fill="#f1f2f5" stroke={INK} strokeWidth="1.4" />;
        })()}

        {/* everything above the swivel turns toward the pointer */}
        <g ref={body}>
          {box(1.6, 0.4, -0.35, 2.6, 1.3, 0, "swivel")}

          {/* housing body */}
          {FACES.map(({ i, fill }) => (
            <polygon key={i} points={P(strip(i, 0, W))} fill={fill} {...line} />
          ))}
          {/* panel seams */}
          {[1.1, 2.3, 3.4].map((sx) => (
            <polyline
              key={sx}
              points={P([[sx, D, CH], [sx, D, H - CH], [sx - 0.08, D - CH, H], [sx - 0.08, CH, H]])}
              fill="none"
              stroke="rgba(11,12,15,.45)"
              strokeWidth="1"
              strokeDasharray={sx === 2.3 ? "5 4" : undefined}
            />
          ))}
          {/* back cap edge */}
          <polygon points={P(prof.map(([y, z]) => [0, y, z] as V3))} fill="none" {...line} />

          {/* front: octagonal cap + hex bezel + IR ring + lens */}
          <polygon points={P(prof.map(([y, z]) => [W, y, z] as V3))} fill="#ffffff" {...line} />
          <polygon points={P(ring(0.72, 6, Math.PI / 6))} fill="#f3f4f6" {...line} />
          {LEDS.map(([lx, ly], k) => (
            <circle key={k} cx={lx} cy={ly} r="2.1" fill={k % 3 === 0 ? INK : "none"} stroke={INK} strokeWidth="0.9" />
          ))}
          <polygon points={P(ring(0.42, 40))} fill="#ffd60a" {...line} />
          <polygon points={P(ring(0.32, 40))} fill="#ffffff" {...line} />
          <g ref={pupil}>
            <polygon points={P(ring(0.18, 40))} fill={INK} />
            <ellipse cx={LENS[0] + 3} cy={LENS[1] - 5} rx="3" ry="3.6" fill="#fff" />
          </g>

          {/* sun hood: top plate + side flap, overhanging the lens */}
          <polygon
            points={P([[0.5, -0.1, H + 0.1], [W + 0.4, -0.1, H + 0.1], [W + 0.4, D + 0.1, H + 0.1], [0.5, D + 0.1, H + 0.1]])}
            fill="#ffffff"
            {...line}
          />
          <polygon
            points={P([[0.5, D + 0.1, H + 0.1], [W + 0.4, D + 0.1, H + 0.1], [W + 0.4, D + 0.1, H - 0.08], [W + 0.15, D + 0.1, H - 0.3], [0.5, D + 0.1, H - 0.3]])}
            fill="#eef0f3"
            {...line}
          />

          {/* status LED */}
          {(() => {
            const [x, y] = iso(0.55, D, H * 0.62);
            return <circle cx={x} cy={y} r="5" fill="#12a866" stroke={INK} strokeWidth="1" className="animate-blink" />;
          })()}
        </g>
      </motion.svg>
      <p className="mono absolute bottom-4 left-4 text-ink/70">Fig. 09 / Camera, area A2</p>
      <p className="mono absolute right-4 top-4 hidden text-ink/45 [@media(hover:hover)]:block">Move your cursor</p>
    </div>
  );
}
