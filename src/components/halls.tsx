import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { halls, SEATS, tiers } from "@/lib/data";
import { Reveal } from "./reveal";

/**
 * The three halls: their photos side by side on a screen that tilts upright as it scrolls into
 * view (stacked on phones), then a column per hall under its photo with what it gives and a link
 * to book it.
 */
export function Halls() {
  return (
    <section id="halls" aria-labelledby="halls-title" className="flex scroll-mt-4 flex-col overflow-clip">
      <ContainerScroll
        titleComponent={
          <div className="px-[var(--gutter)] pb-8">
            <h2 id="halls-title">Три зала, {SEATS} место</h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-soft">
              Общий зал для вечерней игры, буткемп для команд и закрытые комнаты на двоих. В каждом
              зале свой класс компьютеров.
            </p>
          </div>
        }
      >
        <ul className="grid h-full grid-rows-3 gap-1.5 md:grid-cols-3 md:grid-rows-1">
          {halls.map((h) => (
            <li key={h.id} className="relative overflow-hidden rounded-xl">
              <Image
                src={h.photo.src}
                alt={h.photo.alt}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 100vw"
                className="object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <p className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between gap-2 md:bottom-4 md:left-4 md:right-4 md:flex-col md:items-start md:gap-0.5">
                <span className="text-h3 font-semibold">{h.name}</span>
                <span className="text-small text-soft">{h.size}</span>
              </p>
            </li>
          ))}
        </ul>
      </ContainerScroll>

      <div className="wrap -mt-8 grid gap-4 md:-mt-24 md:grid-cols-3">
        {halls.map((h, i) => {
          const tier = tiers.find((t) => t.id === h.id)!;
          return (
            <Reveal
              as="article"
              key={h.id}
              order={i}
              aria-labelledby={`hall-${h.id}`}
              className="flex flex-col rounded-tile bg-surface p-5 md:p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 id={`hall-${h.id}`}>{h.name}</h3>
                <span className="rounded-full bg-black px-3 py-1 text-small text-soft">{h.size}</span>
              </div>
              <p className="mt-3 text-small text-soft">{h.lead}</p>

              <ul className="mt-5 flex flex-col gap-3.5">
                {h.perks.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-neon" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-small text-soft">{p.text}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-baseline justify-between gap-3 border-t border-[#1f3a29] pt-4">
                <p className="text-h3 font-semibold tabular-nums">
                  {h.price} ₽ <span className="text-small font-normal text-soft">{h.per}</span>
                </p>
                <Link href={`/computers#tier-${tier.id}`} className="text-small text-soft underline decoration-neon underline-offset-4 hover:text-ink">
                  ПК {tier.name}
                </Link>
              </div>
              <Link href={`/booking?zone=${h.id}`} className="btn btn-neon mt-5 w-full">
                {h.id === "vip" ? "Забронировать комнату" : "Выбрать место"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
