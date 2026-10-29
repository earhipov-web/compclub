import Image from "next/image";
import { Plus } from "lucide-react";
import { menu } from "@/lib/data";
import { Reveal } from "./reveal";

/** The menu as bars that open in place, with pictures of the shelf beside it. */
export function SnackBar() {
  return (
    <section id="bar" aria-labelledby="bar-title" className="wrap section">
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Reveal as="h2" id="bar-title">
            Снек-бар
          </Reveal>
          <Reveal as="p" order={1} className="mt-3 max-w-[48ch] text-soft">
            Напитки и снеки приносим к месту: позови администратора или закажи у стойки. Оплата
            вместе с часами.
          </Reveal>

          <Reveal order={2} className="mt-6 flex flex-col gap-1.5">
            {menu.map((group, i) => (
              <details key={group.title} className="menu-bar rounded-tile bg-surface" open={i === 0}>
                <summary className="flex h-12 cursor-pointer items-center justify-between rounded-tile px-4 font-medium transition-colors duration-150 hover:bg-surface-2">
                  {group.title}
                  <Plus className="menu-plus size-5 text-neon" aria-hidden="true" />
                </summary>
                <ul className="flex flex-col gap-2.5 px-4 pb-4 pt-1">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-4">
                      <span>
                        {item.name}
                        {item.size && <span className="ml-2 text-small text-soft">{item.size}</span>}
                      </span>
                      <span className="shrink-0 tabular-nums">{item.price} ₽</span>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Reveal order={1} className="frame relative col-span-2 aspect-[16/10]">
            <Image
              src="/images/drinks.jpg"
              alt="Стена из банок энергетиков: Red Bull, Monster, Hell, Black, Tiger"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal order={2} className="frame relative aspect-square">
            <Image
              src="/images/chips.jpg"
              alt="Чипсы Pringles в тёплом свете"
              fill
              sizes="(min-width: 1024px) 280px, 50vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal order={3} className="frame relative aspect-square">
            <Image
              src="/images/doritos.jpg"
              alt="Тарелка чипсов Doritos со вкусом сыра"
              fill
              sizes="(min-width: 1024px) 280px, 50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
