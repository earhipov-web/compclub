import { Booking } from "@/components/booking";
import { Contact, SiteFooter } from "@/components/closing";
import { FpsTable } from "@/components/fps-table";
import { HallScroll } from "@/components/hall-scroll";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";
import { SnackBar } from "@/components/snack-bar";
import { Tiers } from "@/components/tiers";
import { VipRoom } from "@/components/vip-room";

export default function Home() {
  return (
    <>
      <Hero />
      <main>
        <HallScroll />
        <Tiers />
        <FpsTable />

        <section id="booking" aria-labelledby="booking-title" className="wrap section scroll-mt-4">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <Reveal as="h2" id="booking-title">
              Бронь места
            </Reveal>
            <Reveal as="p" order={1} className="max-w-[52ch] text-soft">
              Выбери день, время и класс, потом конкретный компьютер на схеме зала. Бронь открыта на
              30 дней вперёд.
            </Reveal>
          </div>
          <Booking />
        </section>

        <VipRoom />
        <SnackBar />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
