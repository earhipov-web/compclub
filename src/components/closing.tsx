import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { pages } from "./site-nav";
import { club } from "@/lib/data";
import credits from "@/lib/credits.json";
import { Reveal } from "./reveal";

type Credit = { file: string; title: string; creator: string | null; license: string; licenseUrl: string; page: string };

const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(`${club.city} ${club.street}`)}`;

/** Address, hours and phone, with the booking action. */
export function Contact() {
  const rows = [
    { icon: MapPin, label: "Адрес", value: `${club.street}, ${club.city}`, href: mapHref },
    { icon: Clock, label: "Часы", value: club.hours },
    { icon: Phone, label: "Телефон", value: club.phone, href: club.phoneHref },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="wrap section pb-[var(--section)]">
      <div className="grid gap-6 rounded-tile bg-surface p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <Reveal as="h2" id="contact-title">
            Как нас найти
          </Reveal>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {rows.map((r, i) => (
              <Reveal as="li" key={r.label} order={i + 1} className="flex gap-3">
                <r.icon className="mt-0.5 size-5 shrink-0 text-neon" aria-hidden="true" />
                <div>
                  <p className="text-small text-soft">{r.label}</p>
                  {r.href ? (
                    <a
                      href={r.href}
                      {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="underline decoration-neon underline-offset-4 hover:text-neon"
                    >
                      {r.value}
                    </a>
                  ) : (
                    <p>{r.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
        <Link href="/booking" className="btn btn-neon justify-self-start">
          Забронировать место
        </Link>
      </div>
    </section>
  );
}

/** A plain footer: name, links, picture credits. */
export function SiteFooter() {
  const list = credits as Credit[];
  return (
    <footer className="bg-surface">
      <div className="wrap flex flex-col gap-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-lead font-semibold">
            CompClub
          </Link>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {pages.map((p) => (
              <li key={p.href}>
                <Link className="text-soft hover:text-ink" href={p.href}>
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <a className="text-soft hover:text-ink" href={club.telegram} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </li>
            <li>
              <a className="text-soft hover:text-ink" href={club.vk} target="_blank" rel="noopener noreferrer">
                ВКонтакте
              </a>
            </li>
            <li>
              <a className="text-soft hover:text-ink" href={club.phoneHref}>
                {club.phone}
              </a>
            </li>
          </ul>
        </div>
        <p className="text-small leading-relaxed text-soft">
          Фотографии:{" "}
          {list.map((c, i) => (
            <span key={c.page}>
              <a className="underline underline-offset-2 hover:text-ink" href={c.page} target="_blank" rel="noopener noreferrer">
                «{c.title}»
              </a>
              {c.creator && c.creator !== "Unknown" ? `, ${c.creator}` : ""}, {c.license}, Wikimedia Commons
              {i < list.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>
        <div className="flex justify-between gap-4 text-small text-soft">
          <span>© {new Date().getFullYear()} CompClub</span>
          <a href="#top" className="hover:text-ink">
            Наверх
          </a>
        </div>
      </div>
    </footer>
  );
}
