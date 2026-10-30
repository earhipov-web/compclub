import type { Metadata } from "next";
import Link from "next/link";
import { Contact, SiteFooter } from "@/components/closing";
import { EverySeat } from "@/components/every-seat";
import { FpsTable } from "@/components/fps-table";
import { PageHeader } from "@/components/page-header";
import { Tiers } from "@/components/tiers";
import { games, tiers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Компьютеры и FPS",
  description:
    "Три класса игровых ПК CompClub: от RTX 5060 Ti до RTX 5090, мониторы 180 Гц, FPS в Cyberpunk 2077, Warzone и CS2.",
};

export default function ComputersPage() {
  const cs = games.find((g) => g.title === "Counter-Strike 2")!;
  return (
    <>
      <PageHeader
        current="/computers"
        eyebrow="Компьютеры"
        title="Железо, которое тянет всё"
        lead={
          <p>
            Три класса сборок, по одному на зал: от {tiers[0].price} ₽ в час за RTX 5060 Ti до VIP с RTX 5090 и
            Ryzen 7 9800X3D. Все места одного класса собраны одинаково.
          </p>
        }
        facts={[
          { value: "RTX 50", label: "во всех сборках" },
          { value: "180 Гц", label: "мониторы" },
          { value: `${cs.fps.vip} FPS`, label: "в CS2 на VIP" },
          { value: "DDR5", label: "от 32 ГБ" },
        ]}
        photo={{ src: "/images/room-curved.jpg", alt: "Игрок за тремя изогнутыми мониторами", position: "50% 70%" }}
      >
        <Link href="#computers" className="btn btn-neon">
          Сравнить классы
        </Link>
        <Link href="#fps" className="btn btn-ghost">
          FPS в играх
        </Link>
      </PageHeader>
      <main>
        <Tiers />
        <FpsTable />
        <EverySeat />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
