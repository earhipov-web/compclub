import { games, tiers } from "@/lib/data";
import { Reveal } from "./reveal";

const barTone: Record<string, string> = {
  standard: "bg-mint-4",
  pro: "bg-mint-3",
  vip: "bg-neon",
};

/** Frame rates of the three classes, one game per card, bars scaled within the game. */
export function FpsTable() {
  return (
    <section id="fps" aria-labelledby="fps-title" className="wrap section">
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <Reveal as="h2" id="fps-title">
          FPS в тяжёлых играх
        </Reveal>
        <Reveal as="p" order={1} className="max-w-[52ch] text-soft">
          Ориентировочные цифры на родном разрешении монитора каждого класса, без генерации кадров.
        </Reveal>
      </div>

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {games.map((g, i) => {
          const top = Math.max(...Object.values(g.fps));
          return (
            <Reveal as="li" key={g.title} order={i} className="rounded-tile bg-surface p-5">
              <h3 className="text-lead">{g.title}</h3>
              <p className="mt-0.5 text-small text-soft">{g.setting}</p>
              <dl className="mt-4 flex flex-col gap-2">
                {tiers.map((t) => {
                  const v = g.fps[t.id];
                  return (
                    <div key={t.id} className="grid grid-cols-[72px_minmax(0,1fr)_64px] items-center gap-3 text-small">
                      <dt className="text-soft">{t.name}</dt>
                      <dd className="contents">
                        <span className="h-2 overflow-hidden rounded-full bg-black" aria-hidden="true">
                          <span className={`block h-full rounded-full ${barTone[t.id]}`} style={{ width: `${(v / top) * 100}%` }} />
                        </span>
                        <span className="text-right font-semibold tabular-nums">{v} FPS</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
