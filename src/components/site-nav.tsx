import Link from "next/link";
import { Menu } from "lucide-react";

export const pages = [
  { href: "/computers", label: "Компьютеры" },
  { href: "/booking", label: "Бронь" },
  { href: "/bar", label: "Снек-бар" },
  { href: "/#about", label: "О клубе" },
];

/**
 * The top bar of every page: name, the pages, the booking action. On phones the pages fold into a
 * menu that opens below the bar (a <details>, so it works before scripts load).
 */
export function SiteNav({ current }: { current?: string }) {
  return (
    <nav aria-label="Разделы" className="wrap relative z-30 flex h-16 shrink-0 items-center justify-between gap-6">
      <Link href="/" className="text-lead font-semibold tracking-[-0.01em]" aria-current={current === "/" ? "page" : undefined}>
        CompClub
      </Link>
      <ul className="hidden items-center gap-7 md:flex">
        {pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              aria-current={current === p.href ? "page" : undefined}
              className="text-soft transition-colors hover:text-ink aria-[current=page]:text-neon"
            >
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2">
        <Link href="/booking" className="btn btn-neon">
          Забронировать
        </Link>
        <details className="nav-menu relative md:hidden">
          <summary
            aria-label="Меню"
            className="grid size-11 cursor-pointer place-items-center rounded-full bg-surface-2 transition-colors hover:bg-mint-4"
          >
            <Menu className="size-5" aria-hidden="true" />
          </summary>
          <ul className="absolute right-0 top-[calc(100%+8px)] flex w-56 flex-col gap-1 rounded-tile bg-surface p-2 shadow-[0_16px_40px_rgb(0_0_0/0.6)]">
            {pages.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  aria-current={current === p.href ? "page" : undefined}
                  className="flex h-11 items-center rounded-[10px] px-3 transition-colors hover:bg-surface-2 aria-[current=page]:text-neon"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </nav>
  );
}
