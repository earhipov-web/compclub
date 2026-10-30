import Image from "next/image";
import Link from "next/link";
import { games, halls, tiers } from "@/lib/data";
import { Reveal } from "./reveal";

/** The three classes side by side: photo, price, frame rate in Cyberpunk 2077, what is inside. */
export function Tiers() {
  const cyberpunk = games[0];

  return (
    <section id="computers" aria-labelledby="computers-title" className="wrap section">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <Reveal as="h2" id="computers-title">
          Три класса компьютеров
        </Reveal>
        <Reveal as="p" order={1} className="max-w-[52ch] text-soft">
          Один класс, одна сборка: все места ряда одинаковые. Цена за час, без депозита и
          абонементов.
        </Reveal>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((t, i) => (
          <Reveal
            as="article"
            key={t.id}
            order={i}
            aria-labelledby={`tier-${t.id}-title`}
            id={`tier-${t.id}`}
            className="flex scroll-mt-6 flex-col rounded-tile bg-surface p-4"
          >
            <div className="frame relative aspect-[4/3] w-full">
              <Image
                src={t.photo.src}
                alt={t.photo.alt}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="mt-5 flex items-baseline justify-between gap-4 px-1">
              <h3 id={`tier-${t.id}-title`}>{t.name}</h3>
              <p className="text-lead font-semibold tabular-nums">
                {t.price} ₽<span className="font-normal text-soft"> / час</span>
              </p>
            </div>
            <p className="mt-1 px-1 text-small text-soft">
              {halls.find((h) => h.id === t.id)!.name}, места {t.seats.from}–{t.seats.to}. {t.pitch}
            </p>

            <p className="mx-1 mt-4 flex items-baseline gap-2 rounded-[12px] bg-black px-4 py-3">
              <span className="text-h3 font-semibold text-neon tabular-nums">{cyberpunk.fps[t.id]} FPS</span>
              <span className="text-small text-soft">в {cyberpunk.title}</span>
            </p>

            <dl className="mb-5 mt-4 grid grid-cols-[96px_1fr] gap-x-3 gap-y-2 px-1 text-small">
              {t.specs.map((s) => (
                <div key={s.label} className="contents">
                  <dt className="text-soft">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>

            <Link href={`/booking?zone=${t.id}`} className="btn btn-neon mt-auto w-full">
              {t.id === "vip" ? "Забронировать VIP-комнату" : "Выбрать место"}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
