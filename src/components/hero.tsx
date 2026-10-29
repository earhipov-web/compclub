import { FanScene } from "./fan-scene";

const links = [
  { href: "#computers", label: "Компьютеры" },
  { href: "#booking", label: "Бронь" },
  { href: "#room", label: "Комната" },
  { href: "#bar", label: "Снек-бар" },
];

const facts = [
  { value: "50 мест", label: "три класса ПК" },
  { value: "от 100 ₽", label: "за час игры" },
  { value: "RTX 5090", label: "в классе VIP" },
  { value: "24/7", label: "без выходных" },
];

const MARQUEE = "Играем круглосуточно";

/**
 * First screen: the name appears on black, the black metal fan above it shows as a faint outline,
 * then a lamp behind its centre lights it from behind. The name runs edge to edge across the fan's
 * lower third, and the marquee covers the foot of its letters. Geometry measured in Figma:
 * Unbounded ExtraBold at -4% tracking draws "CompClub" 6.324em wide, cap top 0.11em, baseline 0.897em.
 */
export function Hero() {
  const run = Array.from({ length: 4 }, () => MARQUEE);
  return (
    <header id="top" className="hero relative flex min-h-[100svh] flex-col overflow-hidden bg-black">
      <nav aria-label="Разделы" className="wrap relative z-20 flex h-16 shrink-0 items-center justify-between gap-6">
        <a href="#top" className="text-lead font-semibold tracking-[-0.01em]">
          CompClub
        </a>
        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-soft transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#booking" className="btn btn-neon">
          Забронировать
        </a>
      </nav>

      <div className="hero-inner relative flex flex-1 flex-col justify-center md:justify-end">
        {/* Stage: 1.05 × the fan, the fan centred in it */}
        <div className="hero-stage relative w-full">
          <FanScene className="absolute inset-0" />
        </div>

        <h1 className="hero-name relative z-10">
          CompClub<span className="sr-only">: компьютерный клуб на 50 мест</span>
        </h1>

        <div className="marquee hero-marquee relative z-20 overflow-hidden bg-neon text-black" aria-hidden="true">
          <div className="marquee-track">
            {[...run, ...run].map((t, i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                {t}
                <span className="mx-[0.6em] inline-block size-[0.3em] rounded-full bg-black" />
              </span>
            ))}
          </div>
        </div>

        <ul className="hero-after relative z-20 grid w-full grid-cols-2 gap-2 px-[var(--gutter)] py-3 md:grid-cols-4">
          {facts.map((f) => (
            <li key={f.value} className="flex flex-col rounded-[12px] bg-surface px-3.5 py-2.5 md:flex-row md:items-baseline md:gap-2">
              <span className="whitespace-nowrap font-semibold">{f.value}</span>
              <span className="truncate text-small text-soft">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
