"use client";

import { useEffect, useRef, type ElementType, type ComponentPropsWithoutRef } from "react";

type RevealProps<T extends ElementType> = {
  as?: T;
  /** Position in the section's stagger: heading 0, text 1, picture 2… */
  order?: number;
} & ComponentPropsWithoutRef<T>;

// The server renders every block visible. After mount, a block that is still below the screen is set
// to wait (hidden, lowered) and comes in once its top passes 92% of the screen height. Nothing here
// depends on a class on <html>, so a hydration recovery or a host that rewrites the page cannot turn
// the entrances off, and a block skipped over by a jump (anchor link, End key) still comes in.
const pending = new Set<HTMLElement>();
let timer: ReturnType<typeof setTimeout> | 0 = 0;
let listening = false;

const line = () => window.innerHeight * 0.92;

function check() {
  timer = 0;
  const y = line();
  for (const el of pending) {
    if (el.getBoundingClientRect().top < y) {
      el.classList.add("is-in");
      pending.delete(el);
    }
  }
}

// a short timer rather than requestAnimationFrame: it keeps firing in every browser state,
// and 50 ms is below what anyone notices on a block that is still rising into view
function schedule() {
  if (!timer) timer = setTimeout(check, 50);
}

function watch(el: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // already on screen at mount: leave it as rendered, no flash
  if (el.getBoundingClientRect().top < line()) return;
  el.dataset.reveal = "wait";
  pending.add(el);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
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
