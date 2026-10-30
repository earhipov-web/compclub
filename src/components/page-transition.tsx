"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AbstractCubeIsometricLoader } from "@/components/ui/abstract-cube-isometric-loader";

const NAMES: Record<string, string> = {
  "/": "Главная",
  "/computers": "Компьютеры",
  "/booking": "Бронь",
  "/bar": "Снек-бар",
};

const HOLD = 900; // ms the loader stays up, so a page change reads as one beat
const HOLD_REDUCED = 250;
const GIVE_UP = 8000; // a navigation that never lands still clears the screen
const FADE = 300; // matches .page-veil's transition

type Veil = { name: string; state: "in" | "out" };

/**
 * Between pages: a click on a link to another page of the site covers the screen with the dot
 * loader and the page name, starts the navigation, and lifts once the new page has rendered and
 * at least HOLD has passed. Links to other sites, new-tab clicks, downloads and links within the
 * same page are left alone.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [veil, setVeil] = useState<Veil | null>(null);
  const started = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const lift = useCallback((after: number) => {
    clear();
    timers.current.push(
      setTimeout(() => {
        delete document.documentElement.dataset.veil;
        setVeil((v) => (v ? { ...v, state: "out" } : v));
      }, after),
      setTimeout(() => setVeil(null), after + FADE),
    );
  }, [clear]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      e.preventDefault();
      started.current = performance.now();
      // holds the new page's entrance animations until the loader lifts (see .page-intro)
      document.documentElement.dataset.veil = "";
      setVeil({ name: NAMES[url.pathname] ?? "CompClub", state: "in" });
      clear();
      timers.current.push(setTimeout(() => lift(0), GIVE_UP));
      router.push(url.pathname + url.search + url.hash);
    };
    // capture phase: runs before Next's <Link> handler, which then sees the click as handled
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, [router, clear, lift]);

  // fetch the other pages once the first one has settled, so a click waits only for HOLD
  useEffect(() => {
    const t = setTimeout(() => Object.keys(NAMES).forEach((p) => router.prefetch(p)), 3000);
    return () => clearTimeout(t);
  }, [router]);

  // the new page is in: keep the loader up for the rest of HOLD, then fade it out
  useEffect(() => {
    if (!started.current) return;
    const hold = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? HOLD_REDUCED : HOLD;
    lift(Math.max(0, hold - (performance.now() - started.current)));
    started.current = 0;
  }, [pathname, lift]);

  if (!veil) return null;
  return (
    <div className="page-veil" data-state={veil.state} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-6">
        <AbstractCubeIsometricLoader dotSize={9} gap={6} speed={1.2} bloom className="text-neon" />
        <p className="text-small font-medium uppercase tracking-[0.18em] text-soft">
          <span className="sr-only">Загрузка: </span>
          {veil.name}
        </p>
      </div>
    </div>
  );
}
