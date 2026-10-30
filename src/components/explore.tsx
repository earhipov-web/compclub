import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

const links = [
  {
    href: "/computers",
    title: "Компьютеры",
    text: "Три сборки, характеристики и FPS в тяжёлых играх.",
    src: "/images/pc-vip-o11.jpg",
    alt: "Игровой ПК в стеклянном корпусе с водяным охлаждением и зелёной подсветкой",
  },
  {
    href: "/booking",
    title: "Бронь",
    text: "Выбери день, время и конкретное место на схеме зала.",
    src: "/images/room-curved.jpg",
    alt: "Игрок за изогнутыми мониторами",
  },
  {
    href: "/bar",
    title: "Снек-бар",
    text: "Энергетики, снеки и горячее с доставкой к месту.",
    src: "/images/bar-counter.jpg",
    alt: "Стойка снек-бара с холодильниками напитков и полками снеков",
  },
];

/** Three large tiles that lead to the other pages. */
export function Explore() {
  return (
    <section aria-labelledby="explore-title" className="wrap section">
      <Reveal as="h2" id="explore-title">
        Куда дальше
      </Reveal>
      <ul className="mt-8 grid gap-3 md:grid-cols-3">
        {links.map((l, i) => (
          <Reveal as="li" key={l.href} order={i + 1}>
            <Link href={l.href} className="group frame relative flex aspect-[4/5] flex-col justify-end p-5 md:aspect-[3/4] md:p-6">
              <Image
                src={l.src}
                alt={l.alt}
                fill
                sizes="(min-width: 768px) 380px, 100vw"
                className="-z-10 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/0" aria-hidden="true" />
              <span className="flex items-center justify-between gap-3">
                <span className="text-h2 font-semibold">{l.title}</span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-neon text-black transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </span>
              </span>
              <span className="mt-2 max-w-[32ch] text-small text-soft">{l.text}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
