"use client";

import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Position in the section's stagger: heading 0, text 1, picture 2… */
  order?: number;
} & ComponentPropsWithoutRef<T>;

// One shared check on scroll: anything whose top has passed 92% of the screen height is shown,
// including elements skipped over by a jump (anchor links, End key), which an IntersectionObserver misses.
const pending = new Set<HTMLElement>();
let frame = 0;
let listening = false;

function check() {
  frame = 0;
  const line = window.innerHeight * 0.92;
  for (const el of pending) {
    if (el.getBoundingClientRect().top < line) {
      el.classList.add("is-in");
      pending.delete(el);
    }
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(check);
}

function watch(el: HTMLElement) {
  pending.add(el);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();
}

/** Rises and fades in once when it enters the viewport. Visible without JS. */
export function Reveal<T extends ElementType = "div">({ as, order = 0, style, ...rest }: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    watch(el);
    return () => {
      pending.delete(el);
    };
  }, []);

  return <Tag ref={ref} data-reveal="" style={{ ["--i" as string]: order, ...style }} {...rest} />;
}
