"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Bell, ChevronLeft, ChevronRight, Home, Layers, Radio, RefreshCw, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Illustrative, clickable Molt app. Rendered at a fixed 300×610 so that
 * callout dots in the "Explore the app" section can target exact spots on
 * the home screen.
 * Layout map (y): status 14–38 · greeting 50–96 · stats 106–196 ·
 * tiles 206–262 · farm header 274–310 · areas 316–524 · tab bar 548–610
 */
export const PHONE_W = 300;
export const PHONE_H = 610;

const AREAS = ["A1", "A2", "A3", "A4"];
const RECORDED = [200, 200, 199, 200];
/** Last camera count shown by default (illustrative sample values). */
const LAST_COUNT = [198, 196, 191, 200];
const FRAMES = ["a2", "a3", "a5", "a11"];

type Screen = { tab: "home" | "batches" | "live" | "settings"; area?: number };

export function Phone({
  className,
  detected,
  onNavigate,
}: {
  className?: string;
  /** called with true when the home screen is showing */
  onNavigate?: (home: boolean) => void;
  /** optional per-area counts from a fresh run; defaults to the last count */
  detected?: (number | null)[];
}) {
  const [screen, setScreenState] = useState<Screen>({ tab: "home" });
  const setScreen = (s: Screen) => {
    setScreenState(s);
    onNavigate?.(s.tab === "home" && s.area == null);
  };
  const [counts, setCounts] = useState(() => AREAS.map((_, i) => detected?.[i] ?? LAST_COUNT[i]));
  const [freshAt, setFreshAt] = useState<number | null>(null);
  const [counting, setCounting] = useState(false);
  const [alerts, setAlerts] = useState({ offline: true, drop: true, daily: false });
  const total = counts.reduce((a, b) => a + b, 0);
  const when = freshAt != null ? "Just now" : "18 min ago";

  const recount = () => {
    if (counting) return;
    setCounting(true);
    setTimeout(() => {
      setCounts(AREAS.map((_, i) => Math.min(RECORDED[i], LAST_COUNT[i] + Math.round(Math.random() * 2))));
      setFreshAt(0);
      setCounting(false);
    }, 1100);
  };

  const key = screen.area != null ? `area-${screen.area}` : screen.tab;

  return (
    <div
      className={cn(
        "relative select-none overflow-hidden rounded-[44px] border-[7px] border-[#1a1c21] bg-[#f6f7f9] text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)]",
        className,
      )}
      style={{ width: PHONE_W, height: PHONE_H }}
    >
      {/* status bar */}
      <div className="absolute inset-x-0 top-[10px] z-10 flex items-center justify-between px-[22px] text-[11.5px] font-semibold">
        <span>9:41</span>
        <span className="absolute left-1/2 top-[-2px] h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-[#1a1c21]" />
        <span className="flex items-center gap-1">
          <span className="flex items-end gap-[1.5px]">
            {[4, 6, 8].map((h) => (
              <span key={h} className="w-[2.5px] rounded-[1px] bg-ink" style={{ height: h }} />
            ))}
          </span>
          <span className="ml-1 h-[9px] w-[18px] rounded-[3px] border border-ink/70 p-[1px]">
            <span className="block h-full w-[70%] rounded-[1px] bg-ink" />
          </span>
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          className="absolute inset-x-0 bottom-[62px] top-0"
          initial={{ opacity: 0, x: screen.area != null ? 24 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {screen.area != null ? (
            <AreaScreen
              i={screen.area}
              count={counts[screen.area]}
              when={when}
              onBack={() => setScreen({ tab: screen.tab })}
              onRecount={recount}
              counting={counting}
            />
          ) : screen.tab === "home" ? (
            <HomeScreen
              counts={counts}
              total={total}
              when={when}
              fresh={freshAt != null}
              onArea={(i) => setScreen({ tab: "home", area: i })}
              onTab={(tab) => setScreen({ tab })}
              onRecount={recount}
              counting={counting}
            />
          ) : screen.tab === "batches" ? (
            <BatchesScreen />
          ) : screen.tab === "live" ? (
            <LiveScreen onArea={(i) => setScreen({ tab: "live", area: i })} counts={counts} />
          ) : (
            <SettingsScreen alerts={alerts} setAlerts={setAlerts} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* tab bar */}
      <div className="absolute inset-x-0 bottom-0 flex h-[62px] items-start justify-around border-t border-ink/8 bg-white pt-[9px]">
        {(
          [
            { l: "Home", I: Home, t: "home" },
            { l: "Batches", I: Layers, t: "batches" },
            { l: "Live", I: Radio, t: "live" },
            { l: "Settings", I: Settings, t: "settings" },
          ] as const
        ).map(({ l, I, t }) => {
          const on = screen.tab === t;
          return (
            <button
              key={l}
              onClick={() => setScreen({ tab: t })}
              className={cn("flex w-[60px] flex-col items-center gap-[3px] text-[9.5px]", on ? "font-semibold text-ink" : "text-slate")}
            >
              <I className="size-[16px]" strokeWidth={on ? 2.2 : 1.8} />
              {l}
              <span className={cn("mt-[1px] h-[3px] w-[16px] rounded-full", on ? "bg-orange" : "bg-transparent")} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function HomeScreen({
  counts,
  total,
  when,
  fresh,
  onArea,
  onTab,
  onRecount,
  counting,
}: {
  counts: number[];
  total: number;
  when: string;
  fresh: boolean;
  onArea: (i: number) => void;
  onTab: (t: Screen["tab"]) => void;
  onRecount: () => void;
  counting: boolean;
}) {
  return (
    <>
      <div className="absolute left-[16px] right-[16px] top-[46px] flex items-start justify-between">
        <div>
          <div className="text-[19px] font-semibold tracking-[-0.03em]">Good morning!</div>
          <div className="text-[12px] text-slate">Here’s your farm at a glance.</div>
        </div>
        <button onClick={onRecount} aria-label="Refresh counts" className="mt-1 grid size-[28px] place-items-center rounded-full bg-white active:scale-95">
          <RefreshCw className={cn("size-[13px]", counting && "animate-spin")} />
        </button>
      </div>

      <div className="absolute inset-x-[12px] top-[100px] grid h-[90px] grid-cols-2 gap-[6px]">
        <button onClick={() => onTab("live")} className="rounded-[14px] bg-white p-[10px] text-left shadow-[0_1px_0_rgba(0,0,0,.04)] active:scale-[.98]">
          <div className="text-[10.5px] text-slate">Detected birds</div>
          <div className="mt-[4px] text-[22px] font-semibold leading-none tracking-[-0.04em] tabular-nums">
            {counting ? "…" : total} <span className="text-[11px] font-medium text-slate">birds</span>
          </div>
          <div className="mt-[6px] text-[9.5px] text-slate">{counting ? "Counting now" : fresh ? "Fresh camera count" : `Last count ${when.toLowerCase()}`}</div>
        </button>
        <button onClick={() => onTab("batches")} className="rounded-[14px] bg-ink p-[10px] text-left text-white active:scale-[.98]">
          <div className="text-[10.5px] text-white/60">Recorded flock</div>
          <div className="mt-[4px] text-[22px] font-semibold leading-none tracking-[-0.04em]">
            799 <span className="text-[11px] font-medium text-white/60">birds</span>
          </div>
          <div className="mt-[6px] text-[9.5px] text-white/60">From flock records</div>
        </button>
      </div>

      <div className="absolute inset-x-[12px] top-[200px] grid h-[56px] grid-cols-3 gap-[6px]">
        {(
          [
            { label: "Batches", icon: Layers, t: "batches" },
            { label: "Live cameras", icon: Radio, t: "live" },
            { label: "Area status", icon: Home, t: "home" },
          ] as const
        ).map(({ label, icon: Icon, t }) => (
          <button
            key={label}
            onClick={() => (t === "home" ? onArea(2) : onTab(t))}
            className="flex flex-col justify-between rounded-[12px] bg-white p-[8px] text-left active:scale-[.97]"
          >
            <Icon className="size-[13px] text-sun-deep" strokeWidth={2} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>

      <div className="absolute inset-x-[16px] top-[270px] flex items-end justify-between">
        <div>
          <div className="text-[10px] text-slate">Your farm</div>
          <div className="text-[15px] font-semibold tracking-[-0.03em]">Barn 01</div>
        </div>
        <div className="text-[9.5px] text-slate">799 recorded · 4 areas</div>
      </div>

      <div className="absolute inset-x-[12px] top-[312px] space-y-[4px]">
        {AREAS.map((a, i) => {
          const d = counts[i];
          return (
            <button
              key={a}
              onClick={() => onArea(i)}
              className="flex h-[48px] w-full items-center gap-[10px] rounded-[12px] bg-white px-[10px] text-left transition-colors hover:bg-[#fffbe6] active:scale-[.99]"
            >
              <span className="grid size-[28px] place-items-center rounded-[8px] bg-paper-2 text-[11px] font-semibold">{a}</span>
              <div className="flex-1 leading-tight">
                <div className="text-[12px] font-semibold tabular-nums">{counting ? "Counting…" : `${d} birds`}</div>
                <div className="text-[9.5px] text-slate">
                  {when} · Recorded {RECORDED[i]}
                </div>
              </div>
              <span className={cn("size-[6px] rounded-full", d < RECORDED[i] * 0.97 ? "bg-orange" : "bg-leaf")} />
              <ChevronRight className="size-[14px] text-slate" />
            </button>
          );
        })}
      </div>
    </>
  );
}

function Header({ title, sub, onBack }: { title: string; sub?: string; onBack?: () => void }) {
  return (
    <div className="absolute left-[12px] right-[16px] top-[44px] flex items-center gap-2">
      {onBack && (
        <button onClick={onBack} aria-label="Back" className="grid size-[28px] place-items-center rounded-full bg-white">
          <ChevronLeft className="size-[15px]" />
        </button>
      )}
      <div className={cn(!onBack && "pl-[4px]")}>
        <div className="text-[18px] font-semibold leading-tight tracking-[-0.03em]">{title}</div>
        {sub && <div className="text-[11px] text-slate">{sub}</div>}
      </div>
    </div>
  );
}

function AreaScreen({
  i,
  count,
  when,
  onBack,
  onRecount,
  counting,
}: {
  i: number;
  count: number;
  when: string;
  onBack: () => void;
  onRecount: () => void;
  counting: boolean;
}) {
  const diff = RECORDED[i] - count;
  return (
    <>
      <Header title={`Area ${AREAS[i]}`} sub={`Barn 01 · Cam 0${i + 1}`} onBack={onBack} />
      <div className="absolute inset-x-[12px] top-[96px] space-y-[6px]">
        <div className="relative h-[168px] overflow-hidden rounded-[14px] bg-black">
          <Image src={`/snapshots/${FRAMES[i]}-r2.webp`} alt={`Camera view of area ${AREAS[i]}`} fill sizes="280px" className="object-cover" />
          <span className="absolute left-[8px] top-[8px] flex items-center gap-1 rounded-full bg-black/60 px-[7px] py-[2px] text-[9px] font-semibold text-white">
            <span className="size-[5px] animate-blink rounded-full bg-[#ef4444]" /> LIVE
          </span>
          <span className="absolute bottom-[8px] right-[8px] rounded-full bg-[#7c5cff]/85 px-[7px] py-[2px] text-[9px] font-semibold text-white">
            {counting ? "Counting…" : `${count} birds`}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-[6px]">
          <Stat k="Detected" v={`${count}`} />
          <Stat k="Recorded" v={`${RECORDED[i]}`} dark />
          <Stat k="Difference" v={diff === 0 ? "Matches" : `${diff} birds`} />
          <Stat k="Counted" v={counting ? "Now" : when} />
        </div>
        <button
          onClick={onRecount}
          className="flex h-[38px] w-full items-center justify-center gap-2 rounded-[12px] bg-orange text-[12px] font-semibold active:scale-[.98]"
        >
          <RefreshCw className={cn("size-[13px]", counting && "animate-spin")} /> {counting ? "Counting…" : "Recount this area"}
        </button>
      </div>
    </>
  );
}

function Stat({ k, v, dark }: { k: string; v: string; dark?: boolean }) {
  return (
    <div className={cn("rounded-[12px] p-[9px]", dark ? "bg-ink text-white" : "bg-white")}>
      <div className={cn("text-[9.5px]", dark ? "text-white/60" : "text-slate")}>{k}</div>
      <div className="mt-[2px] text-[15px] font-semibold tracking-[-0.03em] tabular-nums">{v}</div>
    </div>
  );
}

function BatchesScreen() {
  const [open, setOpen] = useState(0);
  const rows = [
    { id: "Batch 14", s: "Active · day 38 of 42", birds: "799 birds", loss: "7 losses", pct: 90 },
    { id: "Batch 13", s: "Closed · 42 days", birds: "786 sold", loss: "14 losses", pct: 100 },
    { id: "Batch 12", s: "Closed · 41 days", birds: "791 sold", loss: "9 losses", pct: 100 },
  ];
  return (
    <>
      <Header title="Batches" sub="Barn 01 · 3 records" />
      <div className="absolute inset-x-[12px] top-[100px] space-y-[6px]">
        {rows.map((r, i) => (
          <button key={r.id} onClick={() => setOpen(i)} className={cn("w-full rounded-[14px] p-[11px] text-left", open === i ? "bg-ink text-white" : "bg-white")}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold">{r.id}</span>
              <span className={cn("rounded-full px-[7px] py-[1px] text-[9px] font-semibold", i === 0 ? "bg-orange text-ink" : open === i ? "bg-white/15" : "bg-paper-2")}>
                {i === 0 ? "Active" : "Closed"}
              </span>
            </div>
            <div className={cn("text-[10px]", open === i ? "text-white/60" : "text-slate")}>{r.s}</div>
            {open === i && (
              <>
                <div className="mt-[8px] flex justify-between text-[11px]">
                  <span>{r.birds}</span>
                  <span className="text-white/60">{r.loss}</span>
                </div>
                <div className="mt-[6px] h-[4px] overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-orange" style={{ width: `${r.pct}%` }} />
                </div>
              </>
            )}
          </button>
        ))}
      </div>
    </>
  );
}

function LiveScreen({ onArea, counts }: { onArea: (i: number) => void; counts: number[] }) {
  return (
    <>
      <Header title="Live cameras" sub="4 of 4 online" />
      <div className="absolute inset-x-[12px] top-[100px] grid grid-cols-2 gap-[6px]">
        {AREAS.map((a, i) => (
          <button key={a} onClick={() => onArea(i)} className="overflow-hidden rounded-[12px] bg-white text-left active:scale-[.98]">
            <div className="relative h-[92px] bg-black">
              <Image src={`/snapshots/${FRAMES[i]}-r2.webp`} alt={`Camera view of area ${a}`} fill sizes="140px" className="object-cover" />
              <span className="absolute left-[5px] top-[5px] size-[6px] animate-blink rounded-full bg-[#ef4444]" />
            </div>
            <div className="flex items-center justify-between px-[8px] py-[6px]">
              <span className="text-[11px] font-semibold">{a}</span>
              <span className="text-[9.5px] text-slate tabular-nums">{counts[i]} birds</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

function SettingsScreen({
  alerts,
  setAlerts,
}: {
  alerts: { offline: boolean; drop: boolean; daily: boolean };
  setAlerts: React.Dispatch<React.SetStateAction<{ offline: boolean; drop: boolean; daily: boolean }>>;
}) {
  const items = [
    { k: "offline", t: "Camera offline", d: "Tell me when a camera drops" },
    { k: "drop", t: "Count changes", d: "Big gaps against the record" },
    { k: "daily", t: "Daily summary", d: "Every morning at 7:00" },
  ] as const;
  return (
    <>
      <Header title="Settings" sub="Owner · Barn 01" />
      <div className="absolute inset-x-[12px] top-[100px] space-y-[6px]">
        <div className="flex items-center gap-[10px] rounded-[14px] bg-white p-[11px]">
          <span className="grid size-[32px] place-items-center rounded-full bg-orange text-[11px] font-bold">MA</span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold">Molt Admin</div>
            <div className="text-[10px] text-slate">Owner · signed in with SMS code</div>
          </div>
        </div>
        <div className="flex items-center gap-[6px] px-[4px] pt-[4px] text-[10px] font-semibold uppercase tracking-[0.06em] text-slate">
          <Bell className="size-[11px]" /> Notifications
        </div>
        {items.map(({ k, t, d }) => (
          <button
            key={k}
            onClick={() => setAlerts((p) => ({ ...p, [k]: !p[k] }))}
            className="flex w-full items-center justify-between rounded-[14px] bg-white p-[11px] text-left"
            role="switch"
            aria-checked={alerts[k]}
          >
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold">{t}</div>
              <div className="text-[10px] text-slate">{d}</div>
            </div>
            <span className={cn("relative h-[20px] w-[34px] rounded-full transition-colors", alerts[k] ? "bg-leaf" : "bg-paper-3")}>
              <motion.span className="absolute top-[2px] size-[16px] rounded-full bg-white shadow" initial={false} animate={{ left: alerts[k] ? 16 : 2 }} />
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
