"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity as ActivityIcon,
  ArrowLeft,
  ArrowRight,
  Bell,
  Camera,
  ChevronsUpDown,
  Circle,
  Download,
  HeartPulse,
  Images,
  LayoutGrid,
  Monitor,
  Moon,
  RefreshCw,
  Save,
  Search,
  SlidersHorizontal,
  Sun,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { ColumnGuides, FadeUp, RevealHeading, SectionHead } from "@/components/primitives";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Sample data – modelled on the Molt admin console (illustrative)      */
/* ------------------------------------------------------------------ */

type Cam = { id: string; area: string; online: boolean; r1?: number; r2?: number };

const CAMS: Cam[] = [
  { id: "a1", area: "A1", online: false },
  { id: "a2", area: "A2", online: true, r1: 92, r2: 104 },
  { id: "a3", area: "A3", online: true, r1: 145, r2: 163 },
  { id: "a4", area: "A4", online: true, r1: 57, r2: 42 },
  { id: "a5", area: "A5", online: true, r1: 87, r2: 107 },
  { id: "a6", area: "A6", online: false },
  { id: "a7", area: "A7", online: true, r1: 28, r2: 50 },
  { id: "a8", area: "A8", online: true, r1: 64, r2: 86 },
  { id: "a9", area: "A9", online: true, r1: 209, r2: 210 },
  { id: "a10", area: "A10", online: true, r1: 141, r2: 171 },
  { id: "a11", area: "A11", online: true, r1: 189, r2: 197 },
  { id: "a12", area: "A12", online: false },
];
const HAS_PHOTO = new Set(CAMS.filter((c) => c.r1 != null).map((c) => c.id));

type Round = { n: number; min: number; frame: "r1" | "r2"; counts: Record<string, number> };
const roundFrom = (n: number, min: number, frame: "r1" | "r2", jitter = 0): Round => ({
  n,
  min,
  frame,
  counts: Object.fromEntries(
    CAMS.filter((c) => c[frame] != null).map((c) => [
      c.id,
      Math.max(0, (c[frame] as number) + (jitter ? Math.round(Math.random() * 6) - 3 : 0)),
    ]),
  ),
});
const ROUNDS: Round[] = [roundFrom(42, 2, "r2"), roundFrom(41, 62, "r1")];

type Alert = { id: number; kind: "Camera offline" | "Count drop"; title: string; cam: string; min: number };
const ALERTS: Alert[] = [
  { id: 1, kind: "Count drop", title: "Count dropped 26% in A4", cam: "a4", min: 2 },
  { id: 2, kind: "Camera offline", title: "Camera offline: cam-1", cam: "a1", min: 13 },
  { id: 3, kind: "Camera offline", title: "Camera offline: cam-6", cam: "a6", min: 13 },
  { id: 4, kind: "Camera offline", title: "Camera offline: cam-12", cam: "a12", min: 13 },
];

type Event = { id: number; who: string; text: string; tag: string; min: number };
const EVENTS: Event[] = [
  { id: 6, who: "S", text: "System completed snapshot round 42", tag: "round.done", min: 2 },
  { id: 5, who: "S", text: "System fired an alert", tag: "alert.fired", min: 2 },
  { id: 3, who: "S", text: "System fired an alert", tag: "alert.fired", min: 13 },
  { id: 4, who: "MA", text: "Molt Admin recorded 2 dead · B2", tag: "flock.dead", min: 48 },
  { id: 2, who: "MA", text: "Molt Admin created a batch", tag: "batch.created", min: 240 },
];

type Flock = { placed: number; dead: number; culled: number; sold: number; day: number };

type View = "overview" | "users" | "farms" | "live" | "cameras" | "snapshots" | "batches" | "alerts" | "activity" | "rules";

const ago = (m: number) =>
  m <= 0 ? "just now" : m < 60 ? `${m} minute${m === 1 ? "" : "s"} ago` : `${Math.floor(m / 60)} hour${m < 120 ? "" : "s"} ago`;
const fmt = (n: number) => n.toLocaleString("en-US");

/* Console palette, switchable by the theme item in the sidebar. */
const DARK = {
  "--cb": "#0b0b0d",
  "--cp": "#111114",
  "--cc": "#151519",
  "--ch": "#1e1e23",
  "--cl": "rgba(255,255,255,.08)",
  "--ct": "#f4f4f5",
  "--cm": "#8b8b95",
} as React.CSSProperties;
const LIGHT = {
  "--cb": "#f4f4f6",
  "--cp": "#ffffff",
  "--cc": "#ffffff",
  "--ch": "#f1f1f4",
  "--cl": "rgba(11,12,15,.09)",
  "--ct": "#0b0c0f",
  "--cm": "#6b6b75",
} as React.CSSProperties;

/* ------------------------------------------------------------------ */

export function DailyView() {
  const [view, setView] = useState<View>("overview");
  const [dark, setDark] = useState(true);
  const [cams, setCams] = useState(CAMS);
  const [rounds, setRounds] = useState(ROUNDS);
  const [scan, setScan] = useState<number | null>(null);
  const [alerts, setAlerts] = useState(ALERTS);
  const [events, setEvents] = useState(EVENTS);
  const [flock, setFlock] = useState<Flock>({ placed: 1500, dead: 6, culled: 2, sold: 0, day: 14 });
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const seq = useRef(100);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const t = setInterval(() => {
      setRounds((p) => p.map((r) => ({ ...r, min: r.min + 1 })));
      setAlerts((p) => p.map((a) => ({ ...a, min: a.min + 1 })));
      setEvents((p) => p.map((e) => ({ ...e, min: e.min + 1 })));
    }, 60_000);
    const all = timers.current;
    return () => {
      clearInterval(t);
      all.forEach(clearTimeout);
    };
  }, []);

  const log = (who: string, text: string, tag: string) =>
    setEvents((p) => [{ id: seq.current++, who, text, tag, min: 0 }, ...p].slice(0, 12));
  const flash = (m: string) => {
    setToast(m);
    timers.current.push(setTimeout(() => setToast(null), 2200));
  };

  const latest = rounds[0];
  const counting = cams.filter((c) => c.online && HAS_PHOTO.has(c.id));
  const detected = Object.values(latest.counts).reduce((s, n) => s + n, 0);
  const out = flock.dead + flock.culled + flock.sold;
  const alive = flock.placed - out;

  const runRound = () => {
    if (scan != null) return;
    const ids = counting.map((c) => c.id);
    ids.forEach((_, i) => timers.current.push(setTimeout(() => setScan(i), i * 260)));
    timers.current.push(
      setTimeout(() => {
        const frame = latest.frame === "r2" ? "r1" : "r2";
        const next = roundFrom(latest.n + 1, 0, frame, 1);
        next.counts = Object.fromEntries(Object.entries(next.counts).filter(([k]) => ids.includes(k)));
        setRounds((p) => [next, ...p].slice(0, 6));
        setScan(null);
        log("S", `System completed snapshot round ${next.n}`, "round.done");
        flash(`Round ${next.n} · ${ids.length}/${ids.length} good`);
      }, ids.length * 260 + 400),
    );
  };

  const toggleCam = (id: string) => {
    const c = cams.find((x) => x.id === id)!;
    setCams((p) => p.map((x) => (x.id === id ? { ...x, online: !x.online } : x)));
    if (c.online) {
      setAlerts((p) => [{ id: seq.current++, kind: "Camera offline", title: `Camera offline: cam-${id.slice(1)}`, cam: id, min: 0 }, ...p]);
      log("S", "System fired an alert", "alert.fired");
    } else {
      setAlerts((p) => p.filter((a) => !(a.cam === id && a.kind === "Camera offline")));
      log("MA", `Molt Admin switched on cam-${id.slice(1)}`, "camera.on");
    }
  };

  const resolve = (id: number) => {
    setAlerts((p) => p.filter((a) => a.id !== id));
    log("MA", "Molt Admin resolved an alert", "alert.resolved");
    flash("Alert resolved");
  };

  const record = (k: "dead" | "culled" | "sold") => {
    setFlock((f) => ({ ...f, [k]: f[k] + 1 }));
    log("MA", `Molt Admin recorded 1 ${k === "sold" ? "sale" : k} · B2`, `flock.${k}`);
    flash(`Recorded 1 ${k} bird`);
  };

  const go = (v: View) => {
    setView(v);
    setOpen(null);
  };

  const ctx: Ctx = { cams, rounds, latest, scan, counting, detected, alerts, events, flock, alive, out, query, setQuery, go, setOpen };

  return (
    <section data-section="5" data-theme="dark" className="relative bg-ink text-white">
      <div className="wrap relative pb-20 md:pb-28">
        <SectionHead num="05" title="Meet your new daily view" aside="Illustrative, sample records" dark />
        <div className="relative grid gap-8 pb-14 pt-14 md:grid-cols-[1.4fr_1fr] md:items-center md:pt-20">
          <ColumnGuides dark />
          <RevealHeading
            dark
            className="display-lg relative"
            lines={[{ text: "Your whole farm." }, { text: "One console.", muted: true }]}
          />
          <FadeUp delay={0.2}>
            <p className="lede relative max-w-[38ch] text-white/65">
              Live birds, mortality, cameras and alerts on one screen. Click around: run a snapshot round, open a frame,
              resolve an alert.
            </p>
          </FadeUp>
        </div>

        <FadeUp>
          <div
            style={dark ? DARK : LIGHT}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-(--cb) text-(--ct) shadow-[0_60px_120px_-40px_rgba(0,0,0,.8)] transition-colors"
          >
            <div className="grid lg:h-[780px] lg:grid-cols-[250px_1fr]">
              <Sidebar
                view={view}
                go={go}
                counts={{ alerts: alerts.length, cams: cams.length }}
                dark={dark}
                setDark={setDark}
                query={query}
                setQuery={(q) => {
                  setQuery(q);
                  if (q) go("snapshots");
                }}
              />

              <main className="relative flex min-h-[620px] min-w-0 flex-col overflow-hidden border-(--cl) bg-(--cp) lg:m-2 lg:ml-0 lg:min-h-0 lg:rounded-xl lg:border">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    {view === "overview" && <OverviewView {...ctx} />}
                    {view === "snapshots" && <SnapshotsView {...ctx} onRun={runRound} />}
                    {view === "live" && <LiveView {...ctx} />}
                    {view === "cameras" && <CamerasView {...ctx} onToggle={toggleCam} />}
                    {view === "batches" && <BatchesView {...ctx} onRecord={record} />}
                    {view === "alerts" && <AlertsView {...ctx} onResolve={resolve} />}
                    {view === "activity" && <ActivityView {...ctx} />}
                    {view === "users" && <UsersView />}
                    {view === "farms" && <FarmsView {...ctx} />}
                    {view === "rules" && <RulesView onSave={() => flash("Alert rules saved")} />}
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>{open && <SnapshotModal key="modal" id={open} {...ctx} onClose={() => setOpen(null)} />}</AnimatePresence>

                <AnimatePresence>
                  {toast && (
                    <motion.div
                      role="status"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#22c55e]/30 bg-[#0f1a13] px-3 py-2 text-[13px] text-[#4ade80]"
                    >
                      ● {toast}
                    </motion.div>
                  )}
                </AnimatePresence>
              </main>
            </div>
          </div>
        </FadeUp>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="mono text-white/45">Illustrative preview · real camera frames from a Molt barn</p>
          <Link href="#demo" className="text-[15px] font-medium hover:text-orange">
            See how it fits your farm →
          </Link>
        </div>
      </div>
    </section>
  );
}

type Ctx = {
  cams: Cam[];
  rounds: Round[];
  latest: Round;
  scan: number | null;
  counting: Cam[];
  detected: number;
  alerts: Alert[];
  events: Event[];
  flock: Flock;
  alive: number;
  out: number;
  query: string;
  setQuery: (q: string) => void;
  go: (v: View) => void;
  setOpen: (id: string | null) => void;
};

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */

type NavItem = { id: View; label: string; Icon: typeof Users; count?: "alerts" | "cams" | number };
const NAV: { group?: string; items: NavItem[] }[] = [
  { items: [{ id: "overview", label: "Overview", Icon: LayoutGrid }] },
  {
    group: "Manage",
    items: [
      { id: "users", label: "Users", Icon: Users, count: 4 },
      { id: "farms", label: "Farms", Icon: Warehouse, count: 1 },
      { id: "live", label: "Live", Icon: Monitor },
      { id: "cameras", label: "Cameras", Icon: Camera, count: "cams" },
      { id: "snapshots", label: "Snapshots", Icon: Images },
      { id: "batches", label: "Batches", Icon: Circle, count: 1 },
    ],
  },
  {
    group: "Audit",
    items: [
      { id: "alerts", label: "Alerts", Icon: Bell, count: "alerts" },
      { id: "activity", label: "Activity", Icon: ActivityIcon },
    ],
  },
  { group: "Settings", items: [{ id: "rules", label: "Alert rules", Icon: SlidersHorizontal }] },
];

function Sidebar({
  view,
  go,
  counts,
  dark,
  setDark,
  query,
  setQuery,
}: {
  view: View;
  go: (v: View) => void;
  counts: { alerts: number; cams: number };
  dark: boolean;
  setDark: (d: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
}) {
  const all = NAV.flatMap((g) => g.items);
  return (
    <>
      {/* mobile */}
      <div className="border-b border-(--cl) px-3 py-3 lg:hidden">
        <Brand />
      </div>
      <div className="flex gap-1 overflow-x-auto border-b border-(--cl) px-2 py-2 lg:hidden">
        {all.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => go(id)}
            className={cn("flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[13px]", view === id ? "bg-(--ch) font-medium" : "text-(--cm)")}
          >
            <Icon className="size-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* desktop */}
      <aside className="hidden min-h-0 flex-col px-3 py-4 lg:flex">
        <Brand />
        <label className="mt-5 flex items-center gap-2 rounded-lg border border-(--cl) px-2.5 py-2 text-[13.5px] text-(--cm) focus-within:border-(--cm)">
          <Search className="size-4 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            aria-label="Search cameras and areas"
            className="w-full min-w-0 bg-transparent text-(--ct) outline-none placeholder:text-(--cm)"
          />
          <kbd className="whitespace-nowrap rounded border border-(--cl) bg-(--ch) px-1.5 text-[11px]">Ctrl K</kbd>
        </label>

        <nav className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {NAV.map((g, gi) => (
            <div key={gi} className={cn(g.group && "mt-5")}>
              {g.group && <p className="mb-1.5 px-2.5 text-[11.5px] font-medium uppercase tracking-[0.08em] text-(--cm)">{g.group}</p>}
              {g.items.map(({ id, label, Icon, count }) => {
                const n = count === "alerts" ? counts.alerts : count === "cams" ? counts.cams : count;
                return (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[14.5px] transition-colors",
                      view === id ? "bg-(--ch) font-medium" : "hover:bg-(--ch)",
                    )}
                  >
                    <Icon className="size-[17px] text-(--cm)" strokeWidth={1.7} />
                    {label}
                    {n != null && <span className="ml-auto text-[12.5px] tabular-nums text-(--cm)">{n}</span>}
                  </button>
                );
              })}
            </div>
          ))}
          <button onClick={() => setDark(!dark)} className="mt-1 flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[14.5px] hover:bg-(--ch)">
            {dark ? <Moon className="size-[17px] text-(--cm)" strokeWidth={1.7} /> : <Sun className="size-[17px] text-(--cm)" strokeWidth={1.7} />}
            {dark ? "Dark theme" : "Light theme"}
          </button>
        </nav>

        <div className="mt-3 flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
          <Avatar who="MA" />
          <div className="min-w-0 leading-tight">
            <p className="text-[14px] font-medium">Molt Admin</p>
            <p className="text-[12.5px] text-(--cm)">Farm owner</p>
          </div>
          <ChevronsUpDown className="ml-auto size-4 text-(--cm)" />
        </div>
      </aside>
    </>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <svg viewBox="0 0 900 900" className="size-9 rounded-lg" aria-hidden>
        <rect width="900" height="900" fill="#FFD60A" />
        <path d="M160 512 L384 334 Q392 328 393 338 L395 494 L168 670 Q160 676 160 664 Z" fill="#0B0C0F" />
        <path
          d="M395 494 L730 232 Q741 224 741 238 L741 576 Q741 582 736 586 L628 669 Q616 678 616 664 L615 522 Q614 510 604 518 L408 669 Q397 677 397 665 Z"
          fill="#0B0C0F"
        />
      </svg>
      <div className="leading-tight">
        <p className="text-[15px] font-semibold">Molt</p>
        <p className="text-[12.5px] text-(--cm)">Admin console</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                          */
/* ------------------------------------------------------------------ */

function Top({ title, sub, children, tabs }: { title: string; sub?: React.ReactNode; children?: React.ReactNode; tabs?: React.ReactNode }) {
  return (
    <div className="border-b border-(--cl) px-4 pt-4 md:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-4">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{title}</h3>
        {sub && <div className="text-[14px] text-(--cm)">{sub}</div>}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {children}
          <Search className="ml-1 hidden size-[18px] text-(--cm) sm:block" />
        </div>
      </div>
      {tabs}
    </div>
  );
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto p-4 md:p-6", className)}>{children}</div>;
}

function Card({
  title,
  link,
  onLink,
  children,
  className,
}: {
  title?: string;
  link?: string;
  onLink?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-(--cl) bg-(--cc)", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-(--cl) px-4 py-3">
          <p className="text-[14.5px] font-semibold">{title}</p>
          {link && (
            <button onClick={onLink} className="flex shrink-0 items-center gap-1 text-[13px] text-(--cm) hover:text-(--ct)">
              {link} <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

function Pill({ tone, children }: { tone: "green" | "violet" | "orange" | "gray" | "red"; children: React.ReactNode }) {
  const t = {
    green: "border-[#22c55e]/35 bg-[#22c55e]/12 text-[#2fbf6c]",
    violet: "border-[#8b5cf6]/40 bg-[#8b5cf6]/15 text-[#a78bfa]",
    orange: "border-[#f97316]/45 bg-[#f97316]/12 text-[#f5813a]",
    red: "border-[#ef4444]/40 bg-[#ef4444]/12 text-[#f06363]",
    gray: "border-(--cl) bg-(--ch) text-(--ct)",
  }[tone];
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-md border px-1.5 py-[1px] text-[12.5px] font-medium", t)}>{children}</span>;
}

function Avatar({ who }: { who: string }) {
  return (
    <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-[10.5px] font-bold text-white", who === "S" ? "bg-[#0d9488]" : "bg-[#16a34a]")}>
      {who}
    </span>
  );
}

function YellowBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-md bg-[#FFD60A] px-3 py-1.5 text-[13.5px] font-medium text-black transition hover:bg-[#ffe14a] disabled:opacity-75"
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 rounded-md border border-(--cl) bg-(--ch) px-2.5 py-1.5 text-[13px] hover:border-(--cm)">
      {children}
    </button>
  );
}

function Snap({ id, frame, className, sizes = "300px" }: { id: string; frame: "r1" | "r2"; className?: string; sizes?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-black", className)}>
      <Image src={`/snapshots/${id}-${frame}.webp`} alt={`Overhead snapshot of broiler chickens, area ${id.toUpperCase()}`} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={cn("relative inline-block h-5 w-9 shrink-0 rounded-full transition-colors", on ? "bg-[#22c55e]" : "bg-(--ch) ring-1 ring-(--cl)")}
    >
      <motion.span className="absolute top-0.5 size-4 rounded-full bg-white shadow" initial={false} animate={{ left: on ? 18 : 2 }} />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Views                                                                */
/* ------------------------------------------------------------------ */

function OverviewView({ cams, counting, alerts, events, flock, alive, out, latest, detected, go }: Ctx) {
  const kpis = [
    { Icon: Circle, label: "Live birds", value: fmt(alive), sub: "in 1 active batch" },
    { Icon: HeartPulse, label: "Mortality", value: `${((flock.dead / flock.placed) * 100).toFixed(1)}%`, sub: `${flock.dead} dead of ${fmt(flock.placed)} placed` },
    { Icon: Warehouse, label: "Farms", value: "1", sub: "1 barn · 12 areas" },
    { Icon: Camera, label: "Cameras counting", value: String(counting.length), of: `/ ${cams.length}`, sub: `${cams.filter((c) => !c.online).length} offline` },
    { Icon: Users, label: "Users", value: "4", sub: "1 owner · 3 staff" },
  ];
  const max = Math.max(...Object.values(latest.counts), 1);
  return (
    <>
      <Top title="Overview" sub="Green Farm · Barn 1" />
      <Body>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {kpis.map(({ Icon, label, value, of, sub }) => (
            <div key={label} className="rounded-xl border border-(--cl) bg-(--cc) p-4">
              <p className="flex items-center gap-2 text-[13.5px]">
                <Icon className="size-4 text-(--cm)" strokeWidth={1.7} /> {label}
              </p>
              <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
                {value}
                {of && <span className="ml-1 text-[15px] font-normal text-(--cm)">{of}</span>}
              </p>
              <p className="mt-2 text-[13px] text-(--cm)">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 xl:grid-cols-[1.25fr_1fr]">
          <div className="min-w-0 space-y-3">
            <Card title="Active batches" link="All batches" onLink={() => go("batches")}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-[14px]">
                  <thead className="text-(--cm)">
                    <tr className="border-b border-(--cl)">
                      <th className="px-4 py-2.5 text-left font-normal">Batch</th>
                      <th className="px-4 py-2.5 text-left font-normal">Farm</th>
                      <th className="px-4 py-2.5 text-right font-normal">Day</th>
                      <th className="px-4 py-2.5 text-right font-normal">Alive</th>
                      <th className="px-4 py-2.5 text-right font-normal">Mortality</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="cursor-pointer hover:bg-(--ch)" onClick={() => go("batches")}>
                      <td className="px-4 py-3 font-semibold">B2</td>
                      <td className="px-4 py-3">Green Farm</td>
                      <td className="px-4 py-3 text-right tabular-nums">{flock.day}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{fmt(alive)}</td>
                      <td className="px-4 py-3 text-right">
                        <Pill tone="green">{((flock.dead / flock.placed) * 100).toFixed(1)}%</Pill>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Open alerts" link="All alerts" onLink={() => go("alerts")}>
              {alerts.length === 0 ? <p className="px-4 py-5 text-[14px] text-(--cm)">All clear. No open alerts.</p> : alerts.slice(0, 4).map((a) => <AlertRow key={a.id} a={a} />)}
            </Card>

            <Card title={`Last round · ${fmt(detected)} birds seen`} link="Snapshots" onLink={() => go("snapshots")}>
              <div className="grid gap-x-6 gap-y-1.5 p-4 sm:grid-cols-2">
                {Object.entries(latest.counts).map(([id, n]) => (
                  <div key={id} className="grid grid-cols-[36px_1fr_36px] items-center gap-2 text-[12.5px]">
                    <span className="text-(--cm)">{id.toUpperCase()}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-(--ch)">
                      <motion.span className="block h-full rounded-full bg-[#FFD60A]" initial={false} animate={{ width: `${(n / max) * 100}%` }} />
                    </span>
                    <span className="text-right tabular-nums">{n}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="min-w-0 space-y-3">
            <Card title="Flock health">
              <div className="p-4">
                <div className="flex justify-between gap-3 text-[12px] uppercase tracking-[0.08em] text-(--cm)">
                  <span>Birds out of the flock</span>
                  <span className="normal-case tracking-normal">
                    {out} of {fmt(flock.placed)} placed
                  </span>
                </div>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-(--ch)">
                  {(
                    [
                      [flock.dead, "#ef4444"],
                      [flock.culled, "#f97316"],
                      [flock.sold, "#8b5cf6"],
                    ] as const
                  ).map(([n, c], i) => (
                    <motion.span key={i} className="h-full" style={{ background: c }} initial={false} animate={{ width: `${(n / Math.max(out, 1)) * 100}%` }} />
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-3 text-[13.5px]">
                  {(
                    [
                      ["Dead", flock.dead, "#ef4444"],
                      ["Culled", flock.culled, "#f97316"],
                      ["Sold", flock.sold, "#8b5cf6"],
                    ] as const
                  ).map(([l, n, c]) => (
                    <div key={l}>
                      <p className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full" style={{ background: c }} />
                        {l}
                      </p>
                      <p className="mt-0.5 font-semibold tabular-nums">{n}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card title="Recent activity" link="Audit log" onLink={() => go("activity")}>
              {events.slice(0, 5).map((e) => (
                <EventRow key={e.id} e={e} />
              ))}
            </Card>
          </div>
        </div>
      </Body>
    </>
  );
}

function AlertRow({ a, onResolve }: { a: Alert; onResolve?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-(--cl) px-4 py-2.5 text-[14px] last:border-b-0">
      <Pill tone={a.kind === "Camera offline" ? "orange" : "red"}>{a.kind}</Pill>
      <span className="font-medium">{a.title}</span>
      <span className="text-(--cm)">· Green Farm › B1 › {a.cam.toUpperCase()}</span>
      <span className="ml-auto text-[13px] text-(--cm)">{ago(a.min)}</span>
      {onResolve && (
        <button onClick={onResolve} className="rounded-md border border-(--cl) px-2 py-0.5 text-[12.5px] hover:bg-(--ch)">
          Resolve
        </button>
      )}
    </div>
  );
}

function EventRow({ e }: { e: Event }) {
  const good = e.tag.startsWith("batch") || e.tag.startsWith("round") || e.tag.endsWith(".on") || e.tag.endsWith("resolved");
  return (
    <div className="flex items-center gap-3 border-b border-(--cl) px-4 py-2.5 text-[14px] last:border-b-0">
      <Avatar who={e.who} />
      <span className="min-w-0 flex-1 truncate">{e.text}</span>
      <span className="hidden sm:inline">
        <Pill tone={good ? "green" : "gray"}>{e.tag}</Pill>
      </span>
      <span className="shrink-0 text-[13px] text-(--cm)">{ago(e.min)}</span>
    </div>
  );
}

function SnapshotsView({ cams, rounds, latest, scan, counting, query, setQuery, setOpen, onRun }: Ctx & { onRun: () => void }) {
  const [tab, setTab] = useState<"Latest" | "Rounds" | "Archive">("Latest");
  const ids = counting.map((c) => c.id);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cams.filter((c) => !q || `${c.id} ${c.area.toLowerCase()} cam-${c.id.slice(1)} green farm b1`.includes(q));
  }, [cams, query]);
  const good = Object.keys(latest.counts).length;
  return (
    <>
      <Top
        title="Snapshots"
        sub={
          scan != null ? (
            <Pill tone="violet">
              ● Counting {scan + 1} / {ids.length}
            </Pill>
          ) : (
            <Pill tone="green">
              ● Last round {good}/{good} good · {ago(latest.min)}
            </Pill>
          )
        }
        tabs={
          <div className="flex gap-5 text-[14.5px]">
            {(["Latest", "Rounds", "Archive"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn("border-b-2 pb-2.5", tab === t ? "border-(--ct) font-medium" : "border-transparent text-(--cm) hover:text-(--ct)")}
              >
                {t}
              </button>
            ))}
          </div>
        }
      >
        <YellowBtn onClick={onRun} disabled={scan != null}>
          <RefreshCw className={cn("size-4", scan != null && "animate-spin")} /> {scan != null ? "Running round…" : "Run a round now"}
        </YellowBtn>
      </Top>

      {tab === "Latest" && (
        <Body>
          <div className="mb-4 flex flex-wrap gap-2">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-(--cl) px-3 py-2 text-[13.5px] text-(--cm) sm:max-w-[320px]">
              <Search className="size-4 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search camera, ID, farm or area"
                className="w-full min-w-0 bg-transparent text-(--ct) outline-none placeholder:text-(--cm)"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X className="size-3.5" />
                </button>
              )}
            </label>
            <span className="rounded-lg border border-(--cl) px-3 py-2 text-[13.5px] text-(--cm)">
              Farm <b className="font-medium text-(--ct)">Green Farm</b>
            </span>
            <span className="rounded-lg border border-(--cl) px-3 py-2 text-[13.5px] text-(--cm)">
              Frames <b className="font-medium text-(--ct)">All</b>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {list.map((c) => {
              const n = latest.counts[c.id];
              const scanning = scan != null && ids[scan] === c.id;
              const photo = HAS_PHOTO.has(c.id) && c.online && n != null;
              return (
                <button
                  key={c.id}
                  disabled={!photo}
                  onClick={() => setOpen(c.id)}
                  className="group rounded-xl border border-(--cl) bg-(--cc) p-1.5 text-left transition-colors hover:border-(--cm) disabled:cursor-default disabled:hover:border-(--cl)"
                >
                  {photo ? (
                    <div className="relative">
                      <Snap id={c.id} frame={latest.frame} className="aspect-[5/4]" />
                      {scanning && (
                        <motion.span
                          className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-[#FFD60A]/50 to-transparent"
                          initial={{ top: "-20%" }}
                          animate={{ top: "100%" }}
                          transition={{ duration: 0.4, ease: "linear" }}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="grid aspect-[5/4] place-items-center rounded-md bg-(--ch) text-[13px] text-(--cm)">
                      <span className="flex flex-col items-center gap-1.5">
                        <Camera className="size-5" /> {c.online ? "Waiting for next round" : "Camera offline"}
                      </span>
                    </div>
                  )}
                  <div className="px-1.5 pb-1 pt-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14.5px] font-medium">{c.id}</span>
                      {photo ? <Pill tone="violet">{n} birds</Pill> : <Pill tone="orange">{c.online ? "Pending" : "Offline"}</Pill>}
                    </div>
                    <div className="mt-1 flex justify-between gap-2 text-[12.5px] text-(--cm)">
                      <span className="truncate">B1 › {c.area} · Green Farm</span>
                      <span className="hidden shrink-0 sm:inline">{photo ? ago(latest.min) : "13 minutes ago"}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          {list.length === 0 && <p className="py-10 text-center text-[14px] text-(--cm)">No cameras match “{query}”.</p>}
        </Body>
      )}

      {tab === "Rounds" && (
        <Body>
          <Card>
            {rounds.map((r, i) => {
              const total = Object.values(r.counts).reduce((s, n) => s + n, 0);
              const prev = rounds[i + 1];
              const pt = prev ? Object.values(prev.counts).reduce((s, n) => s + n, 0) : null;
              const k = Object.keys(r.counts).length;
              return (
                <div key={r.n} className="flex flex-wrap items-center gap-3 border-b border-(--cl) px-4 py-3 text-[14px] last:border-b-0">
                  <span className="w-[86px] font-semibold">Round {r.n}</span>
                  <Pill tone="green">
                    {k}/{k} good
                  </Pill>
                  <span className="tabular-nums">{fmt(total)} birds seen</span>
                  {pt != null && (
                    <span className={cn("text-[13px]", total >= pt ? "text-[#2fbf6c]" : "text-[#f5813a]")}>
                      {total >= pt ? "▲" : "▼"} {Math.abs(total - pt)}
                    </span>
                  )}
                  <div className="ml-auto hidden gap-1 md:flex">
                    {Object.keys(r.counts)
                      .slice(0, 5)
                      .map((id) => (
                        <Snap key={id} id={id} frame={r.frame} className="h-8 w-10" sizes="40px" />
                      ))}
                  </div>
                  <span className="ml-auto text-right text-[13px] text-(--cm) md:ml-0 md:w-[120px]">{ago(r.min)}</span>
                </div>
              );
            })}
          </Card>
        </Body>
      )}

      {tab === "Archive" && (
        <Body>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Batch B1", "42 days · 1,512 placed", "2,184 frames"],
              ["October 2026", "Rounds 1 – 38", "3,402 frames"],
              ["September 2026", "Pilot setup", "416 frames"],
            ].map(([t, s, f], i) => (
              <div key={t} className="rounded-xl border border-(--cl) bg-(--cc) p-1.5">
                <div className="grid grid-cols-2 gap-1">
                  {["a3", "a9", "a10", "a11"].map((id, k) => (
                    <Snap key={id} id={id} frame={(i + k) % 2 ? "r1" : "r2"} className="aspect-[5/4] opacity-85" sizes="120px" />
                  ))}
                </div>
                <div className="px-1.5 pb-1 pt-2">
                  <p className="text-[14.5px] font-medium">{t}</p>
                  <p className="text-[12.5px] text-(--cm)">
                    {s} · {f}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Body>
      )}
    </>
  );
}

function SnapshotModal({ id, latest, counting, setOpen, onClose }: Ctx & { id: string; onClose: () => void }) {
  const ids = counting.map((c) => c.id).filter((x) => latest.counts[x] != null);
  const i = Math.max(0, ids.indexOf(id));
  const n = latest.counts[id] ?? 0;
  const conf = 64 + ((n * 7) % 27);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setOpen(ids[(i + 1) % ids.length]);
      if (e.key === "ArrowLeft") setOpen(ids[(i - 1 + ids.length) % ids.length]);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [i, ids, onClose, setOpen]);

  return (
    <motion.div
      className="absolute inset-0 z-20 grid place-items-center overflow-y-auto bg-black/70 p-3 backdrop-blur-[2px] md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-label={`Snapshot ${id}`}
        initial={{ y: 14, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 14, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[860px] rounded-xl border border-(--cl) bg-(--cc) text-(--ct)"
      >
        <div className="flex items-start justify-between px-5 pt-4">
          <div>
            <p className="text-[16px] font-semibold">{id}</p>
            <p className="text-[13.5px] text-(--cm)">Green Farm › B1 › {id.toUpperCase()}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-(--cm) hover:bg-(--ch) hover:text-(--ct)">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 pt-3">
          <Snap id={id} frame={latest.frame} className="aspect-[16/10] w-full" sizes="(min-width: 1024px) 820px, 95vw" />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-5 pt-3 text-[13.5px]">
          <span className="font-semibold">Nov 19, 2026 · 08:42</span>
          <span className="text-(--cm)">{ago(latest.min)}</span>
          <Pill tone="green">Good</Pill>
          <Pill tone="violet">{n} birds</Pill>
          <span className="text-(--cm)">
            confidence {conf}% · round {latest.n}
          </span>
          <span className="w-full text-[12.5px] text-(--cm) md:ml-auto md:w-auto">1920×1080 · 643 KB · light 102 · grabbed in 6.4 s</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-(--cl) px-5 py-3">
          <div className="flex items-center gap-1.5 text-[13px] text-(--cm)">
            <button onClick={() => setOpen(ids[(i - 1 + ids.length) % ids.length])} aria-label="Previous camera" className="rounded border border-(--cl) p-1 hover:bg-(--ch)">
              <ArrowLeft className="size-3.5" />
            </button>
            <button onClick={() => setOpen(ids[(i + 1) % ids.length])} aria-label="Next camera" className="rounded border border-(--cl) p-1 hover:bg-(--ch)">
              <ArrowRight className="size-3.5" />
            </button>
            {i + 1} of {ids.length}
          </div>
          <a
            href={`/snapshots/${id}-${latest.frame}.webp`}
            download={`molt-${id}-round-${latest.n}.webp`}
            className="flex items-center gap-1.5 rounded-md border border-(--cl) px-3 py-1.5 text-[13.5px] font-medium hover:bg-(--ch)"
          >
            <Download className="size-4" /> Download
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LiveView({ cams, latest }: Ctx) {
  const live = cams.filter((c) => c.online && HAS_PHOTO.has(c.id));
  const [sel, setSel] = useState("a2");
  const cur = live.find((c) => c.id === sel) ?? live[0];
  const [now, setNow] = useState("08:42:39");
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-GB"));
    const first = setTimeout(tick, 0);
    const t = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);
  if (!cur) return <Top title="Live" sub="No cameras switched on" />;
  return (
    <>
      <Top title="Live" sub={<Pill tone="red">● {live.length} streams</Pill>} />
      <Body className="grid content-start gap-3 xl:grid-cols-[1fr_200px]">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
          <motion.div
            key={cur.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1.07 }}
            transition={{ opacity: { duration: 0.4 }, scale: { duration: 14, ease: "linear" } }}
          >
            <Image
              src={cur.id === "a2" ? "/snapshots/live-a2.webp" : `/snapshots/${cur.id}-${latest.frame}.webp`}
              alt={`Live view of area ${cur.area}`}
              fill
              sizes="(min-width: 1024px) 760px, 95vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 text-[12.5px] text-white">
            <span className="size-2 animate-blink rounded-full bg-[#ef4444]" /> LIVE · cam-{cur.id.slice(1)}
          </div>
          <div className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 font-mono text-[12px] tabular-nums text-white/90">{now}</div>
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 rounded-md bg-black/60 px-2.5 py-1.5 text-[12.5px] text-white">
            <span>Green Farm › B1 › {cur.area}</span>
            <span className="flex items-center gap-2">
              <span className="rounded border border-[#8b5cf6]/50 bg-[#8b5cf6]/25 px-1.5 text-[#cdbbff]">{latest.counts[cur.id] ?? 0} birds · last round</span>
              1080p · 15 fps
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-1">
          {live.map((c) => (
            <button
              key={c.id}
              onClick={() => setSel(c.id)}
              className={cn("relative rounded-lg border p-1 text-left", c.id === cur.id ? "border-[#FFD60A]" : "border-(--cl) hover:border-(--cm)")}
            >
              <Snap id={c.id} frame={latest.frame} className="aspect-video" sizes="200px" />
              <span className="absolute left-2 top-2 rounded bg-black/60 px-1 text-[10.5px] text-white">{c.id}</span>
            </button>
          ))}
        </div>
      </Body>
    </>
  );
}

function CamerasView({ cams, latest, onToggle }: Ctx & { onToggle: (id: string) => void }) {
  return (
    <>
      <Top title="Cameras" sub={`${cams.filter((c) => c.online).length} of ${cams.length} switched on`} />
      <Body>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[580px] text-[14px]">
              <thead className="text-(--cm)">
                <tr className="border-b border-(--cl)">
                  {["Camera", "Location", "Status", "Last count", "Power"].map((h) => (
                    <th key={h} className={cn("px-4 py-2.5 text-left font-normal", h === "Power" && "text-right")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cams.map((c) => (
                  <tr key={c.id} className="border-b border-(--cl) last:border-b-0 hover:bg-(--ch)">
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-2.5">
                        {HAS_PHOTO.has(c.id) && c.online ? (
                          <Snap id={c.id} frame={latest.frame} className="h-8 w-11" sizes="44px" />
                        ) : (
                          <span className="grid h-8 w-11 place-items-center rounded-md bg-(--ch)">
                            <Camera className="size-3.5 text-(--cm)" />
                          </span>
                        )}
                        <span className="font-medium">cam-{c.id.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-(--cm)">Green Farm › B1 › {c.area}</td>
                    <td className="px-4 py-2.5">{c.online ? <Pill tone="green">Online</Pill> : <Pill tone="orange">Offline</Pill>}</td>
                    <td className="px-4 py-2.5 tabular-nums">
                      {c.online && latest.counts[c.id] != null ? `${latest.counts[c.id]} birds` : c.online ? "Next round" : "No frame"}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Toggle on={c.online} onClick={() => onToggle(c.id)} label={`Switch cam-${c.id.slice(1)} ${c.online ? "off" : "on"}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </Body>
    </>
  );
}

function BatchesView({ flock, alive, onRecord }: Ctx & { onRecord: (k: "dead" | "culled" | "sold") => void }) {
  const rows = [
    { id: "B2", placed: flock.placed, day: flock.day, alive, mort: (flock.dead / flock.placed) * 100, status: "Active" },
    { id: "B1", placed: 1512, day: 42, alive: 1485, mort: 1.8, status: "Closed" },
  ];
  return (
    <>
      <Top title="Batches" sub="Green Farm">
        <GhostBtn onClick={() => onRecord("dead")}>+ Dead</GhostBtn>
        <GhostBtn onClick={() => onRecord("culled")}>+ Culled</GhostBtn>
        <GhostBtn onClick={() => onRecord("sold")}>+ Sold</GhostBtn>
      </Top>
      <Body>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-[14px]">
              <thead className="text-(--cm)">
                <tr className="border-b border-(--cl)">
                  {["Batch", "Placed", "Day", "Alive", "Mortality", "Status"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-(--cl) last:border-b-0">
                    <td className="px-4 py-3 font-semibold">{r.id}</td>
                    <td className="px-4 py-3 tabular-nums">{fmt(r.placed)}</td>
                    <td className="px-4 py-3 tabular-nums">{r.day} / 42</td>
                    <td className="px-4 py-3 tabular-nums">{fmt(r.alive)}</td>
                    <td className="px-4 py-3">
                      <Pill tone={r.mort < 1 ? "green" : "orange"}>{r.mort.toFixed(1)}%</Pill>
                    </td>
                    <td className="px-4 py-3">
                      <Pill tone={r.status === "Active" ? "green" : "gray"}>{r.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Placed", fmt(flock.placed)],
              ["Dead", flock.dead],
              ["Culled", flock.culled],
              ["Sold", flock.sold],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="rounded-xl border border-(--cl) bg-(--cc) p-4">
              <p className="text-[13px] text-(--cm)">{k}</p>
              <p className="mt-1 text-[24px] font-semibold tabular-nums">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-(--cl) bg-(--cc) p-4">
          <div className="flex justify-between text-[13px] text-(--cm)">
            <span>Cycle progress · B2</span>
            <span>Day {flock.day} of 42</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-(--ch)">
            <div className="h-full rounded-full bg-[#FFD60A]" style={{ width: `${(flock.day / 42) * 100}%` }} />
          </div>
        </div>
      </Body>
    </>
  );
}

function AlertsView({ alerts, onResolve }: Ctx & { onResolve: (id: number) => void }) {
  return (
    <>
      <Top title="Alerts" sub={`${alerts.length} open`} />
      <Body>
        <Card>
          {alerts.length === 0 ? (
            <p className="px-4 py-8 text-center text-[14px] text-(--cm)">All clear. Every alert has been resolved.</p>
          ) : (
            alerts.map((a) => <AlertRow key={a.id} a={a} onResolve={() => onResolve(a.id)} />)
          )}
        </Card>
      </Body>
    </>
  );
}

function ActivityView({ events }: Ctx) {
  return (
    <>
      <Top title="Activity" sub="Audit log" />
      <Body>
        <Card>
          {events.map((e) => (
            <EventRow key={e.id} e={e} />
          ))}
        </Card>
      </Body>
    </>
  );
}

function UsersView() {
  const people = [
    ["MA", "Molt Admin", "Owner", "All farms", "Online now"],
    ["RK", "Ravi K.", "Manager", "Green Farm", "2 hours ago"],
    ["SP", "Sanduni P.", "Supervisor", "Green Farm › B1", "Yesterday"],
    ["DN", "Dilan N.", "Staff", "Green Farm › B1", "3 days ago"],
  ];
  return (
    <>
      <Top title="Users" sub="1 owner · 3 staff" />
      <Body>
        <Card>
          {people.map(([i, n, r, s, l]) => (
            <div key={n} className="flex flex-wrap items-center gap-3 border-b border-(--cl) px-4 py-3 text-[14px] last:border-b-0">
              <Avatar who={i} />
              <span className="font-medium">{n}</span>
              <Pill tone={r === "Owner" ? "violet" : "gray"}>{r}</Pill>
              <span className="text-(--cm)">{s}</span>
              <span className="ml-auto text-[13px] text-(--cm)">{l}</span>
            </div>
          ))}
        </Card>
      </Body>
    </>
  );
}

function FarmsView({ cams, alive, latest }: Ctx) {
  return (
    <>
      <Top title="Farms" sub="1 farm" />
      <Body>
        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr]">
          <Card>
            <div className="grid grid-cols-4 gap-1 p-1.5">
              {Object.keys(latest.counts)
                .slice(0, 8)
                .map((id) => (
                  <Snap key={id} id={id} frame={latest.frame} className="aspect-[5/4]" sizes="120px" />
                ))}
            </div>
            <div className="p-4">
              <p className="text-[18px] font-semibold">Green Farm</p>
              <p className="text-[13.5px] text-(--cm)">1 barn · 12 areas · {cams.length} cameras · batch B2</p>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Live birds", fmt(alive)],
              ["Cameras on", `${cams.filter((c) => c.online).length} / ${cams.length}`],
              ["Areas", "12"],
              ["Barns", "1"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-(--cl) bg-(--cc) p-4">
                <p className="text-[13px] text-(--cm)">{k}</p>
                <p className="mt-1 text-[24px] font-semibold tabular-nums">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </Body>
    </>
  );
}

function RulesView({ onSave }: { onSave: () => void }) {
  const [rules, setRules] = useState([
    { t: "Camera offline", d: "No frame for 10 minutes", on: true },
    { t: "Count drop", d: "An area drops more than 20% between rounds", on: true },
    { t: "Daily mortality", d: "Dead birds above 0.5% in a day", on: true },
    { t: "Dark frame", d: "Snapshot light level below 40", on: false },
  ]);
  return (
    <>
      <Top title="Alert rules" sub="Green Farm">
        <YellowBtn onClick={onSave}>
          <Save className="size-4" /> Save rules
        </YellowBtn>
      </Top>
      <Body>
        <Card>
          {rules.map((r, i) => (
            <div key={r.t} className="flex items-center gap-4 border-b border-(--cl) px-4 py-3.5 last:border-b-0">
              <div className="flex-1">
                <p className="text-[14.5px] font-medium">{r.t}</p>
                <p className="text-[13px] text-(--cm)">{r.d}</p>
              </div>
              <Toggle on={r.on} label={r.t} onClick={() => setRules((p) => p.map((x, k) => (k === i ? { ...x, on: !x.on } : x)))} />
            </div>
          ))}
        </Card>
      </Body>
    </>
  );
}
