import Link from "next/link";
import { CubeIcon, RevealHeading, type Glyph } from "@/components/primitives";
import { NAV } from "@/lib/content";

const BELT: { label: string; glyph: Glyph }[] = [
  { label: "Count, A2", glyph: "count" },
  { label: "Cam 04, live", glyph: "camera" },
  { label: "Batch 14 placed", glyph: "batch" },
  { label: "Cull, A3", glyph: "record" },
  { label: "Incident, A1", glyph: "bell" },
  { label: "Worker invited", glyph: "team" },
  { label: "Barn 01", glyph: "barn" },
  { label: "SMS sign-in", glyph: "phone" },
];

export function Footer() {
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-ink text-white">
      <div className="wrap grid gap-12 pb-16 pt-20 md:grid-cols-2 md:pt-24">
        <RevealHeading
          as="p"
          dark
          className="display-md max-w-[16ch]"
          lines={[{ text: "A clearer view of your farm." }, { text: "Camera monitoring and flock records, together.", muted: true }]}
        />
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="mono mb-3 text-white/55">Molt</p>
            <ul className="space-y-1.5 text-[16px]">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-orange">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono mb-3 text-white/55">More</p>
            <ul className="space-y-1.5 text-[16px]">
              <li><Link href="#demo" className="hover:text-orange">Request a demo</Link></li>
              <li><Link href="#top" className="hover:text-orange">Back to top</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* activity belt */}
      <div className="relative mt-6">
        <div className="pointer-events-none absolute left-1/2 top-[-22px] z-10 hidden h-[108px] w-[86px] -translate-x-1/2 border border-leaf/80 md:block">
          <span className="mono absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-leaf">In view</span>
        </div>
        <div className="flex w-max animate-marquee [animation-duration:46s]">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0" aria-hidden>
              {[...BELT, ...BELT].map((b, i) => (
                <div key={i} className="flex w-[136px] flex-col items-center gap-2">
                  <span className="mono whitespace-nowrap text-[10px] text-white/75">{b.label}</span>
                  <CubeIcon glyph={b.glyph} size={46} dark orange={i % 3 !== 1} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 border-t border-white/15">
          <div className="flex w-max animate-marquee [animation-duration:46s]">
            {Array.from({ length: 160 }).map((_, i) => (
              <span key={i} className="mx-[9px] mt-[-5px] size-[9px] shrink-0 rounded-full border border-white/30 bg-ink" />
            ))}
          </div>
        </div>
      </div>

      <div className="wrap mono flex flex-col justify-between gap-2 py-6 text-white/55 sm:flex-row">
        <span>© 2026 Molt. All rights reserved.</span>
        <span>Made for the people behind the flock.</span>
      </div>
    </footer>
  );
}
