"use client";

import { motion } from "motion/react";
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
      <div className="relative min-h-[420px] overflow-hidden bg-black lg:min-h-[760px]">
        <CameraRender />
        <p className="mono absolute bottom-4 left-4 text-white">Fig. 09 / Camera, area A2</p>
      </div>
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

/** Large isometric box camera: faceted housing, sun hood, hex lens bezel, wall bracket. */
type V3 = [number, number, number];

function CameraRender() {
  const iso = makeIso(66, 330, 300);
  const P = (pts: V3[]) => pts.map(([a, b, c]) => iso(a, b, c).map((n) => n.toFixed(1)).join(",")).join(" ");
  const line = { stroke: "rgba(11,12,15,.55)", strokeWidth: 1, strokeLinejoin: "round" as const };

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
  const faces = [
    { i: 2, fill: "url(#camSide)" },
    { i: 3, fill: "url(#camChamfer)" },
    { i: 4, fill: "url(#camTop)" },
  ];

  // box helper for bracket parts (draws +z, +y, +x faces)
  const box = (x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, k: string) => (
    <g key={k}>
      <polygon points={P([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]])} fill="#3b4049" {...line} />
      <polygon points={P([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]])} fill="#2a2e35" {...line} />
      <polygon points={P([[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]])} fill="#1b1e24" {...line} />
    </g>
  );

  // front (x = W) geometry
  const ring = (cy: number, cz: number, r: number, n: number, rot = 0): V3[] =>
    Array.from({ length: n }, (_, k) => {
      const t = rot + (k / n) * Math.PI * 2;
      return [W + 0.02, cy + Math.cos(t) * r, cz + Math.sin(t) * r] as V3;
    });
  const cy = D / 2, cz = H / 2;
  const leds = Array.from({ length: 18 }, (_, k) => {
    const t = (k / 18) * Math.PI * 2;
    const r = 0.56;
    return iso(W + 0.03, cy + Math.cos(t) * r, cz + Math.sin(t) * r);
  });
  const lens = iso(W + 0.05, cy, cz);

  return (
    <motion.svg
      viewBox="0 0 720 720"
      className="absolute inset-0 h-full w-full"
      initial={{ scale: 1.1, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <defs>
        <radialGradient id="glow" cx="66%" cy="58%" r="55%">
          <stop offset="0" stopColor="#ffd60a" stopOpacity="0.42" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="camTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f7f9" />
          <stop offset="1" stopColor="#c9cdd4" />
        </linearGradient>
        <linearGradient id="camChamfer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c3c8d0" />
          <stop offset="1" stopColor="#9da3ad" />
        </linearGradient>
        <linearGradient id="camSide" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8f96a1" />
          <stop offset="1" stopColor="#4c525c" />
        </linearGradient>
        <linearGradient id="hood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe2e7" />
        </linearGradient>
      </defs>
      <rect width="720" height="720" fill="url(#glow)" />

      {/* view cone */}
      <motion.polygon
        points={`${lens[0] + 20},${lens[1] + 6} 720,${lens[1] + 40} 720,${lens[1] + 330}`}
        fill="#ffd60a"
        initial={{ opacity: 0.04 }}
        animate={{ opacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />

      {/* wall bracket: plate, arm, post, swivel */}
      <polygon points={P([[-0.9, -0.2, -0.4], [-0.9, 1.9, -0.4], [-0.9, 1.9, -2.9], [-0.9, -0.2, -2.9]])} fill="#2f343c" {...line} />
      {box(-0.9, 0.55, -2.1, 2.3, 1.15, -1.75, "arm")}
      {box(1.9, 0.55, -1.75, 2.3, 1.15, -0.35, "post")}
      {box(1.6, 0.4, -0.35, 2.6, 1.3, 0, "swivel")}
      {(() => {
        const [sx, sy] = iso(-0.9, 1.45, -2.55);
        return <ellipse cx={sx} cy={sy} rx="6" ry="7" fill="#0b0c0f" stroke="#5b616b" strokeWidth="1.5" />;
      })()}

      {/* housing body */}
      {faces.map(({ i, fill }) => (
        <polygon key={i} points={P(strip(i, 0, W))} fill={fill} {...line} />
      ))}
      {/* panel seams, like the faceted reference */}
      {[1.1, 2.3, 3.4].map((sx) => (
        <polyline
          key={sx}
          points={P([[sx, D, CH], [sx, D, H - CH], [sx - 0.08, D - CH, H], [sx - 0.08, CH, H]])}
          fill="none"
          stroke="rgba(11,12,15,.35)"
          strokeWidth="1"
          strokeDasharray={sx === 2.3 ? "5 4" : undefined}
        />
      ))}
      {/* back cap edge */}
      <polygon points={P(prof.map(([y, z]) => [0, y, z] as V3))} fill="none" {...line} />

      {/* front: octagonal cap + hex bezel + IR ring + lens */}
      <polygon points={P(prof.map(([y, z]) => [W, y, z] as V3))} fill="#23262c" {...line} />
      <polygon points={P(ring(cy, cz, 0.72, 6, Math.PI / 6))} fill="#15171b" stroke="#3a3f47" strokeWidth="1.5" />
      {leds.map(([lx, ly], k) => (
        <circle key={k} cx={lx} cy={ly} r="2.1" fill={k % 3 === 0 ? "#7a2a2a" : "#3a3f47"} />
      ))}
      <polygon points={P(ring(cy, cz, 0.42, 40))} fill="#ffd60a" />
      <polygon points={P(ring(cy, cz, 0.32, 40))} fill="#0b0c0f" stroke="#2a2d34" strokeWidth="2" />
      <polygon points={P(ring(cy, cz, 0.18, 40))} fill="#1a2030" stroke="#ffe45c" strokeWidth="1.5" />
      <ellipse cx={lens[0] + 4} cy={lens[1] - 8} rx="5" ry="6" fill="#fff" opacity="0.75" />

      {/* sun hood: top plate + side flap, overhanging the lens */}
      <polygon
        points={P([[0.5, -0.1, H + 0.1], [W + 0.4, -0.1, H + 0.1], [W + 0.4, D + 0.1, H + 0.1], [0.5, D + 0.1, H + 0.1]])}
        fill="url(#hood)"
        {...line}
      />
      <polygon
        points={P([[0.5, D + 0.1, H + 0.1], [W + 0.4, D + 0.1, H + 0.1], [W + 0.4, D + 0.1, H - 0.08], [W + 0.15, D + 0.1, H - 0.3], [0.5, D + 0.1, H - 0.3]])}
        fill="#d4d8de"
        {...line}
      />
      <polygon
        points={P([[W + 0.4, -0.1, H + 0.1], [W + 0.4, D + 0.1, H + 0.1], [W + 0.4, D + 0.1, H + 0.03], [W + 0.4, -0.1, H + 0.03]])}
        fill="#aab0b9"
      />

      {/* status LED */}
      {(() => {
        const [x, y] = iso(0.55, D, H * 0.62);
        return <circle cx={x} cy={y} r="5" fill="#12a866" className="animate-blink" />;
      })()}
    </motion.svg>
  );
}
