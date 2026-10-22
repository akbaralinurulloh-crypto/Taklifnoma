import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InvitationView } from "@/components/InvitationView";
import { DESIGNS } from "@/lib/schema";
import type { PublicInvitation } from "@/lib/types";

const base: PublicInvitation = {
  groomName: "Azizbek",
  brideName: "Madinabonu",
  weddingAt: "2099-05-20T13:30:00.000Z",
  venueName: "Registon to‘yxonasi",
  venueAddress: "Namangan sh., Navoiy ko‘chasi 12",
  extraText: "Sizni kutamiz",
  photoUrl: "https://cdn.test/photo.jpg",
  gallery: [],
  design: "osmon",
  parents: "Karim va Dilfuza oilalari nomidan",
  dressCode: "Klassik kostyum",
  program: [{ time: "16:00", title: "Kutib olish" }],
  music: { title: "Yor-yor", url: "https://cdn.test/yor.mp3" },
};
const render = (d: Partial<PublicInvitation>) => renderToString(<InvitationView data={{ ...base, ...d }} />);

describe.each(DESIGNS)("template: %s", (design) => {
  it("barcha haqiqiy ma'lumotlarni ko'rsatadi", () => {
    const html = render({ design });
    for (const t of ["Azizbek", "Madinabonu", "Sizni kutamiz", "Registon to‘yxonasi", "Namangan sh."]) {
      expect(html).toContain(t);
    }
    expect(html).toContain("https://cdn.test/photo.jpg");
    expect(html).toContain("Musiqani yoqish");
    expect(html).toContain("Yor-yor");
    expect(html).toMatch(/chorshanba/); // 2099-05-20 chorshanba (Toshkent vaqti bo‘yicha)
    expect(html).toContain("18:30");
    expect(html).toContain("Karim va Dilfuza oilalari nomidan");
    expect(html).toContain("Klassik kostyum");
    expect(html).toContain("Kutib olish");
    expect(html).not.toMatch(/undefined|NaN|\[object/);
  });

  it("musiqa, rasm va manzil bo'lmasa, tegishli tugma/element umuman chiqmaydi", () => {
    const html = render({ design, music: null, photoUrl: null, venueAddress: "", extraText: null, parents: null, dressCode: null, program: [] });
    expect(html).not.toContain("Musiqani yoqish");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("Xaritada ko‘rish");
    expect(html).not.toContain("Kiyim kodi");
    expect(html).not.toContain("To‘y dasturi");
  });

  it("xarita havolasi haqiqiy manzildan yasaladi", () => {
    const html = render({ design });
    expect(html).toContain("google.com/maps/search/?api=1&amp;query=Namangan");
  });

  it("sana kiritilmagan bo'lsa (preview) buzilmaydi", () => {
    const html = render({ design, weddingAt: null });
    expect(html).toContain("Azizbek");
    expect(html).not.toMatch(/undefined|NaN|Invalid/);
  });

  it("xavfli matn (XSS) escape qilinadi", () => {
    const html = render({ design, groomName: "<script>alert(1)</script>", extraText: "<img src=x onerror=alert(1)>" });
    expect(html).not.toContain("<script>alert(1)");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });

  it("juda uzun ism ham sahifani buzmaydi (render xatosiz)", () => {
    expect(() => render({ design, groomName: "A".repeat(60), brideName: "B".repeat(60) })).not.toThrow();
  });
});

describe("beshta dizayn haqiqatan turlicha", () => {
  it("har bir dizaynning HTML tuzilmasi boshqalaridan farq qiladi (faqat rang emas)", () => {
    const strip = (h: string) => h.replace(/class="[^"]*"/g, "").replace(/style="[^"]*"/g, "");
    const structures = DESIGNS.map((d) => strip(render({ design: d })));
    expect(new Set(structures).size).toBe(DESIGNS.length);
  });
});

describe("rus tili, mehmon va galereya", () => {
  it("rus tilida qat'iy matnlar va sana ruscha chiqadi, kiritilgan matn o'zgarmaydi", () => {
    const html = renderToString(<InvitationView data={base} lang="ru" />);
    for (const t of ["Ассаламу алейкум", "День свадьбы", "Программа", "Дресс-код", "Ждём вас!", "мая", "Azizbek", "Registon to‘yxonasi"]) {
      expect(html).toContain(t);
    }
    expect(html).not.toContain("Assalomu alaykum");
  });

  it("shaxsiy havola: mehmon ismi bilan murojaat qilinadi va ism escape qilinadi", () => {
    const html = renderToString(<InvitationView data={base} guest={'Anvar <script>x</script>'} slug="aziz-madina-1234" />);
    expect(html).toContain("Hurmatli Anvar");
    expect(html).not.toContain("<script>x");
    expect(html).toContain("Tilaklar kitobi");
    expect(html).toContain("Kelishingizni tasdiqlang");
  });

  it("slug bo'lmaganda (preview) RSVP va tilaklar kitobi ko'rsatilmaydi", () => {
    const html = renderToString(<InvitationView data={base} />);
    expect(html).not.toContain("Tilaklar kitobi");
    expect(html).not.toContain("Kelishingizni tasdiqlang");
  });

  it("galereya rasmlari faqat berilganda chiqadi", () => {
    const g = renderToString(<InvitationView data={{ ...base, gallery: ["https://cdn.test/g1.jpg", "https://cdn.test/g2.jpg"] }} />);
    expect(g).toContain("https://cdn.test/g1.jpg");
    expect(g).toContain("Lahzalarimiz");
    expect(renderToString(<InvitationView data={base} />)).not.toContain("Lahzalarimiz");
  });
});
