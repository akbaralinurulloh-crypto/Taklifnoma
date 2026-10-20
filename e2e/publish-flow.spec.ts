// To'liq asosiy oqim HAQIQIY Supabase'ga qarshi: ma'lumot → rasm → dizayn → saqlash → nashr → URL →
// boshqa brauzer kontekstida ochish → tahrirlash → o'chirish. Supabase sozlanmagan bo'lsa BLOKLANGAN (skip).
import { expect, test } from "@playwright/test";

// 1x1 PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

test("asosiy oqim: yaratish → nashr → boshqa qurilmada ochish → tahrirlash → o'chirish", async ({ page, browser, request }) => {
  const health = await request.get("/api/health");
  test.skip(health.status() !== 200, "BLOKLANGAN: Supabase ulanmagan (/api/health 200 emas)");

  await page.goto("/create");
  await page.getByLabel("Kuyovning ismi").fill("Azizbek");
  await page.getByLabel("Kelinning ismi").fill("Madinabonu");
  await page.getByLabel("To‘y sanasi").fill("2099-05-20");
  await page.getByLabel("Boshlanish vaqti").fill("18:30");
  await page.getByLabel("Restoran yoki to‘yxona nomi").fill("Registon to‘yxonasi");
  await page.getByLabel("To‘yxona manzili").fill("Namangan sh., Navoiy ko‘chasi 12");
  await page.getByRole("button", { name: "Keyingisi" }).click();

  await page.getByLabel("Rasm tanlash").setInputFiles({ name: "juftlik.png", mimeType: "image/png", buffer: PNG });
  await page.getByRole("button", { name: "Keyingisi" }).click();

  await page.getByText("Hashamatli", { exact: true }).first().click();
  await page.getByRole("button", { name: /^6\. Saqlash/ }).click();
  await page.getByRole("button", { name: "Saqlash va nashr qilish" }).click();

  await expect(page.getByRole("heading", { name: "Taklifnoma nashr qilindi" })).toBeVisible({ timeout: 30_000 });
  const url = await page.getByLabel("Mehmonlar uchun havola").inputValue();
  const editUrl = await page.getByLabel("Tahrirlash havolasi").inputValue();
  expect(url).toMatch(/\/i\/azizbek-madinabonu-[a-z0-9]{4}$/);

  // Boshqa qurilma: butunlay yangi kontekst (cookie/localStorage yo'q)
  const other = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const guest = await other.newPage();
  const res = await guest.goto(url);
  expect(res?.status()).toBe(200);
  await expect(guest.getByRole("heading", { name: "Azizbek" })).toBeVisible();
  await expect(guest.getByText("Registon to‘yxonasi")).toBeVisible();
  await expect(guest.locator("img").first()).toBeVisible();
  // Mehmon tahrirlash interfeysini ko'rmaydi
  await expect(guest.getByText("Tahrirlash")).toHaveCount(0);

  // Tahrirlash
  await page.goto(editUrl);
  await page.getByLabel("Restoran yoki to‘yxona nomi").fill("Yangi to‘yxona");
  await page.getByRole("button", { name: /^6\. Saqlash/ }).click();
  await page.getByRole("button", { name: "O‘zgarishlarni saqlash" }).first().click();
  await expect(page.getByText("O‘zgarishlar serverga saqlandi")).toBeVisible({ timeout: 30_000 });
  await guest.reload();
  await expect(guest.getByText("Yangi to‘yxona")).toBeVisible();

  // Begona tokenli havola ochilmaydi
  const bad = await guest.goto(editUrl.replace(/.$/, (c) => (c === "A" ? "B" : "A")));
  expect(bad?.status()).toBe(404);

  // O'chirish
  await page.getByRole("button", { name: "O‘chirish", exact: true }).click();
  await page.getByRole("button", { name: "Ha, o‘chirish" }).click();
  await expect(page.getByRole("heading", { name: "Taklifnoma o‘chirildi" })).toBeVisible();
  const gone = await guest.goto(url);
  expect(gone?.status()).toBe(404);
  await other.close();
});
