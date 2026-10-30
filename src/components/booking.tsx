"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { club, room, tiers, type ZoneId } from "@/lib/data";
import { Keycap, KeyLegend } from "./keycap";

// ---------- zones and seats ----------

type Zone = { id: ZoneId; name: string; price: number; seats: string[]; cols: string };

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

const zones: Zone[] = [
  ...tiers.map((t) => ({
    id: t.id,
    name: t.name,
    price: t.price,
    seats: range(t.seats.from, t.seats.to),
    cols: t.id === "vip" ? "grid-cols-4" : "grid-cols-6",
  })),
  { id: room.id, name: "Комната", price: room.price, seats: ["Комната"], cols: "grid-cols-1" },
];

const zoneById = (id: ZoneId) => zones.find((z) => z.id === id) ?? zones[0];

// ---------- dates ----------

const DAYS_AHEAD = 30;
const WEEKDAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const sameDay = (a: Date, b: Date) => keyOf(a) === keyOf(b);

const monthFmt = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" });
const dayFmt = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" });
const shortDayFmt = new Intl.DateTimeFormat("ru-RU", { weekday: "short", day: "numeric", month: "long" });
const hh = (h: number) => `${String(h % 24).padStart(2, "0")}:00`;

/** Monday-first grid of a month, padded with nulls. */
function monthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

// ---------- occupancy (demo until the club's booking system is connected) ----------

type Saved = { zone: ZoneId; seat: string; date: string; hour: number; duration: number };
const STORE = "compclub:bookings";

function readSaved(): Saved[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    const list: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(list)) return [];
    return list.filter(
      (b): b is Saved =>
        typeof b === "object" &&
        b !== null &&
        typeof b.zone === "string" &&
        typeof b.seat === "string" &&
        typeof b.date === "string" &&
        Number.isInteger(b.hour) &&
        Number.isInteger(b.duration),
    );
  } catch {
    return [];
  }
}

function writeSaved(list: Saved[]) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(list.slice(-20)));
  } catch {
    /* storage blocked: the booking still shows as confirmed */
  }
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function isBusy(zone: ZoneId, seat: string, date: Date, hour: number, duration: number, saved: Saved[]) {
  for (let i = 0; i < duration; i++) {
    const d = addDays(date, Math.floor((hour + i) / 24));
    const h = (hour + i) % 24;
    const key = keyOf(d);
    // Evenings and weekends are busier.
    const evening = h >= 17 || h <= 1;
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    const load = 18 + (evening ? 22 : 0) + (weekend ? 12 : 0);
    if (hash(`${zone}|${seat}|${key}|${h}`) % 100 < load) return true;
    if (
      saved.some((b) => {
        if (b.zone !== zone || b.seat !== seat) return false;
        const start = new Date(`${b.date}T00:00:00`).getTime() + b.hour * 3600e3;
        const t = d.getTime() + h * 3600e3;
        return t >= start && t < start + b.duration * 3600e3;
      })
    )
      return true;
  }
  return false;
}

// ---------- form helpers ----------

const cleanName = (s: string) => s.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 40);
const phoneDigits = (s: string) => {
  const d = s.replace(/\D/g, "");
  if (d.length === 11 && (d[0] === "7" || d[0] === "8")) return "7" + d.slice(1);
  if (d.length === 10 && d[0] === "9") return "7" + d;
  return null;
};
const formatPhone = (d: string) => `+7 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;

// ---------- component ----------

export function Booking() {
  const [today, setToday] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [view, setView] = useState<{ y: number; m: number } | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [duration, setDuration] = useState(2);
  const [zoneId, setZoneId] = useState<ZoneId>("standard");
  const [picked, setSeat] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState<(Saved & { name: string; phone: string; code: string; total: number }) | null>(null);

  // Dates depend on the visitor's clock, so they are set on the client. The widget (80+ keys) is
  // built only when the section comes within a screen and a half of view, not during page load.
  const hostRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const start = () => {
      const n = new Date();
      const t = startOfDay(n);
      setNow(n);
      setToday(t);
      setDate(t);
      setView({ y: t.getFullYear(), m: t.getMonth() });
      setHour(Math.min(n.getHours() + 1, 23));
      setSaved(readSaved());
    };
    const el = hostRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      start();
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Links elsewhere on the page ("Выбрать место в классе Про", "Забронировать комнату") pick the zone.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-zone]");
      const z = a?.dataset.zone as ZoneId | undefined;
      if (z && zones.some((x) => x.id === z)) {
        setZoneId(z);
        setSeat(null);
        setDone(null);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const zone = zoneById(zoneId);
  const lastDay = today ? addDays(today, DAYS_AHEAD) : null;

  const hourDisabled = useCallback(
    (h: number) => !!(date && today && now && sameDay(date, today) && h <= now.getHours()),
    [date, today, now],
  );

  const busy = useMemo(() => {
    const map = new Map<string, boolean>();
    if (!date || hour === null) return map;
    for (const s of zone.seats) map.set(s, isBusy(zone.id, s, date, hour, duration, saved));
    return map;
  }, [zone, date, hour, duration, saved]);

  // A picked seat that became busy after changing the time no longer counts as chosen.
  const seat = picked && !busy.get(picked) ? picked : null;

  if (!today || !view || !date || !lastDay) {
    return (
      <p ref={hostRef} className="min-h-[880px] rounded-tile bg-surface p-6 lg:min-h-[760px]">
        Бронь по телефону:{" "}
        <a className="underline decoration-neon underline-offset-4" href={club.phoneHref}>
          {club.phone}
        </a>
      </p>
    );
  }

  const cells = monthGrid(view.y, view.m);
  const canPrev = view.y > today.getFullYear() || view.m > today.getMonth();
  const canNext = new Date(view.y, view.m + 1, 1) <= lastDay;
  const free = zone.seats.filter((s) => !busy.get(s)).length;
  const total = zone.price * duration;
  const seatLabel = zone.id === "room" ? "Приватная комната" : `Место ${seat}`;
  const timeLabel = hour !== null ? `${hh(hour)}–${hh(hour + duration)}` : "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = cleanName(name);
    const p = phoneDigits(phone);
    const next: typeof errors = {};
    if (n.length < 2) next.name = "Напиши имя, хотя бы две буквы.";
    if (!p) next.phone = "Нужен номер из 10 цифр после +7, например +7 900 123-45-67.";
    setErrors(next);
    if (next.name || next.phone || !seat || hour === null) return;
    const booking: Saved = { zone: zone.id, seat, date: keyOf(date), hour, duration };
    const list = [...readSaved(), booking];
    writeSaved(list);
    setSaved(list);
    const code = `CC-${(hash(`${booking.date}${hour}${seat}${p}${Date.now()}`) % 9000) + 1000}`;
    setDone({ ...booking, name: n, phone: formatPhone(p!), code, total });
    setName("");
    setPhone("");
  };

  if (done) {
    const d = new Date(`${done.date}T00:00:00`);
    return (
      <div role="status" className="grid gap-8 rounded-tile bg-field p-[clamp(24px,4vw,56px)] lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h3 className="text-h2">
            {done.zone === "room" ? "Комната за тобой" : `Место ${done.seat} за тобой`}
          </h3>
          <p className="lead mt-4">
            {dayFmt.format(d)}, {hh(done.hour)}–{hh(done.hour + done.duration)}. Класс{" "}
            {zoneById(done.zone).name}, {done.duration} ч, {done.total} ₽.
          </p>
          <p className="mt-4">
            {done.name}, назови администратору код брони <strong className="text-neon">{done.code}</strong>. Мы
            держим место 15 минут после начала; если опаздываешь, позвони{" "}
            <a className="underline decoration-neon underline-offset-4" href={club.phoneHref}>
              {club.phone}
            </a>
            .
          </p>
        </div>
        <div className="flex items-end lg:col-span-4 lg:col-start-9 lg:justify-end">
          <button
            type="button"
            className="btn btn-neon"
            onClick={() => {
              setDone(null);
              setSeat(null);
            }}
          >
            Забронировать ещё
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-[var(--gutter)] lg:grid-cols-12">
      {/* ---------- When ---------- */}
      <div className="flex flex-col gap-1.5 lg:col-span-5">
        <div className="rounded-tile bg-surface p-5 md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-[18px] font-medium capitalize tracking-normal">
              {monthFmt.format(new Date(view.y, view.m, 1)).replace(" г.", "")}
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Предыдущий месяц"
                disabled={!canPrev}
                onClick={() => setView((v) => (v ? (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }) : v))}
                className="grid size-11 place-items-center rounded-full bg-surface-2 transition-colors hover:bg-mint-4 disabled:opacity-30"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Следующий месяц"
                disabled={!canNext}
                onClick={() => setView((v) => (v ? (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }) : v))}
                className="grid size-11 place-items-center rounded-full bg-surface-2 transition-colors hover:bg-mint-4 disabled:opacity-30"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[14px] text-soft" aria-hidden="true">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1">
                {w}
              </span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-x-1 gap-y-1.5">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const off = d < today || d > lastDay;
              const on = sameDay(d, date);
              return (
                <Keycap
                  key={keyOf(d)}
                  state={on ? "on" : off ? "busy" : "free"}
                  h={42}
                  r={10}
                  ariaLabel={dayFmt.format(d)}
                  onClick={() => {
                    setDate(d);
                    if (sameDay(d, today) && hour !== null && now && hour <= now.getHours()) {
                      setHour(Math.min(now.getHours() + 1, 23));
                    }
                  }}
                >
                  <span className="relative">{d.getDate()}</span>
                </Keycap>
              );
            })}
          </div>
        </div>

        <div className="rounded-tile bg-surface p-5 md:p-6">
          <h3 className="font-sans text-[18px] font-medium tracking-normal">Начало</h3>
          <div className="mt-4 grid grid-cols-6 gap-x-1 gap-y-1.5">
            {Array.from({ length: 24 }, (_, h) => {
              const off = hourDisabled(h);
              const on = hour === h;
              return (
                <Keycap key={h} state={on ? "on" : off ? "busy" : "free"} h={46} r={12} onClick={() => setHour(h)}>
                  <span className="relative">{hh(h)}</span>
                </Keycap>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <h3 id="duration-label" className="font-sans text-[18px] font-medium tracking-normal">
              Сколько часов
            </h3>
            <div className="flex items-center gap-1" role="group" aria-labelledby="duration-label">
              <button
                type="button"
                aria-label="Меньше на час"
                disabled={duration <= 1}
                onClick={() => setDuration((d) => Math.max(1, d - 1))}
                className="grid size-11 place-items-center rounded-full bg-surface-2 transition-colors hover:bg-mint-4 disabled:opacity-30"
              >
                <Minus className="size-5" aria-hidden="true" />
              </button>
              <output aria-live="polite" className="w-16 text-center text-[20px] font-medium tabular-nums">
                {duration} ч
              </output>
              <button
                type="button"
                aria-label="Больше на час"
                disabled={duration >= 12}
                onClick={() => setDuration((d) => Math.min(12, d + 1))}
                className="grid size-11 place-items-center rounded-full bg-surface-2 transition-colors hover:bg-mint-4 disabled:opacity-30"
              >
                <Plus className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Where ---------- */}
      <div className="flex flex-col gap-1.5 lg:col-span-7">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="group" aria-label="Класс">
          {zones.map((z) => {
            const on = z.id === zoneId;
            return (
              <Keycap
                key={z.id}
                state={on ? "on" : "free"}
                h={88}
                r={16}
                wide
                fw={600}
                onClick={() => {
                  setZoneId(z.id);
                  setSeat(null);
                }}
              >
                <span className="relative text-[18px] font-semibold leading-tight">{z.name}</span>
                <span className={`relative text-[14px] leading-snug tabular-nums ${on ? "" : "opacity-70"}`}>
                  {z.price} ₽ в час{z.id === "room" ? " за двоих" : ""}
                </span>
              </Keycap>
            );
          })}
        </div>

        <div className="rounded-tile bg-surface p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-sans text-[18px] font-medium tracking-normal">
              {zone.id === "room" ? "Приватная комната на двоих" : `Места ${zone.seats[0]}–${zone.seats.at(-1)}`}
            </h3>
            <p className="text-[14px] text-soft" aria-live="polite">
              {zone.id === "room"
                ? free
                  ? `Свободна ${shortDayFmt.format(date)}, ${timeLabel}`
                  : "На это время занята"
                : `Свободно ${free} из ${zone.seats.length}`}
            </p>
          </div>

          {zone.id === "room" ? (
            <div className="mt-5">
              <Keycap
                state={seat === "Комната" ? "on" : busy.get("Комната") ? "busy" : "free"}
                h={140}
                r={14}
                wide
                end
                pad={18}
                onClick={() => setSeat("Комната")}
              >
                <span className="relative text-[20px] font-semibold">Два места, своя дверь</span>
                <span className="relative text-[16px]">
                  {busy.get("Комната") ? "Занята, выбери другое время" : "Нажми, чтобы выбрать комнату целиком"}
                </span>
              </Keycap>
            </div>
          ) : (
            <div className={`mt-5 grid gap-x-1.5 gap-y-2 ${zone.cols}`}>
              {zone.seats.map((s) => {
                const taken = !!busy.get(s);
                return (
                  <Keycap
                    key={s}
                    state={seat === s ? "on" : taken ? "busy" : "free"}
                    h={46}
                    r={10}
                    fs={16}
                    strike
                    ariaLabel={`Место ${s}${taken ? ", занято" : ""}`}
                    onClick={() => setSeat(s)}
                  >
                    <span className="relative">{s}</span>
                  </Keycap>
                );
              })}
            </div>
          )}

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-soft" aria-label="Обозначения">
            <li className="flex items-center gap-2">
              <KeyLegend state="free" /> свободно
            </li>
            <li className="flex items-center gap-2">
              <KeyLegend state="busy" /> занято
            </li>
            <li className="flex items-center gap-2">
              <KeyLegend state="on" /> твой выбор
            </li>
          </ul>
        </div>

        <form onSubmit={submit} noValidate className="grid gap-5 rounded-tile bg-surface p-5 md:grid-cols-2 md:p-6">
          <p className="lead md:col-span-2" aria-live="polite">
            {seat && hour !== null ? (
              <>
                {seatLabel}, {shortDayFmt.format(date)}, {timeLabel}.{" "}
                <span className="text-neon tabular-nums">
                  {duration} ч × {zone.price} ₽ = {total} ₽
                </span>
              </>
            ) : (
              <span className="text-soft">
                {hour === null ? "Выбери время начала." : zone.id === "room" ? "Выбери комнату выше." : "Выбери свободное место на схеме."}
              </span>
            )}
          </p>

          <label className="flex flex-col gap-2 text-[16px]">
            Имя
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              autoComplete="given-name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="h-12 rounded-[12px] border border-transparent bg-black px-4 text-[16px] outline-none focus:border-neon aria-[invalid=true]:border-[#ff6b6b]"
            />
            {errors.name && (
              <span id="name-error" className="text-[14px] text-[#ff8a8a]">
                {errors.name}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-2 text-[16px]">
            Телефон
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, 20))}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 900 123-45-67"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className="h-12 rounded-[12px] border border-transparent bg-black px-4 text-[16px] outline-none placeholder:text-[#5f7868] focus:border-neon aria-[invalid=true]:border-[#ff6b6b]"
            />
            {errors.phone && (
              <span id="phone-error" className="text-[14px] text-[#ff8a8a]">
                {errors.phone}
              </span>
            )}
          </label>

          <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
            <p className="max-w-[40ch] text-[14px] text-soft">Оплата на месте, картой или наличными. Отменить можно звонком.</p>
            <button type="submit" className="btn btn-neon" disabled={!seat || hour === null}>
              {seat ? (zone.id === "room" ? "Забронировать комнату" : `Забронировать место ${seat}`) : "Забронировать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
