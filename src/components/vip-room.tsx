import Image from "next/image";
import { Monitor, Lock, VolumeX } from "lucide-react";
import { room } from "@/lib/data";
import { Reveal } from "./reveal";

const perks = [
  {
    icon: Lock,
    title: "Приватность",
    text: "Своя дверь с замком, никого за спиной. Можно говорить в голос и ставить свою музыку.",
  },
  {
    icon: VolumeX,
    title: "Тишина",
    text: "Стены с шумоизоляцией и свой кондиционер: из общего зала не слышно клавиатур.",
  },
  {
    icon: Monitor,
    title: "Изогнутые 4K-мониторы на 240 Гц",
    text: "Samsung Odyssey Neo G8: 32″, 3840×2160, изгиб 1000R, Mini-LED. Внутри ПК класса VIP с RTX 5090.",
  },
];

/** The private room: what it gives, the price and the action beside two photographs. */
export function VipRoom() {
  return (
    <section id="room" aria-labelledby="room-title" className="wrap section">
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col">
          <Reveal as="h2" id="room-title">
            Приватная комната на двоих
          </Reveal>
          <Reveal as="p" order={1} className="mt-3 max-w-[48ch] text-soft">
            Отдельный тариф: закрытая комната с двумя игровыми местами, бронируется целиком. Снеки
            и напитки приносим к столу.
          </Reveal>

          <ul className="mt-8 flex flex-col gap-5">
            {perks.map((p, i) => (
              <Reveal as="li" key={p.title} order={i + 2} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 text-neon">
                  <p.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lead">{p.title}</h3>
                  <p className="mt-1 text-small text-soft">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal order={5} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 rounded-tile bg-surface p-5">
            <p className="text-h3 font-semibold tabular-nums">
              {room.price} ₽ <span className="text-body font-normal text-soft">в час за комнату</span>
            </p>
            <a href="#booking" data-zone="room" className="btn btn-neon">
              Забронировать комнату
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Reveal order={1} className="frame relative col-span-2 aspect-[16/9]">
            <Image
              src="/images/room-1.jpg"
              alt="Отдельная игровая комната: стол с тремя мониторами, кресло и диван у стены"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal order={2} className="frame relative aspect-[4/3]">
            <Image
              src="/images/room-curved.jpg"
              alt="Игрок за тремя изогнутыми мониторами"
              fill
              sizes="(min-width: 1024px) 280px, 50vw"
              className="object-cover object-[50%_75%]"
            />
          </Reveal>
          <Reveal order={3} className="frame relative aspect-[4/3]">
            <Image
              src="/images/pc-vip.jpg"
              alt="Белый игровой ПК с жидкостным охлаждением и RGB-вентиляторами"
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
