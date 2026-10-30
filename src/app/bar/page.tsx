import type { Metadata } from "next";
import Link from "next/link";
import { Contact, SiteFooter } from "@/components/closing";
import { PageHeader } from "@/components/page-header";
import { SnackBar } from "@/components/snack-bar";
import { menu } from "@/lib/data";

export const metadata: Metadata = {
  title: "Снек-бар",
  description: "Меню снек-бара CompClub: энергетики, газировка, чипсы, горячее и кофе с доставкой к месту.",
};

export default function BarPage() {
  const prices = menu.flatMap((g) => g.items.map((i) => i.price));
  return (
    <>
      <PageHeader
        current="/bar"
        eyebrow="Снек-бар"
        title="Еда и напитки, не вставая с места"
        lead={
          <p>
            Энергетики, газировка, снеки и горячее. Заказываешь со своего места, администратор приносит к столу,
            платишь вместе с часами.
          </p>
        }
        facts={[
          { value: `${menu.reduce((n, g) => n + g.items.length, 0)} позиций`, label: "в меню" },
          { value: `от ${Math.min(...prices)} ₽`, label: "за позицию" },
          { value: "5–7 минут", label: "горячее" },
          { value: "24/7", label: "работает" },
        ]}
        photo={{ src: "/images/bar-counter.jpg", alt: "Стойка снек-бара: холодильники с напитками и полки со снеками" }}
      >
        <Link href="#menu" className="btn btn-neon">
          Открыть меню
        </Link>
      </PageHeader>
      <main>
        <SnackBar />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
