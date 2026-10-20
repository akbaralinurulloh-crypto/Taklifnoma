# Taklifnoma Sayt

Raqamli to‘y taklifnomalari platformasi: foydalanuvchi ma’lumot kiritadi, rasm yuklaydi, oltita dizayndan birini
tanlaydi, taklifnomani saqlab nashr qiladi va noyob havolani mehmonlarga yuboradi.

Texnologiyalar: Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Storage + RLS), zod.

> **Holat:** kod tayyor, lekin haqiqiy Supabase va hosting hisoblari bo‘lmagani uchun sayt hali internetda emas va
> haqiqiy ma’lumotlar bazasiga qarshi testlar o‘tkazilmagan. Batafsil: [`REPORT.md`](./REPORT.md).

## 1. Lokal ishga tushirish

```bash
npm install
cp .env.example .env.local     # keyin qiymatlarni to'ldiring (2-bo'limga qarang)
npm run dev                    # http://localhost:3000
```

Foydali buyruqlar:

| Buyruq | Vazifasi |
|---|---|
| `npm run check` | lint + TypeScript + unit testlar + production build |
| `npm test` | unit va route testlari (Supabase talab qilmaydi) |
| `npm run test:integration` | **haqiqiy** Supabase'ga qarshi testlar (RLS ham). Kalitlarsiz o‘tkazib yuboriladi |
| `npm run test:e2e` | Playwright (brauzer testlari, 360/390/planshet/1366 px). Avval: `npx playwright install chromium` |

Supabase sozlanmaguncha sayt ishga tushadi, lekin “Saqlash” tugmasi o‘chirilgan turadi va `/api/health` **503**
qaytaradi. Bu ataylab: soxta muvaffaqiyat xabari chiqmaydi.

## 2. Supabase sozlash (sizning harakatingiz kerak)

1. [supabase.com](https://supabase.com) da hisob oching va **New project** yarating. Ma’lumotlar bazasi parolini
   xavfsiz joyda saqlang.
2. **SQL Editor** ga kiring va ketma-ket ishga tushiring:
   1. `supabase/migrations/0001_init.sql` (jadvallar, cheklovlar, RLS, Storage bucket’lar)
   2. `supabase/migrations/0002_rsvp_unique.sql`
3. **Storage** bo‘limida ikkita bucket paydo bo‘lganini tekshiring: `invitation-photos` (8 MB, faqat JPG/PNG/WebP) va
   `music`. Ikkalasi ommaviy (public) o‘qiladi, yozish faqat server orqali.
4. **Project Settings → API** dan oling: *Project URL*, *anon key*, *service_role key*.
5. `.env.local` fayliga yozing (qiymatlarni hech kimga, shu jumladan chatga yubormang):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # faqat server. NEXT_PUBLIC_ bilan BOSHLAMANG
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ADMIN_SECRET=...                     # kamida 16 belgi, masalan: openssl rand -base64 24
   ```

6. Tekshirish: `npm run test:integration` va brauzerda `http://localhost:3000/api/health` (`"status":"ok"` bo‘lishi kerak).

## 3. Musiqa (yor-yor) qo‘shish

Musiqa katalogi boshida **bo‘sh**: litsenziyasi tasdiqlanmagan audio joylashtirilmaydi.

1. `ADMIN_SECRET` ni o‘rnating va `/admin` ga kiring.
2. **Audio katalogi → Yangi audio qo‘shish**: nom, fayl (MP3/OGG/WAV/M4A, 15 MB gacha) va
   “litsenziyam bor” belgisi. Fayl turi serverda baytlar bo‘yicha tekshiriladi.
3. Faqat o‘zingiz yozgan, muallifdan yozma ruxsat olingan yoki bepul litsenziyali (masalan CC0) yozuvlarni joylang.
4. Katalogdagi audio taklifnoma yaratishda tanlash uchun paydo bo‘ladi; “O‘chirib qo‘yish” uni yangi tanlovlardan
   yashiradi va mavjud taklifnomalarda ham ko‘rsatmaydi.

## 4. Vercel’ga joylashtirish

1. Loyihani GitHub repository’ga yuklang.
2. [vercel.com](https://vercel.com) → **Add New → Project** → repository’ni tanlang (Framework: Next.js avtomatik).
3. **Environment Variables** ga 2-bo‘limdagi o‘zgaruvchilarni kiriting. `NEXT_PUBLIC_SITE_URL` ga hozircha Vercel bergan
   manzilni yozing.
4. **Deploy**. Tugagach `https://<manzil>/api/health` **200** va `"status":"ok"` qaytarishi kerak.
5. Domen ulangach `NEXT_PUBLIC_SITE_URL` ni haqiqiy domenga o‘zgartirib **qayta deploy** qiling (`NEXT_PUBLIC_*`
   qiymatlari build vaqtida qotadi).

### Domen va HTTPS

Vercel loyihasi → **Settings → Domains** → domenni qo‘shing va Vercel ko‘rsatgan DNS yozuvlarini domen
registratoringizda (masalan `.uz` registratori) kiriting. HTTPS sertifikati Vercel tomonidan avtomatik beriladi.
Kod ham HTTPS’ni kutadi: admin cookie production’da `Secure` bilan beriladi.

### Xavfsizlik uchun tavsiya

Xotiradagi rate limit serverless’da har nusxa uchun alohida ishlaydi. Jiddiy yuklama yoki suiiste’mol xavfi bo‘lsa
Vercel Firewall (rate limiting) yoki Upstash kabi umumiy xizmat qo‘shing.

## 5. Backup va tiklash

- **Ma’lumotlar bazasi:** Supabase rejangizdagi avtomatik backup/PITR imkoniyatlarini tekshiring (bepul rejada
  cheklangan bo‘lishi mumkin). Qo‘shimcha: muntazam `pg_dump` (ulanish satri: *Project Settings → Database*):

  ```bash
  pg_dump "$DATABASE_URL" --no-owner --format=custom -f backup-$(date +%F).dump
  # tiklash
  pg_restore --no-owner -d "$TARGET_DATABASE_URL" backup-YYYY-MM-DD.dump
  ```

- **Storage fayllari** (rasm va audio) ma’lumotlar bazasi backup’iga kirmaydi: ularni alohida nusxalang
  (Supabase Storage S3 ulanishi yoki dashboard orqali).
- Tiklashdan keyin `/api/health` va bitta taklifnomani ochib tekshiring.

## 6. Arxitektura qisqacha

- `src/lib/schema.ts` — brauzer va serverda umumiy validatsiya (zod), Toshkent vaqti, ortga hisoblash.
- `src/lib/server/*` — faqat server: `service.ts` (biznes mantiq), `repo.supabase.ts` (baza), `storage.ts`, `admin.ts`.
- `src/components/templates/*` — oltita alohida dizayn; preview va ommaviy sahifa bir xil `InvitationView` dan foydalanadi.
- `supabase/migrations/*` — sxema va RLS.
- Tahrirlash: yaratilganda brauzer tasodifiy maxfiy token yaratadi; serverga faqat uning SHA-256 hash’i yoziladi.
  Tahrirlash havolasi (`/edit/<token>`) faqat egasida qoladi. Ommaviy havola (`/i/<slug>`) hech qanday boshqaruv huquqi bermaydi.
- Ommaviy foydalanuvchi bazadan faqat `published` qatorlarning ochiq ustunlarini o‘qiy oladi (RLS + ustun GRANT’lari);
  barcha yozish amallari server (service role) orqali.

## 7. Ma’lum cheklovlar

- Taklifnoma yaratilmagan holda yuklangan rasmlar (foydalanuvchi sahifani yopib ketsa) Storage’da qolib ketishi mumkin:
  vaqti-vaqti bilan “biriktirilmagan rasmlar”ni tozalash vazifasi hali yozilmagan.
- Admin panelda dizaynlar faqat ko‘rsatiladi (ular kod ichidagi template’lar); yangi dizayn qo‘shish dasturchi ishi.
- Foydalanuvchi hisoblari yo‘q: tahrirlash faqat maxfiy havola orqali. Havola yo‘qolsa, qayta tiklab bo‘lmaydi.
- Maxfiylik siyosati va foydalanish shartlari qoralama, yuridik ko‘rikdan o‘tmagan.
- Shriftlar tizim shriftlari (tashqi shrift xizmatiga bog‘lanmaslik uchun).
