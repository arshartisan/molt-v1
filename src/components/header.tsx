"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Cta, Logo } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { NAV, TOTAL_SECTIONS } from "@/lib/content";


type Theme = "light" | "dark" | "orange";

export function Header() {
  const [index, setIndex] = useState(1);
  const [theme, setTheme] = useState<Theme>("light");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const probe = 34;
    const update = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-section]");
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          setIndex(Number(s.dataset.section));
          break;
        }
      }
      const themed = document.querySelectorAll<HTMLElement>("[data-theme]");
      let t: Theme = "light";
      for (const el of themed) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) t = el.dataset.theme as Theme;
      }
      setTheme(t);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const dark = theme === "dark";
  const orange = theme === "orange";
  const divider = dark ? "border-white/12" : "border-ink/12";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-500",
        dark && "border-white/12 bg-ink/85 text-white",
        orange && "border-ink/15 bg-orange text-ink",
        !dark && !orange && "border-ink/12 bg-paper/85 text-ink",
      )}
    >
      <div className="wrap flex h-[60px] items-stretch md:h-[68px]">
        <div className={cn("flex items-center border-r pr-6 lg:pr-[26px]", divider)}>
          <Logo tone={orange ? "ink" : "orange"} />
        </div>
        <div className={cn("mono hidden items-center pl-6 tabular-nums sm:flex", dark ? "text-white/80" : "text-ink/80")}>
          {String(index).padStart(2, "0")} / {TOTAL_SECTIONS}
        </div>

        <nav className="ml-auto hidden items-stretch lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center border-l px-[17px] text-[15px] tracking-[-0.01em] transition-colors",
                divider,
                dark ? "hover:bg-white/6" : "hover:bg-ink/4",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={cn("ml-auto flex items-center border-l pl-5 lg:ml-0", divider)}>
          <Cta href="#demo" size="sm" tone={dark ? "light" : orange ? "solid" : "dark"} className="hidden sm:inline-flex">
            Request a demo
          </Cta>
          <button
            className="ml-3 grid size-10 place-items-center lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className={cn("border-t lg:hidden", divider)}>
          <nav className="wrap flex flex-col py-2" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn("border-b py-3.5 text-[17px] tracking-[-0.02em] last:border-0", divider)}
              >
                {item.label}
              </Link>
            ))}
            <Cta href="#demo" size="sm" tone={dark ? "light" : orange ? "solid" : "dark"} className="my-3 sm:hidden" wide>
              Request a demo
            </Cta>
          </nav>
        </div>
      )}
    </header>
  );
}
