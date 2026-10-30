import { Cloud, Gamepad2, Gauge, KeyRound } from "lucide-react";
import { Reveal } from "./reveal";

const features = [
  { icon: Gauge, title: "Интернет 1 Гбит/с", text: "Оптика от двух провайдеров, пинг до московских серверов 3–6 мс." },
  { icon: KeyRound, title: "Свой аккаунт", text: "Входишь в свой Steam или Riot, после сеанса система стирает всё сама." },
  { icon: Cloud, title: "Игры уже скачаны", text: "Обновления ставим ночью, запускаешь сразу без очереди патчей." },
  { icon: Gamepad2, title: "Геймпад по запросу", text: "DualSense и Xbox Controller у администратора, без доплаты." },
];

const launchers = ["Steam", "Epic Games", "Battle.net", "Riot Client", "EA app", "Ubisoft Connect", "Lesta Games", "Faceit"];

const library = [
  "Counter-Strike 2",
  "Dota 2",
  "Valorant",
  "League of Legends",
  "PUBG: Battlegrounds",
  "Apex Legends",
  "Fortnite",
  "Call of Duty: Warzone",
  "Marvel Rivals",
  "Deadlock",
  "Rust",
  "Мир танков",
  "Cyberpunk 2077",
  "Black Myth: Wukong",
  "Elden Ring",
  "GTA V",
  "Minecraft",
  "Rocket League",
];

/** What every seat has besides the hardware: network, accounts, the installed library. */
export function EverySeat() {
  return (
    <section aria-labelledby="every-title" className="wrap section">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <Reveal as="h2" id="every-title">
          На каждом месте
        </Reveal>
        <Reveal as="p" order={1} className="max-w-[52ch] text-soft">
          Одинаково во всех трёх залах: сеть, лаунчеры и библиотека игр.
        </Reveal>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal as="li" key={f.title} order={i} className="rounded-tile bg-surface p-5">
            <span className="grid size-10 place-items-center rounded-full bg-surface-2 text-neon">
              <f.icon className="size-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-lead">{f.title}</h3>
            <p className="mt-1 text-small text-soft">{f.text}</p>
          </Reveal>
        ))}
      </ul>

      <div className="mt-3 grid gap-3 lg:grid-cols-12">
        <Reveal order={1} className="rounded-tile bg-surface p-5 md:p-6 lg:col-span-4">
          <h3 className="text-lead">Лаунчеры</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {launchers.map((l) => (
              <li key={l} className="rounded-full bg-black px-3 py-1.5 text-small">
                {l}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal order={2} className="rounded-tile bg-surface p-5 md:p-6 lg:col-span-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-lead">Установлено</h3>
            <p className="text-small text-soft">и ещё 60 игр по запросу</p>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-small sm:grid-cols-3">
            {library.map((g) => (
              <li key={g} className="flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-neon" aria-hidden="true" />
                {g}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
