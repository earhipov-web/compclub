import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

/** The hall shown on a screen that tilts upright as it scrolls into view. */
export function HallScroll() {
  return (
    <section aria-labelledby="hall-title" className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="px-[var(--gutter)] pb-8">
            <h2 id="hall-title">Зал на 50 мест</h2>
            <p className="mx-auto mt-3 max-w-[48ch] text-soft">
              Ряды стоят по классам: выбираешь ряд, выбираешь железо. Свет приглушён, кресла с
              регулировкой, у каждого места столик под напиток.
            </p>
          </div>
        }
      >
        <div className="frame relative h-full w-full">
          <Image
            src="/images/arena.jpg"
            alt="Ряды игровых компьютеров и мониторов в зале во время турнира по Counter-Strike"
            fill
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover object-center"
            draggable={false}
          />
        </div>
      </ContainerScroll>
    </section>
  );
}
