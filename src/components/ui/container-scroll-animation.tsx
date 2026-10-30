"use client";

import React, { useEffect, useRef } from "react";

/**
 * The card tilts back and scales, then straightens as the section scrolls into view, while the
 * title rises. Same geometry as the original framer-motion component (rotateX 20° → 0, scale
 * 1.05 → 1, or 0.7 → 0.9 on phones, title up 100 px), but driven by CSS scroll-driven animations
 * (`animation-timeline: view()`), so the compositor runs it and no JavaScript works on each scroll
 * frame. Browsers without scroll timelines get the same motion from one scroll listener that writes
 * the progress into `--csp`. Reduced motion shows the card straight. Styles: `.cs-*` in globals.css.
 * No ancestor may set overflow hidden/auto: that makes it the timeline's scroller and freezes the card.
 */
export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    // the CSS range, by hand: from entry 10% to cover 60%
    const update = () => {
      frame = 0;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = 0.1 * Math.min(height, vh);
      const end = 0.6 * (vh + height);
      const p = Math.min(1, Math.max(0, (vh - top - start) / (end - start)));
      el.style.setProperty("--csp", p.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} className="cs-root h-[44rem] md:h-[60rem] flex items-center justify-center relative p-2 md:p-20">
      <div className="py-10 md:py-24 w-full relative" style={{ perspective: "1000px" }}>
        <Header titleComponent={titleComponent} />
        <Card>{children}</Card>
      </div>
    </div>
  );
};

export const Header = ({ titleComponent }: { titleComponent: string | React.ReactNode }) => {
  return <div className="cs-header div max-w-5xl mx-auto text-center">{titleComponent}</div>;
};

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="cs-card max-w-4xl -mt-8 mx-auto h-[22rem] md:h-[32rem] w-full border-4 border-[#1f3a29] p-2 md:p-4 bg-[#0a170e] rounded-[26px]"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl bg-black md:rounded-2xl">{children}</div>
    </div>
  );
};
