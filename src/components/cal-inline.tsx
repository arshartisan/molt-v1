"use client";

import { useEffect, useRef, useState } from "react";

/* Minimal typing for the Cal.com embed queue. */
type CalApi = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns: Record<string, (...args: unknown[]) => void>;
  q?: unknown[];
};
declare global {
  interface Window {
    Cal?: CalApi;
  }
}

const EMBED_SRC = "https://app.cal.com/embed/embed.js";

/** Cal.com's official loader snippet: queues calls until embed.js arrives. */
function loadCal() {
  if (window.Cal) return;
  /* eslint-disable prefer-rest-params, @typescript-eslint/no-explicit-any */
  (function (C: any, A: string, L: string) {
    const p = function (a: any, ar: any) {
      a.q.push(ar);
    };
    const d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api: any = function () {
            p(api, arguments);
          };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, EMBED_SRC, "init");
  /* eslint-enable prefer-rest-params, @typescript-eslint/no-explicit-any */
}

/**
 * Inline Cal.com scheduler. The embed script is only fetched when the block
 * comes near the viewport, so it never slows down the first paint.
 */
export function CalInline({
  calLink,
  namespace,
  brand = "#0B0C0F",
  className,
}: {
  calLink: string;
  namespace: string;
  brand?: string;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const id = `cal-inline-${namespace}`;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    loadCal();
    const Cal = window.Cal!;
    Cal("init", namespace, { origin: "https://app.cal.com" });
    Cal.ns[namespace]("inline", {
      elementOrSelector: `#${id}`,
      calLink,
      config: { layout: "month_view", theme: "light" },
    });
    Cal.ns[namespace]("ui", {
      theme: "light",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { light: { "cal-brand": brand } },
    });
  }, [started, namespace, calLink, id, brand]);

  return (
    <div ref={box} className={className}>
      <div id={id} className="h-full w-full overflow-auto" />
      {!started && (
        <div className="grid h-full min-h-[420px] place-items-center text-[14px] text-ink/60">Loading calendar…</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pop-up booking                                                      */
/* ------------------------------------------------------------------ */

const POPUP_NS = "book-popup";
const POPUP_LINK = "focaldive/30min";

function initPopup() {
  loadCal();
  const Cal = window.Cal!;
  if (!Cal.ns?.[POPUP_NS]) {
    Cal("init", POPUP_NS, { origin: "https://app.cal.com" });
    Cal.ns[POPUP_NS]("ui", {
      theme: "light",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { light: { "cal-brand": "#0B0C0F" } },
    });
  }
  return Cal;
}

/** Opens the focaldive/30min scheduler in Cal.com's modal over the current page. */
export function openBooking() {
  const Cal = initPopup();
  Cal.ns[POPUP_NS]("modal", {
    calLink: POPUP_LINK,
    config: { layout: "month_view", theme: "light" },
  });
}

const DEMO_LINKS = 'a[href="#demo"], a[href="#book"], [data-book-demo]';

/**
 * Turns every "Request a demo" link on the page into a pop-up booking, so
 * visitors book without being scrolled to the bottom. Cal.com starts loading
 * on the first hover or focus of a demo button, so the modal opens quickly.
 */
export function BookingPopup() {
  useEffect(() => {
    const warm = (e: Event) => {
      if ((e.target as Element | null)?.closest?.(DEMO_LINKS)) initPopup();
    };
    const click = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as Element | null)?.closest?.(DEMO_LINKS);
      if (!el) return;
      // capture phase: runs before Next.js <Link> scrolls to the section
      e.preventDefault();
      e.stopPropagation();
      openBooking();
    };
    document.addEventListener("pointerover", warm, { passive: true });
    document.addEventListener("focusin", warm);
    document.addEventListener("click", click, true);
    return () => {
      document.removeEventListener("pointerover", warm);
      document.removeEventListener("focusin", warm);
      document.removeEventListener("click", click, true);
    };
  }, []);
  return null;
}
