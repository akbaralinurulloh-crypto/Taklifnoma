// Supabase talab qilmaydi: sahifalar ochilishi, gorizontal scroll yo'qligi va konsol xatolarini tekshiradi.
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/create", "/maxfiylik", "/shartlar"];

for (const path of PAGES) {
  test(`${path}: ochiladi, gorizontal scroll yo'q, konsolda xato yo'q`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    const res = await page.goto(path);
    expect(res?.status()).toBe(200);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test("noto'g'ri slug 404 sahifasini ko'rsatadi yoki (Supabase yo'q bo'lsa) 'sozlanmagan' xabarini", async ({ page }) => {
  await page.goto("/i/yoq-sahifa-1234");
  await expect(page.getByRole("heading", { name: /Taklifnoma topilmadi|Xizmat hozircha sozlanmagan/ })).toBeVisible();
});

test("forma: majburiy maydonlar bo'sh bo'lsa keyingi bosqichga o'tkazmaydi va maydon yonida xato ko'rsatadi", async ({ page }) => {
  await page.goto("/create");
  await page.getByRole("button", { name: "Keyingisi" }).click();
  await expect(page.getByText("Kuyovning ismi kiritilishi shart")).toBeVisible();
  await expect(page.getByRole("button", { name: /^2\. Rasm/ })).not.toHaveAttribute("aria-current", "step");
});

test("jonli preview kiritilgan ismlarni darhol ko'rsatadi", async ({ page, viewport }) => {
  test.skip(!!viewport && viewport.width < 1024, "Preview keng ekranda yonida, tor ekranda 5-bosqichda ko'rinadi");
  await page.goto("/create");
  await page.getByLabel("Kuyovning ismi").fill("Aziz");
  await page.getByLabel("Kelinning ismi").fill("Madina");
  const preview = page.getByLabel("Jonli ko‘rinish");
  await expect(preview).toContainText("Aziz");
  await expect(preview).toContainText("Madina");
});

test("oltita dizaynning har biri tanlanadi va previewda ko'rinadi", async ({ page, viewport }) => {
  test.skip(!!viewport && viewport.width < 1024, "Preview tor ekranda 5-bosqichda ko'rinadi");
  await page.goto("/create");
  await page.getByRole("button", { name: /^3\. Dizayn/ }).click();
  for (const name of ["Klassik", "Romantik", "Milliy", "Minimalistik", "Zamonaviy", "Hashamatli"]) {
    await page.getByText(name, { exact: true }).first().click();
    await expect(page.getByLabel("Jonli ko‘rinish").locator("section")).toBeVisible();
  }
});

test("Supabase yo'q bo'lsa 'Saqlash' tugmasi o'chirilgan (soxta saqlash yo'q)", async ({ page, request }) => {
  const health = await request.get("/api/health");
  test.skip(health.status() === 200, "Supabase ulangan: tugma faol bo'lishi kerak");
  await page.goto("/create");
  await page.getByRole("button", { name: /^6\. Saqlash/ }).click();
  await expect(page.getByRole("button", { name: "Saqlash va nashr qilish" })).toBeDisabled();
});
