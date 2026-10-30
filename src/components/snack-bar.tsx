import Image from "next/image";
import { Armchair, Bell, Wallet } from "lucide-react";
import { menu } from "@/lib/data";
import { Reveal } from "./reveal";

const how = [
  { icon: Bell, title: "Позови или подойди", text: "Кнопка вызова на каждом месте или заказ у стойки." },
  { icon: Armchair, title: "Принесём к месту", text: "Горячее за 5–7 минут, напитки сразу из холодильника." },
  { icon: Wallet, title: "Оплата вместе с часами", text: "Заказы копятся на твоём месте, платишь один раз в конце." },
];

const photos = [
  { src: "/images/drinks.jpg", alt: "Стена из банок энергетиков: Red Bull, Monster, Hell, Black, Tiger", cls: "col-span-2 aspect-[16/9]" },
  { src: "/images/chips.jpg", alt: "Чипсы Pringles в тёплом свете", cls: "aspect-square" },
  { src: "/images/doritos.jpg", alt: "Тарелка чипсов Doritos со вкусом сыра", cls: "aspect-square" },
];

/** The whole menu, every group open, set in columns; then how ordering works beside the shelf. */
export function SnackBar() {
  return (
    <>
      <section id="menu" aria-labelledby="menu-title" className="wrap section scroll-mt-4">
        <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <Reveal as="h2" id="menu-title">
            Меню
          </Reveal>
          <Reveal as="p" order={1} className="max-w-[52ch] text-soft">
            {menu.reduce((n, g) => n + g.items.length, 0)} позиций в {menu.length} разделах. Цены за штуку, без
            наценки за доставку к месту.
          </Reveal>
        </div>

        <div className="columns-1 gap-3 md:columns-2 lg:columns-3">
          {menu.map((group, i) => (
            <Reveal
              as="section"
              key={group.title}
              order={i % 3}
              aria-label={group.title}
              className="mb-3 break-inside-avoid rounded-tile bg-surface p-5"
            >
              <h3 className="text-lead">{group.title}</h3>
              <ul className="mt-3 flex flex-col">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-baseline gap-3 border-t border-[#1f3a29] py-2.5 first:border-t-0">
                    <span className="min-w-0 flex-1">
                      {item.name}
                      {item.size && <span className="ml-2 whitespace-nowrap text-small text-soft">{item.size}</span>}
                    </span>
                    <span className="shrink-0 font-medium tabular-nums">{item.price} ₽</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="order-title" className="wrap section">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <Reveal as="h2" id="order-title">
              Как заказать
            </Reveal>
            <ul className="mt-8 flex flex-col gap-5">
              {how.map((h, i) => (
                <Reveal as="li" key={h.title} order={i + 1} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-neon">
                    <h.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lead">{h.title}</h3>
                    <p className="mt-1 text-small text-soft">{h.text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((p, i) => (
              <Reveal key={p.src} order={i + 1} className={`frame relative ${p.cls}`}>
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes={i === 0 ? "(min-width: 1024px) 560px, 100vw" : "(min-width: 1024px) 280px, 50vw"}
                  className="object-cover"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
