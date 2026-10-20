# Yakuniy hisobot — Taklifnoma Sayt

Sana: 2026-10-20. Bu hisobot faqat haqiqatan bajarilgan tekshiruvlarga tayanadi. Tashqi akkaunt (Supabase, Vercel,
domen) yoki brauzer yetishmagan joylar **“bloklangan”** deb belgilangan; ular “o‘tdi” hisoblanmaydi.

## Umumiy xulosa

**Loyiha TZ ning “yakuniy qabul sharti” bo‘yicha hali tayyor emas**: asosiy oqim (ma’lumot → rasm → dizayn → saqlash →
nashr → URL → boshqa qurilmada ochish) haqiqiy Supabase’da hali bir marta ham ishga tushirilmagan, chunki Supabase
loyihasi yo‘q. Tashqi xizmatlarsiz bajarilishi mumkin bo‘lgan hamma narsa yozilgan va sinalgan.

## Haqiqiy tekshiruv natijalari

| Tekshiruv | Natija |
|---|---|
| ESLint | o‘tdi |
| TypeScript (`tsc --noEmit`) | o‘tdi |
| Unit/route testlari (Vitest) | **98 o‘tdi**, 0 yiqildi |
| Supabase integratsiya testlari | **7 ta o‘tkazib yuborildi** (kalit yo‘q: bloklangan) |
| Production build (`next build`) | o‘tdi, 21 ta route |
| `npm audit --omit=dev` | 0 zaiflik |
| SSR smoke (`next start`, Supabase’siz) | sahifalar 200; `/api/health` 503 `degraded`; noto‘g‘ri forma 400 (o‘zbekcha xabarlar); `/edit/*` sarlavhalari (`no-referrer`, `no-store`, `noindex`); dinamik `notFound()` haqiqiy **404** qaytardi |
| Client bundle’da service-role kaliti | topilmadi |
| Playwright (brauzer) | **bloklangan**: Chromium yuklab olinmadi (tarmoq cheklovi) |

## Yangilanish (2026-10-21)

- Sana qoidasi yumshatildi: to‘y sanasi 3 oydan ko‘proq o‘tib ketgan bo‘lsa rad etiladi, yaqinda o‘tgan sana qabul qilinadi (mavjud bo‘lmagan sana, masalan 31-fevral, baribir rad etiladi). Servis testlari yangilandi.
- Oltita dizayn animatsiya va bezaklar bilan boyitildi (faqat CSS; `prefers-reduced-motion` hurmat qilinadi).
- Vercel’da haqiqiy joylashtirish: `/api/health` → `status: ok, config: ok, database: ok` (Supabase bilan ulanish tasdiqlandi).
- Chromium’da (390 px) oltita dizayn rendi ko‘zdan kechirildi: gorizontal skroll yo‘q, konsol xatosi yo‘q. Haqiqiy rasm bilan, planshet va kompyuter o‘lchamlarida tekshiruv o‘tkazilmagan.

## 21-bo‘lim jadvali

| Funksiya | Holati | Dalil yoki test |
|---|---|---|
| Bosh sahifa | Qisman | Kod, build va SSR smoke (200, 6 dizayn nomi, havolalar). Brauzerda vizual tekshiruv bloklangan |
| Ma’lumot kiritish | Bajarildi (mantiq) | Client va server validatsiyasi testlari (probel, format, mavjud bo‘lmagan sana, o‘tgan sana, uzunlik, o‘zbekcha xabarlar). UI brauzerda tekshirilmagan |
| Rasm yuklash | Qisman | Server tekshiruvi testlangan (magic bytes, 8 MB, soxta `.png` rad etiladi). **Haqiqiy Storage testi bloklangan** |
| Oltita dizayn | Bajarildi (kod) | 6 template × 6 render testi (to‘liq/bo‘sh ma’lumot, XSS, uzun ism), tuzilmaviy farq testi. Telefon/planshet/kompyuterda vizual tekshiruv bloklangan |
| Musiqa | Qisman | Boshqaruv kodi va admin yuklash (litsenziya tasdig‘i, fayl turi) testlangan. **Audio fayllar yo‘q**, katalog bo‘sh, haqiqiy ijro tekshirilmagan |
| Jonli preview | Qisman | Bir xil `InvitationView`, build va render testlari. Brauzerda kiritish bilan sinov bloklangan (e2e yozilgan) |
| Ma’lumotlar bazasi | Qisman | Migratsiyalar va Supabase repo yozilgan; mantiq xotiradagi repo bilan testlangan. **Haqiqiy yozish/o‘qish bloklangan** |
| Nashr qilish | Qisman | Servis/route testlari: validatsiya, noyob slug, idempotentlik, o‘qib tasdiqlash. **Haqiqiy URL testi bloklangan** |
| Boshqa qurilmada ochish | Bloklangan | Haqiqiy server va baza kerak |
| Tahrirlash | Qisman | Ruxsat testlari (begona token 404, token tezlik cheklovi, hash chiqmaydi). Haqiqiy baza bilan bloklangan |
| O‘chirish | Qisman | Test: o‘chirilgach ommaviy 404, tahrirlash yopiladi, rasm tozalanadi. Haqiqiy baza bilan bloklangan |
| Mobil moslashuv | Bloklangan | Playwright Chromium yo‘q |
| Xavfsizlik | Qisman | Server tekshiruvlari, admin sessiyasi (HMAC, muddat, Origin tekshiruvi), rate limit testlangan. **RLS testlari bloklangan** (integratsiya testi yozilgan) |
| Production build | Bajarildi | `next build` o‘tdi |
| Deployment | **Bajarilmadi** | Vercel hisobi va domen yo‘q. Sayt internetda emas |

## Ishlayotgan funksiyalar (kod darajasida tasdiqlangan)

- Oltita alohida template, yagona ma’lumot modeli, preview va ommaviy sahifa uchun bir xil komponent.
- Ortga hisoblash (Toshkent vaqti), xarita havolasi (manzil bo‘lmasa chiqmaydi), musiqa boshqaruvi (fayl bo‘lmasa chiqmaydi).
- Server API: rasm yuklash, yaratish+nashr (idempotent), ommaviy o‘qish, tahrirlash/o‘chirish (token orqali), RSVP, health.
- Admin: sessiya, ro‘yxat, nashrdan olish, audio katalogi (litsenziya tasdig‘i bilan), ko‘rsatkichlar.
- Saqlash tugmasi Supabase ulanmaguncha **o‘chirilgan** va sababi yozilgan; muvaffaqiyat xabari faqat serverdan qayta o‘qib tasdiqlangandan keyin chiqadi.

## Qisman bajarilgan / bajarilmagan

- Haqiqiy baza, Storage, RLS va asosiy oqimning ishlashi: **tasdiqlanmagan**.
- Brauzer va mobil tekshiruvlar (360/390/planshet/1366 px, konsol xatolari): **o‘tkazilmagan**.
- Deployment, domen, HTTPS: **bajarilmagan**.
- Admin panelda dizaynlar faqat ro‘yxat (kod ichidagi template’lar).
- Biriktirilmagan rasmlarni tozalash vazifasi yozilmagan.

## Sizdan kerak bo‘lgan sozlamalar

1. Supabase loyihasi, migratsiyalar, kalitlar (README 2-bo‘lim).
2. Litsenziyasi aniq yor-yor audio fayllari (README 3-bo‘lim).
3. Vercel hisobi va domen (README 4-bo‘lim).
4. Keyin ishga tushiring: `npm run test:integration`, `npx playwright install chromium && npm run test:e2e`.

## Ma’lum xatolar va ogohlantirishlar

- Xotiradagi rate limit serverless’da har nusxada alohida ishlaydi (Vercel Firewall/Upstash tavsiya etiladi).
- Maxfiylik siyosati va foydalanish shartlari qoralama, yuridik ko‘rikdan o‘tmagan.
- Tahrirlash havolasi yo‘qolsa, qayta tiklab bo‘lmaydi (hisoblar yo‘q).

## Lokal ishga tushirish

```bash
npm install && cp .env.example .env.local && npm run dev
```

Production deployment qadamlari: README 4-bo‘lim.
