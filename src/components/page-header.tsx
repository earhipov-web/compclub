import Image from "next/image";
import type { ReactNode } from "react";
import { SiteNav } from "./site-nav";

type Props = {
  /** path of the page, marks it in the menu */
  current: string;
  eyebrow: string;
  title: string;
  lead: ReactNode;
  facts: { value: string; label: string }[];
  photo: { src: string; alt: string; position?: string };
  children?: ReactNode;
};

/**
 * First screen of an inner page: the bar, then the title and what the page holds beside a large
 * photo, and the same four fact cards as on the home page. Fills most of the first screen, so the
 * page opens as a page and not as a section lifted out of the landing.
 */
export function PageHeader({ current, eyebrow, title, lead, facts, photo, children }: Props) {
  return (
    <header id="top" className="relative flex flex-col bg-black lg:min-h-[min(88svh,860px)]">
      <SiteNav current={current} />
      <div className="wrap grid flex-1 items-center gap-8 pb-6 pt-6 lg:grid-cols-12 lg:gap-12 lg:pt-4">
        <div className="page-intro flex flex-col lg:col-span-6">
          <p className="text-small font-medium uppercase tracking-[0.18em] text-neon">{eyebrow}</p>
          <h1 className="mt-3 text-h1">{title}</h1>
          <div className="lead mt-5 max-w-[46ch] text-soft">{lead}</div>
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="page-photo frame relative aspect-[4/3] lg:col-span-6 lg:aspect-[5/4]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            priority
            sizes="(min-width: 1024px) 580px, 100vw"
            className="object-cover"
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
        </div>
      </div>
      <ul className="page-facts wrap grid grid-cols-2 gap-2 pb-3 md:grid-cols-4">
        {facts.map((f) => (
          <li key={f.label} className="flex flex-col rounded-[12px] bg-surface px-3.5 py-2.5 md:flex-row md:items-baseline md:gap-2">
            <span className="whitespace-nowrap font-semibold">{f.value}</span>
            <span className="truncate text-small text-soft">{f.label}</span>
          </li>
        ))}
      </ul>
    </header>
  );
}
