"use client";

import { motion, type MotionValue } from "motion/react";

/* Tiny isometric engine used for the hero farm scene + wireframe barn. */

const C = Math.cos(Math.PI / 6);

export function makeIso(scale: number, ox: number, oy: number) {
  return (x: number, y: number, z = 0): [number, number] => [
    ox + (x - y) * C * scale,
    oy + (x + y) * 0.5 * scale - z * scale,
  ];
}
type Iso = ReturnType<typeof makeIso>;
const pts = (arr: [number, number][]) => arr.map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ");

type Palette = { top: string; left: string; right: string; stroke?: string };

const WHITE: Palette = { top: "#ffffff", left: "#e7e9ed", right: "#d6d9df" };
const ORANGE: Palette = { top: "#ff8a57", left: "#ff5a1f", right: "#e8470f" };
const INK: Palette = { top: "#3a3e46", left: "#1d2027", right: "#121419" };

function Box({
  iso, x, y, z = 0, w, d, h, p = WHITE, wire,
}: { iso: Iso; x: number; y: number; z?: number; w: number; d: number; h: number; p?: Palette; wire?: boolean }) {
  const top = [iso(x, y, z + h), iso(x + w, y, z + h), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const left = [iso(x, y + d, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x, y + d, z + h)];
  const right = [iso(x + w, y, z), iso(x + w, y + d, z), iso(x + w, y + d, z + h), iso(x + w, y, z + h)];
  const common = wire
    ? { fill: "none", stroke: "#0B0C0F", strokeWidth: 1.1, strokeLinejoin: "round" as const }
    : { strokeLinejoin: "round" as const };
  return (
    <g>
      <polygon points={pts(left)} {...common} fill={wire ? "none" : p.left} />
      <polygon points={pts(right)} {...common} fill={wire ? "none" : p.right} />
      <polygon points={pts(top)} {...common} fill={wire ? "none" : p.top} />
    </g>
  );
}

function Barn({
  iso, x, y, w, d, h, rh, p = WHITE, wire,
}: { iso: Iso; x: number; y: number; w: number; d: number; h: number; rh: number; p?: Palette; wire?: boolean }) {
  const mid = y + d / 2;
  const back = [iso(x, y, h), iso(x + w, y, h), iso(x + w, mid, h + rh), iso(x, mid, h + rh)];
  const front = [iso(x, y + d, h), iso(x + w, y + d, h), iso(x + w, mid, h + rh), iso(x, mid, h + rh)];
  const gable = [iso(x + w, y, h), iso(x + w, y + d, h), iso(x + w, mid, h + rh)];
  const wall = (p2: string) => (wire ? { fill: "none", stroke: "#0B0C0F", strokeWidth: 1.1 } : { fill: p2 });
  const vents = Array.from({ length: Math.floor(w / 1.4) }, (_, i) => x + 0.7 + i * 1.4);
  return (
    <g strokeLinejoin="round">
      <Box iso={iso} x={x} y={y} w={w} d={d} h={h} p={p} wire={wire} />
      <polygon points={pts(back)} {...wall("#f4f5f7")} />
      <polygon points={pts(gable)} {...wall(p.right)} />
      <polygon points={pts(front)} {...wall("#fbfbfc")} stroke={wire ? "#0B0C0F" : "#d6d9df"} strokeWidth={wire ? 1.1 : 0.6} />
      {/* side windows / vents */}
      {vents.map((vx, i) => (
        <polygon
          key={i}
          points={pts([iso(vx, y + d, h * 0.45), iso(vx + 0.7, y + d, h * 0.45), iso(vx + 0.7, y + d, h * 0.75), iso(vx, y + d, h * 0.75)])}
          fill={wire ? "none" : "#c9cdd4"}
          stroke={wire ? "#0B0C0F" : "none"}
          strokeWidth={0.8}
        />
      ))}
    </g>
  );
}

function CameraPole({ iso, x, y, h, wire }: { iso: Iso; x: number; y: number; h: number; wire?: boolean }) {
  const [hx, hy] = iso(x + 0.1, y + 0.1, h + 0.25);
  return (
    <g>
      <Box iso={iso} x={x} y={y} w={0.2} d={0.2} h={h} wire={wire} />
      <Box iso={iso} x={x - 0.35} y={y - 0.1} z={h} w={0.7} d={0.4} h={0.45} p={INK} wire={wire} />
      {!wire && <circle cx={hx - 9} cy={hy + 6} r={2.2} fill="#FFD60A" className="animate-blink" />}
    </g>
  );
}

/* ------------------------------------------------------------------ */

/** viewBox position of the A2 marker – the point the hero scroll dives into. */
export const HERO_FOCUS = { x: 700, y: 309 };

export function HeroScene({
  className,
  scale,
  rotate,
  focusRef,
}: {
  className?: string;
  scale?: MotionValue<number>;
  rotate?: MotionValue<number>;
  focusRef?: React.Ref<SVGCircleElement>;
}) {
  const iso = makeIso(33, 560, 215);
  const grid: React.ReactNode[] = [];
  for (let i = -2; i <= 22; i++) {
    grid.push(<line key={`a${i}`} x1={iso(i, -2)[0]} y1={iso(i, -2)[1]} x2={iso(i, 18)[0]} y2={iso(i, 18)[1]} />);
  }
  for (let j = -2; j <= 18; j++) {
    grid.push(<line key={`b${j}`} x1={iso(-2, j)[0]} y1={iso(-2, j)[1]} x2={iso(22, j)[0]} y2={iso(22, j)[1]} />);
  }
  const scanPath = [iso(17.1, 9.2), iso(13, 9.2), iso(13, 6.6), iso(6, 6.6)];
  const scanPath2 = [iso(2.1, 11.2), iso(2.1, 7.4), iso(4.2, 7.4)];
  const plate = [iso(-1, -1), iso(21, -1), iso(21, 16), iso(-1, 16)];
  return (
    <svg viewBox="0 0 1200 900" className={className} aria-hidden>
      <defs>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <linearGradient id="fadeL" x1="0" x2="1">
          <stop offset="0" stopColor="#f1f2f5" />
          <stop offset="0.35" stopColor="#f1f2f5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.g
        style={{
          scale,
          rotate,
          transformBox: "view-box",
          transformOrigin: `${HERO_FOCUS.x}px ${HERO_FOCUS.y}px`,
        }}
      >
      <g stroke="rgba(11,12,15,.055)" strokeWidth="1">{grid}</g>
      <polygon points={pts(plate)} fill="#eceef1" stroke="#e1e4e8" />

      {/* shadows */}
      <g filter="url(#soft)" opacity="0.35">
        <polygon points={pts([iso(5, 3.2), iso(17.5, 3.2), iso(17.5, 7.8), iso(5, 7.8)])} fill="#b9bec7" />
        <polygon points={pts([iso(1, 2), iso(4.2, 2), iso(4.2, 5.2), iso(1, 5.2)])} fill="#f5a07f" />
      </g>

      {/* feed silo (orange) */}
      <Box iso={iso} x={0.6} y={1.4} w={3} d={3} h={3.2} p={ORANGE} />
      <Box iso={iso} x={1.4} y={2.2} z={3.2} w={1.4} d={1.4} h={0.35} p={WHITE} />

      {/* main barn */}
      <Barn iso={iso} x={5} y={2.6} w={12} d={4} h={2.1} rh={1.3} />
      {/* second barn */}
      <Barn iso={iso} x={7} y={10} w={9} d={3.4} h={1.6} rh={1.1} />

      {/* scan paths */}
      <polyline points={pts(scanPath)} fill="none" stroke="#FFD60A" strokeWidth="5" strokeLinecap="round" strokeDasharray="5 7" className="animate-dash" />
      <polyline points={pts(scanPath2)} fill="none" stroke="#FFD60A" strokeWidth="5" strokeLinecap="round" strokeDasharray="5 7" className="animate-dash" />

      <CameraPole iso={iso} x={17} y={9.1} h={3.4} />
      <CameraPole iso={iso} x={2} y={11.1} h={2.8} />

      {/* crates on the conveyor / feed line */}
      <Box iso={iso} x={18.4} y={2} w={1} d={4.8} h={0.5} p={INK} />
      <Box iso={iso} x={18.5} y={3} z={0.5} w={0.8} d={0.8} h={0.6} p={ORANGE} />

      {/* count pulses over areas */}
      {[6.5, 9.5, 12.5, 15.5].map((ax, i) => {
        const [cx, cy] = iso(ax, 4.6, 4.2);
        return (
          <g key={ax}>
            <motion.circle
              cx={cx}
              cy={cy}
              r={6}
              fill="none"
              stroke="#FFD60A"
              strokeWidth={1.5}
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <circle cx={cx} cy={cy} r={3.5} fill="#FFD60A" />
            <text x={cx + 9} y={cy + 4} fontSize="12" fontFamily="var(--font-geist-mono)" fill="#565b64">
              A{i + 1}
            </text>
          </g>
        );
      })}

      <circle ref={focusRef} cx={HERO_FOCUS.x} cy={HERO_FOCUS.y} r={1} fill="none" />
      </motion.g>

      <rect width="1200" height="900" fill="url(#fadeL)" />
    </svg>
  );
}

/** Line-art farm on an iso grid (orange CTA): the same layout as the hero film. */
export function WireBarn({ className }: { className?: string }) {
  const iso = makeIso(26, 320, 118);
  const BG = "#FFD60A";
  const ink = { stroke: "#0B0C0F", strokeWidth: 1.15, strokeLinejoin: "round" as const };
  type P3 = [number, number, number];
  const poly = (ps: P3[], k: string, fill = BG, extra: React.SVGProps<SVGPolygonElement> = {}) => (
    <polygon key={k} points={pts(ps.map(([x, y, z]) => iso(x, y, z)))} fill={fill} {...ink} {...extra} />
  );
  /* opaque box: left (+y), right (+x) and top faces */
  const box = (x: number, y: number, z: number, w: number, d: number, h: number, k: string) => (
    <g key={k}>
      {poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], "l")}
      {poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], "r")}
      {poly([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], "t")}
    </g>
  );
  /* gable barn, ridge along x */
  const barn = (x: number, y: number, w: number, d: number, h: number, rh: number, k: string, windows: number) => {
    const m = y + d / 2;
    const step = w / (windows + 1);
    return (
      <g key={k}>
        {box(x, y, 0, w, d, h, "b")}
        {poly([[x, y, h], [x + w, y, h], [x + w, m, h + rh], [x, m, h + rh]], "rb")}
        {poly([[x + w, y, h], [x + w, y + d, h], [x + w, m, h + rh]], "g")}
        {poly([[x - 0.15, y + d + 0.2, h - 0.08], [x + w + 0.15, y + d + 0.2, h - 0.08], [x + w + 0.15, m, h + rh], [x - 0.15, m, h + rh]], "rf")}
        {/* roof seams */}
        {Array.from({ length: Math.floor(w / 0.9) }, (_, i) => {
          const sx = x + 0.45 + i * 0.9;
          const [a1, b1] = iso(sx, y + d + 0.2, h - 0.08);
          const [a2, b2] = iso(sx, m, h + rh);
          return <line key={i} x1={a1} y1={b1} x2={a2} y2={b2} stroke="#0B0C0F" strokeOpacity="0.28" strokeWidth="0.8" />;
        })}
        {Array.from({ length: windows }, (_, i) => {
          const wx = x + step * (i + 1) - 0.3;
          return poly([[wx, y + d, h * 0.38], [wx + 0.6, y + d, h * 0.38], [wx + 0.6, y + d, h * 0.72], [wx, y + d, h * 0.72]], `w${i}`);
        })}
        {/* end doors on the gable */}
        {poly([[x + w, m - 0.55, 0], [x + w, m + 0.55, 0], [x + w, m + 0.55, h * 0.78], [x + w, m - 0.55, h * 0.78]], "door")}
        <line {...(() => { const [x1, y1] = iso(x + w, m - 0.55, 0); const [x2, y2] = iso(x + w, m + 0.55, h * 0.78); return { x1, y1, x2, y2 }; })()} stroke="#0B0C0F" strokeWidth="0.8" />
        <line {...(() => { const [x1, y1] = iso(x + w, m + 0.55, 0); const [x2, y2] = iso(x + w, m - 0.55, h * 0.78); return { x1, y1, x2, y2 }; })()} stroke="#0B0C0F" strokeWidth="0.8" />
      </g>
    );
  };
  const pole = (x: number, y: number, h: number, k: string) => (
    <g key={k}>
      {box(x, y, 0, 0.18, 0.18, h, "p")}
      {box(x - 0.45, y - 0.05, h, 0.85, 0.32, 0.36, "c")}
      {poly([[x - 0.48, y - 0.1, h + 0.4], [x + 0.45, y - 0.1, h + 0.4], [x + 0.45, y + 0.32, h + 0.4], [x - 0.48, y + 0.32, h + 0.4]], "hood")}
    </g>
  );
  const dash = (ps: [number, number][], k: string) => (
    <polyline
      key={k}
      points={pts(ps.map(([x, y]) => iso(x, y, 0)))}
      fill="none"
      stroke="#0B0C0F"
      strokeWidth="1.4"
      strokeDasharray="4 5"
      className="animate-dash"
    />
  );

  const grid: React.ReactNode[] = [];
  for (let i = -1; i <= 19; i++) {
    grid.push(<line key={`a${i}`} x1={iso(i, -1)[0]} y1={iso(i, -1)[1]} x2={iso(i, 16)[0]} y2={iso(i, 16)[1]} />);
  }
  for (let j = -1; j <= 16; j++) {
    grid.push(<line key={`b${j}`} x1={iso(-1, j)[0]} y1={iso(-1, j)[1]} x2={iso(19, j)[0]} y2={iso(19, j)[1]} />);
  }

  const pins = [5.6, 8.1, 10.6, 13.1];
  return (
    <svg viewBox="0 0 660 560" className={className} aria-hidden>
      <g stroke="#0B0C0F" strokeOpacity="0.32" strokeWidth="1">{grid}</g>

      {/* camera links on the ground */}
      {dash([[8.1, 1.1], [8.1, 2.4], [4, 2.4]], "d1")}
      {dash([[1.1, 10.1], [1.1, 8.2], [5, 8.2]], "d2")}
      {dash([[16.6, 8.1], [15.2, 8.1], [15.2, 4]], "d3")}

      {pole(8, 1, 3.8, "pb")}

      {/* feed silo on legs, beside the barn end */}
      <g>
        {[[0.7, 3.7], [2.1, 3.7], [0.7, 5.1], [2.1, 5.1]].map(([lx, ly], i) => box(lx, ly, 0, 0.12, 0.12, 1.5, `leg${i}`))}
        {box(0.55, 3.55, 1.5, 1.8, 1.8, 2.2, "tank")}
        {poly([[0.55, 5.35, 3.7], [2.35, 5.35, 3.7], [1.45, 4.45, 4.5]], "cone-l")}
        {poly([[2.35, 3.55, 3.7], [2.35, 5.35, 3.7], [1.45, 4.45, 4.5]], "cone-r")}
        {box(1.25, 4.25, 4.45, 0.4, 0.4, 0.25, "cap")}
        <polyline points={pts([iso(2.35, 4.3, 3.3), iso(2.9, 4.3, 3.3), iso(3.2, 4.3, 2.6)])} fill="none" stroke="#0B0C0F" strokeWidth="1.2" />
      </g>

      {barn(3.2, 3, 11, 4, 2, 1.35, "main", 8)}
      {barn(6.2, 9.2, 5.2, 3, 1.5, 0.95, "small", 0)}

      {/* A1 – A4 pins on the ridge */}
      {pins.map((px, i) => {
        const [cx, cy] = iso(px, 5, 3.35);
        return (
          <g key={px}>
            <motion.circle
              cx={cx}
              cy={cy - 23}
              r={14}
              fill="none"
              stroke="#0B0C0F"
              strokeWidth="1"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.45, ease: "easeOut" }}
              style={{ transformOrigin: `${cx}px ${cy - 23}px` }}
            />
            <path
              d={`M${cx} ${cy} C ${cx - 4} ${cy - 8}, ${cx - 12} ${cy - 13}, ${cx - 12} ${cy - 23} A 12 12 0 1 1 ${cx + 12} ${cy - 23} C ${cx + 12} ${cy - 13}, ${cx + 4} ${cy - 8}, ${cx} ${cy} Z`}
              fill={BG}
              {...ink}
            />
            <text x={cx} y={cy - 19.5} textAnchor="middle" fontSize="10.5" fontWeight="600" fontFamily="var(--font-geist-mono)" fill="#0B0C0F">
              A{i + 1}
            </text>
          </g>
        );
      })}

      {pole(1, 10, 3.4, "pl")}
      {pole(16.5, 8, 3.4, "pr")}
    </svg>
  );
}
