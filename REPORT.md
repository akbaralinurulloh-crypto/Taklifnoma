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

## Yangilanish (2026-10-21, ikkinchi): 10 dizayn va yangi sayt tuzilishi
- Dizaynlar 6 tadan 10 taga chiqdi: Registon, Bahor, Yulduzli tun, Chipta qo'shildi. Rang palitrasi zumrad + olovrang.
- Yangi sahifalar: `/dizaynlar` (galereya), `/namuna/[dizayn]` (to'liq namuna), `sitemap.xml`, `robots.txt`.
- `/create?dizayn=...` tanlangan dizaynni oldindan tanlaydi.
- Mehmon sahifasi (`/i/[slug]`): konvert qopqog'i (muhrni bosganda ochiladi), "Taqvimga qo'shish" (.ics, davomiyligi taxminan 4 soat), "Havolani ulashish".
- **Migratsiya 0003** (`supabase/migrations/0003_more_designs.sql`) Supabase'da qo'lda ishga tushirilishi shart, aks holda yangi dizaynlarni saqlab bo'lmaydi.
- Tekshirildi: lint, tsc, 123 test, build; 390 va 1280 px da gorizontal siljish yo'q. Haqiqiy bazadagi `/i/[slug]` qopqog'i brauzerda faqat vaqtinchalik sahifada sinaldi (haqiqiy slug bilan emas).
- Cheklovlar o'zgarmadi: xotiradagi rate-limit, rasm tozalash yo'q, foydalanuvchi hisoblari yo'q, huquqiy sahifalar qoralama, musiqa katalogi bo'sh.

## Yangilanish (2026-10-21, uchinchi): taklifnoma tizimi noldan qayta qurildi
- **Yangi taklifnoma tuzilmasi** (hamma shablonda bir xil ketma-ketlik): ochilish ekrani → bosh ekran → ota-ona taklifi va "Assalomu alaykum" → to'y kuni va oylik taqvim → to'ygacha sanoq → to'y dasturi → manzil/xarita → kiyim kodi → "Sizni kutamiz".
- **10 ta yangi shablon**: Anor, Osmon, Zarrin, Oq va qora, Zaytun, Shokolad, Gul chizma, Muhr, Firuza, Atlas. Har birining o'z rangi va ochilish usuli: karta, konvert, mum muhr, yurak, darvoza, surib ochish.
- Bezaklar (atirgul, novda, lenta, ipak, bulut, koshin, atlas, kaptar) shu loyiha uchun chizilgan vektor shakllar. Boshqa saytlardan rasm olinmagan.
- Shriftlar o'z serverimizdan (@fontsource: Great Vibes, Playfair Display, Cormorant Garamond), tashqi CDN yo'q.
- Yaratish formasiga qo'shildi: ota-ona matni, kiyim kodi, to'y dasturi (8 qatorgacha). Dizayn tanlashda har shablonning jonli kichik ko'rinishi chiqadi.
- Bosh sahifa qayta yozildi (shablonlar, imkoniyatlar, mehmonlar javobi, qanday ishlaydi, savollar).
- **Migratsiya 0004** (`supabase/migrations/0004_new_invitation_fields.sql`) Supabase'da qo'lda ishga tushirilishi SHART: yangi ustunlar qo'shadi, eski dizayn nomli taklifnomalarni "osmon" ga o'tkazadi.
- Tekshirildi: lint, tsc, 129 test, build; 390 px da 10 shablonning ochilish va asosiy qismi brauzerda ko'rildi, gorizontal siljish va konsol xatosi yo'q.
- **Hali qilinmagan:** foto galereya (bir nechta rasm yuklash), mehmonlarga shaxsiy havola, tilaklar kitobi, rus tili, QR-kod, narx/to'lov. Juftlik surati yuklangan holat brauzerda hali ko‘rilmagan: faqat suratsiz holat ko‘rildi.

## To'rtinchi yangilanish: galereya, tilaklar, QR, rus tili

- **Migratsiya 0005 majburiy** (`supabase/migrations/0005_gallery_wishes.sql`): `invitations.gallery`, `rsvps.guests`, `wishes` jadvali.
- Galereya: 6 tagacha rasm (yuklash, tartib, o'chirish); taklifnomada "Lahzalarimiz" bo'limi va to'liq ekran ko'rish.
- Mehmon javobida kishilar soni (1-10); egasi umumiy sonni ko'radi.
- Tilaklar kitobi: mehmon yozadi, hamma ko'radi; egasi tahrirlash sahifasida ko'radi.
- Shaxsiy havola: `/i/<slug>?mehmon=Ism` ("Hurmatli Ism!" va forma ismi to'ldirilgan). Egasi ismlar ro'yxatidan havolalar yaratadi.
- QR-kod: nashrdan keyin va tahrirlash sahifasida, PNG yuklab olinadi.
- Rus tili: `?lang=ru` va taklifnomadagi til tugmasi. Qat'iy matnlar tarjima qilinadi, foydalanuvchi yozgan matn o'zgarmaydi.
- Juftlik surati yuklangan holat 10 dizaynda brauzerda ko'rib tekshirildi.
- Narx va to'lov: foydalanuvchi qaroriga ko'ra qilinmadi.

## Beshinchi yangilanish: skeletlar, musiqa, bezaklar

- **Migratsiya 0006** (`0006_builtin_music.sql`): 10 ta tayyor musiqa katalogga qo'shiladi.
- Musiqa: `public/music/*.mp3` (har biri 64 soniya, takrorlanadi). Hammasi `scripts/make_music.py` bilan **sintez qilingan original instrumental** (tashqi audio yo'q, litsenziya muammosi yo'q). Tirik ijro emas: sintezator ovozi. Tinglab ko'ring; yoqmasa /admin orqali o'z (litsenziyali) treklaringizni qo'shing.
- Uch skelet: `cards` (kartalar: anor, osmon, atlas), `story` (uzluksiz hikoya: zaytun, shokolad, gulchizma, muhr), `slides` (to'liq ekranli bo'limlar: zarrin, oqqora, firuza). Galereya ham skeletga qarab farq qiladi (to'r, ustma-ust, surish).
- Bezaklar: gradientli va soyali atirgul, tomirli barglar, SVG qog'oz to'qimasi. Bular vektor chizmalar, fotosurat emas.

## Oltinchi yangilanish: animatsiyalar, 5 yangi dizayn, musiqa

- Yozuvlar ~15% kattalashtirildi.
- Konvert ochilganda tanlangan musiqa o'zi boshlanadi (bosish = brauzer ruxsati); pastda doimiy "Musiqani o'chirish/yoqish" tugmasi.
- Animatsiyalar: har dizaynda o'z zarrachalari (gulbarg, barg, yulduz, oltin zarra, yurak, kapalak, konfetti), ekranga kirganda silliq paydo bo'lish, ism animatsiyasi, rasm suzishi/Ken Burns, kartalarda yaltirash, taqvimda yurak urishi. `prefers-reduced-motion` yoqilgan qurilmada o'chadi.
- 5 yangi dizayn: Gulbarg, Yulduzli tun, Kapalak, Oltin yog'du, Yuraklar (jami 15).
- **Migratsiya 0007**: yangi dizaynlar va 7 yangi musiqa (3 yor-yor uslubi + ballada, marsh, kelin kutib olish, raqs). Hammasi sintez qilingan original (`scripts/make_music.py`).
- Mualliflik huquqidagi qo'shiqlar (Ed Sheeran, Bojalar, Sato va h.k.) loyihaga qo'shilmadi: litsenziyasiz tarqatish mumkin emas. O'z faylingiz bo'lsa /admin orqali (litsenziya tasdig'i bilan) yuklang.

## Yangilanish 7
- Admin musiqa yuklash: fayl brauzerdan to'g'ridan-to'g'ri Supabase'ga imzolangan havola orqali yuklanadi (Vercel 4.5 MB chegarasi aylanib o'tildi), keyin server tekshiradi (≤15 MB, haqiqiy audio). Admin ro'yxatida eshitib ko'rish tugmasi bor.
- Musiqa: tanlanmagan bo'lsa dizaynga mos tayyor musiqa avtomatik; konvert ochilganda boshlanadi; pastda "Musiqani o'chirish/yoqish" tugmasi.
- Yurakli ochilish: anor (atirgulli), gulbarg, kapalak dizaynlariga qo'shildi.
- Atirgul ramkasi: asosiy rasm va galereya atrofida poya-lenta va atirgullar; bosh sahifadagi burchak atirgullari rasm bilan yo'qolmaydi.
- Animatsiyalar: aurora dog'lari, tepada o'qish chizig'i, bosganda zarrachalar, sarlavha chizig'i, ko'proq tushuvchi zarrachalar.

## Yangilanish 8 (sayt dizayni)
- Sayt ranglari to‘q ko‘k va oltin palitraga (konvert logo, yangi bosh sahifa tuzilmasi) o'tkazildi (taklifnoma dizaynlariga tegilmadi).
- Yangi sahifalar: /imkoniyatlar, /savollar; matnlar src/lib/site-content.ts'da.
- Bosh sahifa: gradient fon, ko'rsatkichlar qatori, 12 imkoniyat, 15 dizayn, savol-javob; 4 ustunli footer.
