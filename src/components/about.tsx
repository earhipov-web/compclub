import Image from "next/image";
import { Headset, ShieldCheck, Sparkles, Star } from "lucide-react";
import { about } from "@/lib/data";
import { Reveal } from "./reveal";

const icons = [Sparkles, ShieldCheck, Headset];

/** The club: since when, the numbers, what it promises, and three guests in their own words. */
export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="wrap section scroll-mt-4">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col lg:col-span-6">
          <Reveal as="p" className="text-small font-medium uppercase tracking-[0.18em] text-neon">
            О клубе
          </Reveal>
          <Reveal as="h2" id="about-title" order={1} className="mt-3">
            Играем с {about.since} года
          </Reveal>
          <Reveal order={2} className="mt-4 flex max-w-[56ch] flex-col gap-3 text-soft">
            <p>
              CompClub открылся в марте 2024 года на тридцать мест в одном зале. Через год гостей
              стало больше, чем мест по вечерам, и мы пристроили буткемп для команд и три
              закрытые комнаты на двоих.
            </p>
            <p>
              Сегодня у нас 51 место, своя лига по CS2 и Dota 2 по выходным и постоянные гости,
              которые приходят компанией после учёбы и работы.
            </p>
          </Reveal>

          <ul className="mt-8 flex flex-col gap-5">
            {about.promises.map((p, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal as="li" key={p.title} order={i + 3} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-neon">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lead">{p.title}</h3>
                    <p className="mt-1 text-small text-soft">{p.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-6">
          <Reveal order={1} className="frame relative aspect-[16/10]">
            <Image
              src="/images/arena.jpg"
              alt="Турнир по Counter-Strike: игроки за компьютерами на сцене под большим экраном"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <dl className="grid grid-cols-2 gap-3">
            {about.stats.map((s, i) => (
              <Reveal key={s.label} order={i + 2} className="flex flex-col-reverse rounded-tile bg-surface p-4 md:p-5">
                <dt className="mt-1 text-small text-soft">{s.label}</dt>
                <dd className="text-h2 font-semibold tabular-nums text-ink">{s.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-[var(--section)]">
        <Reveal as="h3" className="text-h2">
          Что говорят гости
        </Reveal>
        <ul className="mt-6 grid gap-3 md:grid-cols-3">
          {about.reviews.map((r, i) => (
            <Reveal as="li" key={r.name} order={i + 1} className="flex flex-col rounded-tile bg-surface p-5 md:p-6">
              <p className="flex gap-0.5 text-neon" aria-label="5 из 5">
                {Array.from({ length: 5 }, (_, k) => (
                  <Star key={k} className="size-4 fill-current" aria-hidden="true" />
                ))}
              </p>
              <blockquote className="mt-4 flex-1">
                <p>«{r.text}»</p>
              </blockquote>
              <p className="mt-5 text-small text-soft">
                {r.name}, {r.when}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
