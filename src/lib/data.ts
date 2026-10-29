// Content of the club: tiers, the private room, games for the FPS table and the snack-bar menu.
// Prices of goods and FPS figures are sample values to confirm before launch.

export type ZoneId = "standard" | "pro" | "vip" | "room";

export type Spec = { label: string; value: string };

export type Tier = {
  id: Exclude<ZoneId, "room">;
  name: string;
  price: number;
  seats: { from: number; to: number };
  photo: { src: string; alt: string; width: number; height: number };
  pitch: string;
  specs: Spec[];
};

export const tiers: Tier[] = [
  {
    id: "standard",
    name: "Стандарт",
    price: 100,
    seats: { from: 1, to: 24 },
    photo: {
      src: "/images/pc-standard.jpg",
      alt: "Чёрный игровой ПК со снятой боковой панелью: жидкостное охлаждение процессора, видеокарта и мягкая подсветка",
      width: 1600,
      height: 1067,
    },
    pitch: "Для CS2, Valorant, Dota 2 и любой сетевой игры на 180 кадрах.",
    specs: [
      { label: "Процессор", value: "AMD Ryzen 5 7500F, 6 ядер, до 5,0 ГГц" },
      { label: "Видеокарта", value: "NVIDIA GeForce RTX 5060 Ti, 16 ГБ" },
      { label: "Память", value: "32 ГБ DDR5-6000" },
      { label: "Накопитель", value: "SSD NVMe 1 ТБ" },
      { label: "Охлаждение", value: "Башенный кулер, 4 вентилятора в корпусе" },
      { label: "Монитор", value: "Xiaomi Gaming Monitor G24i: 23,8″, 1920×1080, IPS, 180 Гц" },
      { label: "Периферия", value: "Механическая клавиатура, мышь 26 000 DPI, гарнитура 7.1" },
    ],
  },
  {
    id: "pro",
    name: "Про",
    price: 150,
    seats: { from: 25, to: 42 },
    photo: {
      src: "/images/pc-pro.jpg",
      alt: "Белый игровой ПК с видеокартой GeForce RTX, жидкостным охлаждением и RGB-подсветкой вентиляторов",
      width: 1920,
      height: 1920,
    },
    pitch: "Новинки на ультра-настройках и стабильные 240 кадров в шутерах.",
    specs: [
      { label: "Процессор", value: "AMD Ryzen 7 7800X3D, 8 ядер, 96 МБ кэша" },
      { label: "Видеокарта", value: "NVIDIA GeForce RTX 5070 Ti, 16 ГБ" },
      { label: "Память", value: "32 ГБ DDR5-6000" },
      { label: "Накопитель", value: "SSD NVMe 2 ТБ" },
      { label: "Охлаждение", value: "Жидкостное, радиатор 240 мм" },
      { label: "Монитор", value: "AOC 27G4X: 27″, 1920×1080, IPS, 180 Гц" },
      { label: "Периферия", value: "Клавиатура с оптическими свитчами, мышь 58 г, гарнитура 7.1" },
    ],
  },
  {
    id: "vip",
    name: "VIP",
    price: 250,
    seats: { from: 43, to: 50 },
    photo: {
      src: "/images/pc-vip-o11.jpg",
      alt: "Игровой ПК в стеклянном корпусе Lian Li O11 Dynamic с кастомным водяным охлаждением и зелёной подсветкой",
      width: 1600,
      height: 1200,
    },
    pitch: "Самое мощное железо в клубе: трассировка лучей без компромиссов.",
    specs: [
      { label: "Процессор", value: "AMD Ryzen 7 9800X3D, 8 ядер, до 5,2 ГГц" },
      { label: "Видеокарта", value: "NVIDIA GeForce RTX 5090, 32 ГБ" },
      { label: "Память", value: "64 ГБ DDR5-6400" },
      { label: "Накопитель", value: "SSD NVMe PCIe 5.0, 2 ТБ" },
      { label: "Охлаждение", value: "Жидкостное, радиатор 360 мм" },
      { label: "Монитор", value: "AOC Q27G3XMN: 27″, 2560×1440, Mini-LED, 180 Гц" },
      { label: "Периферия", value: "Беспроводная мышь 8000 Гц, клавиатура на магнитных свитчах" },
    ],
  },
];

export const room = {
  id: "room" as const,
  name: "Приватная комната",
  price: 500,
  seats: 2,
};

// FPS: native resolution of each tier's monitor, maximum settings, no frame generation.
export type Game = {
  title: string;
  setting: string;
  fps: Record<Tier["id"], number>;
};

export const games: Game[] = [
  {
    title: "Cyberpunk 2077",
    setting: "ультра, трассировка лучей, DLSS «Качество»",
    fps: { standard: 60, pro: 95, vip: 120 },
  },
  {
    title: "Black Myth: Wukong",
    setting: "кинематографические, DLSS «Качество»",
    fps: { standard: 55, pro: 85, vip: 115 },
  },
  {
    title: "Alan Wake 2",
    setting: "высокие, трассировка лучей, DLSS «Качество»",
    fps: { standard: 50, pro: 80, vip: 110 },
  },
  {
    title: "Call of Duty: Warzone",
    setting: "максимальные",
    fps: { standard: 120, pro: 180, vip: 240 },
  },
  {
    title: "Counter-Strike 2",
    setting: "максимальные",
    fps: { standard: 300, pro: 450, vip: 600 },
  },
];

export type MenuItem = { name: string; size?: string; price: number };
export type MenuGroup = { title: string; items: MenuItem[] };

export const menu: MenuGroup[] = [
  {
    title: "Энергетики",
    items: [
      { name: "Adrenaline Rush", size: "0,449 л", price: 150 },
      { name: "Red Bull", size: "0,25 л", price: 180 },
      { name: "Burn", size: "0,449 л", price: 150 },
      { name: "Gorilla", size: "0,45 л", price: 130 },
      { name: "Flash Up", size: "0,45 л", price: 110 },
      { name: "Tornado Energy", size: "0,45 л", price: 100 },
    ],
  },
  {
    title: "Газировка",
    items: [
      { name: "Coca-Cola", size: "0,5 л", price: 120 },
      { name: "Fanta", size: "0,5 л", price: 120 },
      { name: "Sprite", size: "0,5 л", price: 120 },
      { name: "Добрый Cola", size: "0,5 л", price: 100 },
      { name: "Черноголовка Байкал", size: "0,5 л", price: 100 },
    ],
  },
  {
    title: "Вода, сок и холодный чай",
    items: [
      { name: "BonAqua без газа", size: "0,5 л", price: 70 },
      { name: "Сок Добрый, яблоко", size: "0,2 л", price: 70 },
      { name: "Lipton Ice Tea, лимон", size: "0,5 л", price: 120 },
    ],
  },
  {
    title: "Чипсы",
    items: [
      { name: "Lay's, сметана и зелень", size: "140 г", price: 190 },
      { name: "Pringles, оригинальные", size: "165 г", price: 290 },
      { name: "Doritos, сыр", size: "100 г", price: 170 },
      { name: "Cheetos, кетчуп", size: "85 г", price: 120 },
    ],
  },
  {
    title: "Сухарики и орешки",
    items: [
      { name: "Кириешки, холодец с хреном", size: "40 г", price: 60 },
      { name: "Хрусteam багет, сыр", size: "60 г", price: 80 },
      { name: "Три корочки, бекон", size: "40 г", price: 60 },
      { name: "Арахис солёный", size: "50 г", price: 90 },
    ],
  },
  {
    title: "Сладкое",
    items: [
      { name: "Snickers", price: 90 },
      { name: "Twix", price: 90 },
      { name: "KitKat", price: 90 },
      { name: "Choco Pie", size: "1 шт", price: 40 },
    ],
  },
  {
    title: "Горячее",
    items: [
      { name: "Доширак с говядиной", price: 120 },
      { name: "Хот-дог", price: 180 },
      { name: "Сэндвич с курицей", price: 220 },
    ],
  },
  {
    title: "Чай и кофе",
    items: [
      { name: "Американо", size: "300 мл", price: 120 },
      { name: "Капучино", size: "300 мл", price: 160 },
      { name: "Чай чёрный или зелёный", size: "400 мл", price: 80 },
    ],
  },
];

export const club = {
  // Sample contact details: replace before launch.
  street: "ул. Пушкина, 12",
  city: "Москва, 101000",
  hours: "Круглосуточно, без выходных",
  phone: "+7 (900) 123-45-67",
  phoneHref: "tel:+79001234567",
  telegram: "https://t.me/compclub",
  vk: "https://vk.com/compclub",
};
