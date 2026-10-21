export const LANGS = ["uz", "ru"] as const;
export type Lang = (typeof LANGS)[number];

export function parseLang(v: unknown): Lang {
  const s = Array.isArray(v) ? v[0] : v;
  return s === "ru" ? "ru" : "uz";
}

const MONTHS: Record<Lang, string[]> = {
  uz: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
};
const MONTH_TITLES: Record<Lang, string[]> = {
  uz: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
};
const WEEKDAYS: Record<Lang, string[]> = {
  uz: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
  ru: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
};
const WEEKDAY_SHORT: Record<Lang, string[]> = {
  uz: ["Du", "Se", "Chor", "Pay", "Ju", "Sha", "Ya"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
};
export const months = (l: Lang) => MONTHS[l];
export const monthTitles = (l: Lang) => MONTH_TITLES[l];
export const weekdays = (l: Lang) => WEEKDAYS[l];
export const weekdayShort = (l: Lang) => WEEKDAY_SHORT[l];

/** Taklifnoma, mehmon sahifasi va formalardagi barcha qat'iy matnlar. Foydalanuvchi kiritgan matn tarjima qilinmaydi. */
export type Dict = {
  invitation: string; arrived: string; forYou: string; sentYou: string; inviteUs: string;
  tapOpen: string; tapSeal: string; tapHeart: string; openDoors: string; swipeUp: string; open: string; ariaOpen: string;
  nikohDay: string; invitedYou: string; ourWedding: string; weddingInvite: string; nikohInvite: string;
  hello: string; defaultText: string; dear: (name: string) => string;
  weddingDay: string; fullDate: (weekday: string, day: string, month: string, year: string, time: string) => string;
  untilWedding: string; started: string; units: [string, string, string, string]; ariaTimer: string;
  program: string; address: string; map: string; dress: string; waitYou: string;
  gallery: string; wishesTitle: string;
  music: { off: string; on: string; play: string; stop: string; volume: string; ariaVolume: string; failPlay: string; failLoad: string };
  rsvp: {
    title: string; name: string; yes: string; no: string; guests: string; send: string; sending: string;
    need: string; thanksYes: string; thanksNo: string; fail: string;
  };
  wish: {
    title: string; name: string; text: string; send: string; sending: string; need: string; fail: string;
    thanks: string; empty: string; loadFail: string; count: (n: number) => string;
  };
  actions: { calendar: string; share: string; calDone: string; copied: string; shareFail: string; calTitle: (a: string, b: string) => string };
  langName: string; switchTo: string;
};

const uz: Dict = {
  invitation: "Taklifnoma", arrived: "keldi", forYou: "Siz uchun", sentYou: "Sizga taklifnoma keldi",
  inviteUs: "Sizni to‘yimizga taklif qilamiz",
  tapOpen: "Ochish uchun bosing", tapSeal: "Muhrni bosing", tapHeart: "Yurakcha ustiga bosing",
  openDoors: "Darvozani ochish", swipeUp: "Yuqoriga suring (yoki bosing)", open: "Ochish", ariaOpen: "Taklifnomani ochish",
  nikohDay: "Nikoh kuni", invitedYou: "Siz to‘yimizga taklif etilgansiz", ourWedding: "Bizning to‘yimiz",
  weddingInvite: "To‘y uchun taklifnoma", nikohInvite: "Nikoh to‘yiga taklif",
  hello: "Assalomu alaykum",
  defaultText: "Hayotimizdagi eng baxtli kunda biz bilan birga bo‘lishingizni istaymiz. Sizni to‘yimizga taklif qilamiz.",
  dear: (n) => `Hurmatli ${n}!`,
  weddingDay: "To‘y kuni",
  fullDate: (w, d, m, y, t) => `${w}, ${d}-${m} ${y}-yil, soat ${t}`,
  untilWedding: "To‘ygacha", started: "To‘y marosimi boshlangan yoki o‘tib ketgan",
  units: ["kun", "soat", "daqiqa", "soniya"], ariaTimer: "To‘ygacha qolgan vaqt",
  program: "To‘y dasturi", address: "Manzil", map: "Xaritada ko‘rish / yo‘nalish olish", dress: "Kiyim kodi",
  waitYou: "Sizni kutamiz!", gallery: "Lahzalarimiz", wishesTitle: "Tilaklar kitobi",
  music: { off: "Musiqani o‘chirish", on: "Musiqani yoqish", play: "Musiqani yoqish", stop: "To‘xtatish", volume: "Ovoz", ariaVolume: "Ovoz balandligi", failPlay: "Audioni ijro etib bo‘lmadi. Qayta urinib ko‘ring.", failLoad: "Audio fayl yuklanmadi." },
  rsvp: {
    title: "Kelishingizni tasdiqlang", name: "Ismingiz", yes: "Kelaman", no: "Kela olmayman", guests: "Nechta kishi (o‘zingiz bilan)",
    send: "Yuborish", sending: "Yuborilmoqda…", need: "Ismingizni kiriting va javobni tanlang.",
    thanksYes: "Rahmat! Kelishingizni tasdiqladingiz.", thanksNo: "Javobingiz uchun rahmat. Afsuski, kela olmasligingiz yozib olindi.",
    fail: "Javobni yuborib bo‘lmadi. Qayta urinib ko‘ring.",
  },
  wish: {
    title: "Tilak qoldiring", name: "Ismingiz", text: "Tilagingiz", send: "Tilakni yuborish", sending: "Yuborilmoqda…",
    need: "Ism va tilak matnini kiriting.", fail: "Tilakni yuborib bo‘lmadi. Qayta urinib ko‘ring.",
    thanks: "Rahmat! Tilagingiz kitobga yozildi.", empty: "Hozircha tilaklar yo‘q. Birinchi bo‘ling!", loadFail: "Tilaklarni yuklab bo‘lmadi.",
    count: (n) => `${n} ta tilak`,
  },
  actions: {
    calendar: "Taqvimga qo‘shish", share: "Havolani ulashish",
    calDone: "Taqvim fayli yuklandi. Uni ochsangiz, tadbir taqvimingizga qo‘shiladi.", copied: "Havola nusxalandi.",
    shareFail: "Ulashib bo‘lmadi. Havolani brauzer manzil satridan nusxalang.", calTitle: (a, b) => `${a} va ${b} to‘yi`,
  },
  langName: "O‘zbekcha", switchTo: "Русский",
};

const ru: Dict = {
  invitation: "Приглашение", arrived: "для вас", forYou: "Для вас", sentYou: "Вам пришло приглашение",
  inviteUs: "Приглашаем вас на нашу свадьбу",
  tapOpen: "Нажмите, чтобы открыть", tapSeal: "Нажмите на печать", tapHeart: "Нажмите на сердечко",
  openDoors: "Открыть ворота", swipeUp: "Проведите вверх (или нажмите)", open: "Открыть", ariaOpen: "Открыть приглашение",
  nikohDay: "День никаха", invitedYou: "Вы приглашены на нашу свадьбу", ourWedding: "Наша свадьба",
  weddingInvite: "Свадебное приглашение", nikohInvite: "Приглашение на никах",
  hello: "Ассаламу алейкум",
  defaultText: "Мы хотим, чтобы вы разделили с нами самый счастливый день нашей жизни. Приглашаем вас на нашу свадьбу.",
  dear: (n) => `Уважаемый(ая) ${n}!`,
  weddingDay: "День свадьбы",
  fullDate: (w, d, m, y, t) => `${w}, ${d} ${m} ${y} г., в ${t}`,
  untilWedding: "До свадьбы", started: "Свадебная церемония уже началась или прошла",
  units: ["дней", "часов", "минут", "секунд"], ariaTimer: "Время до свадьбы",
  program: "Программа", address: "Адрес", map: "Показать на карте / построить маршрут", dress: "Дресс-код",
  waitYou: "Ждём вас!", gallery: "Наши моменты", wishesTitle: "Книга пожеланий",
  music: { off: "Выключить музыку", on: "Включить музыку", play: "Включить музыку", stop: "Остановить", volume: "Громкость", ariaVolume: "Громкость звука", failPlay: "Не удалось воспроизвести аудио. Попробуйте ещё раз.", failLoad: "Аудиофайл не загрузился." },
  rsvp: {
    title: "Подтвердите своё присутствие", name: "Ваше имя", yes: "Приду", no: "Не смогу прийти", guests: "Сколько человек (с вами)",
    send: "Отправить", sending: "Отправка…", need: "Введите имя и выберите ответ.",
    thanksYes: "Спасибо! Вы подтвердили своё присутствие.", thanksNo: "Спасибо за ответ. К сожалению, вы не сможете прийти — мы записали это.",
    fail: "Не удалось отправить ответ. Попробуйте ещё раз.",
  },
  wish: {
    title: "Оставьте пожелание", name: "Ваше имя", text: "Ваше пожелание", send: "Отправить пожелание", sending: "Отправка…",
    need: "Введите имя и текст пожелания.", fail: "Не удалось отправить пожелание. Попробуйте ещё раз.",
    thanks: "Спасибо! Ваше пожелание записано в книгу.", empty: "Пока пожеланий нет. Будьте первым!", loadFail: "Не удалось загрузить пожелания.",
    count: (n) => `Пожеланий: ${n}`,
  },
  actions: {
    calendar: "Добавить в календарь", share: "Поделиться ссылкой",
    calDone: "Файл календаря загружен. Откройте его, и событие добавится в ваш календарь.", copied: "Ссылка скопирована.",
    shareFail: "Не удалось поделиться. Скопируйте ссылку из адресной строки браузера.", calTitle: (a, b) => `Свадьба: ${a} и ${b}`,
  },
  langName: "Русский", switchTo: "O‘zbekcha",
};

export const DICTS: Record<Lang, Dict> = { uz, ru };
export const dict = (l: Lang): Dict => DICTS[l];
