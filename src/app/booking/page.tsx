import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Clock3, CreditCard, PhoneCall } from "lucide-react";
import { Booking, BookingFallback } from "@/components/booking";
import { Contact, SiteFooter } from "@/components/closing";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SEATS, halls } from "@/lib/data";

export const metadata: Metadata = {
  title: "Бронь места",
  description: "Онлайн-бронь места в CompClub: общий зал, буткемп или VIP-комната на двоих, на 30 дней вперёд.",
};

const steps = [
  { title: "Выбери время и зал", text: "День, час начала и сколько часов играешь." },
  { title: "Нажми на место", text: "Схема показывает, что свободно именно в эти часы." },
  { title: "Оставь имя и телефон", text: "Получишь код брони, его назовёшь администратору." },
];

const rules = [
  { icon: Clock3, title: "Держим 15 минут", text: "После начала брони место ждёт тебя четверть часа, потом уходит в свободные." },
  { icon: CreditCard, title: "Оплата на месте", text: "Картой, наличными или по СБП, вместе с заказами из снек-бара." },
  { icon: PhoneCall, title: "Отмена звонком", text: "Позвони или напиши в Telegram, отменим без штрафа." },
];

export default function BookingPage() {
  return (
    <>
      <PageHeader
        current="/booking"
        eyebrow="Бронь"
        title="Место за тобой за минуту"
        lead={
          <p>
            Выбери зал, время и конкретный компьютер на схеме. Бронь открыта на 30 дней вперёд, платишь уже в
            клубе.
          </p>
        }
        facts={[
          { value: `${SEATS} место`, label: "в трёх залах" },
          { value: "30 дней", label: "бронь вперёд" },
          { value: "15 минут", label: "ждём после начала" },
          { value: "0 ₽", label: "предоплата" },
        ]}
        photo={{ src: "/images/hall-main.jpg", alt: "Общий зал: длинные ряды игровых мест с мониторами и кожаными креслами" }}
      >
        <Link href="#booking" className="btn btn-neon">
          Выбрать место
        </Link>
        <p className="flex basis-full flex-wrap items-center gap-x-4 gap-y-1 text-small text-soft">
          Сразу в зал:
          {halls.map((h) => (
            <Link
              key={h.id}
              href={`/booking?zone=${h.id}#booking`}
              className="text-ink underline decoration-neon underline-offset-4 hover:text-neon"
            >
              {h.name}
            </Link>
          ))}
        </p>
      </PageHeader>
      <main>
        <section id="booking" aria-labelledby="booking-title" className="wrap section scroll-mt-4">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <Reveal as="h2" id="booking-title">
              Бронь места
            </Reveal>
            <ol className="grid gap-3 sm:grid-cols-3 lg:max-w-[720px]">
              {steps.map((s, i) => (
                <Reveal as="li" key={s.title} order={i + 1} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-2 text-small font-semibold text-neon">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-small text-soft">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
          {/* the widget reads ?zone= from the address, which a static page only knows in the browser */}
          <Suspense fallback={<BookingFallback />}>
            <Booking />
          </Suspense>
        </section>

        <section aria-labelledby="rules-title" className="wrap section">
          <Reveal as="h2" id="rules-title">
            Что важно знать
          </Reveal>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {rules.map((r, i) => (
              <Reveal as="li" key={r.title} order={i + 1} className="rounded-tile bg-surface p-5 md:p-6">
                <span className="grid size-10 place-items-center rounded-full bg-surface-2 text-neon">
                  <r.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lead">{r.title}</h3>
                <p className="mt-1 text-small text-soft">{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
