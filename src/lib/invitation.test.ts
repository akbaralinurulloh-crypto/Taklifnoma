import { describe, expect, it } from "vitest";
import {
  countdownTo,
  hashToken,
  invitationInputSchema,
  makeEditToken,
  makeSlug,
  mapsUrl,
  sniffImageType,
  tashkentToIso,
} from "./invitation";

const valid = {
  groomName: " Aziz ",
  brideName: "Madina",
  date: "2027-05-20",
  time: "18:30",
  venueName: "Registon to'yxonasi",
  venueAddress: "Namangan sh., Navoiy ko'chasi 12",
  design: "osmon" as const,
};

describe("invitationInputSchema", () => {
  it("to'g'ri ma'lumotni qabul qiladi va ismlarni tozalaydi", () => {
    const r = invitationInputSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.groomName).toBe("Aziz");
  });
  it("faqat probeldan iborat ismni rad etadi", () => {
    expect(invitationInputSchema.safeParse({ ...valid, groomName: "   " }).success).toBe(false);
  });
  it("noma'lum dizaynni rad etadi", () => {
    expect(invitationInputSchema.safeParse({ ...valid, design: "neon" }).success).toBe(false);
  });
  it("noto'g'ri vaqt va uzun matnni rad etadi", () => {
    expect(invitationInputSchema.safeParse({ ...valid, time: "25:99" }).success).toBe(false);
    expect(invitationInputSchema.safeParse({ ...valid, extraText: "x".repeat(601) }).success).toBe(false);
  });
});

describe("tashkentToIso", () => {
  it("Toshkent vaqtini (UTC+5) UTC ga to'g'ri aylantiradi", () => {
    expect(tashkentToIso("2027-05-20", "18:30")).toBe("2027-05-20T13:30:00.000Z");
  });
  it("mavjud bo'lmagan sanani rad etadi", () => {
    expect(tashkentToIso("2027-02-31", "10:00")).toBeNull();
  });
});

describe("slug va token", () => {
  it("slug aziz-madina-xxxx ko'rinishida va xavfsiz belgilardan iborat", () => {
    const s = makeSlug("Aziz", "Madina");
    expect(s).toMatch(/^aziz-madina-[a-z0-9]{4}$/);
  });
  it("o'zbekcha apostrofli ismlardan to'g'ri slug yasaydi", () => {
    expect(makeSlug("O'ktam", "Sevinch")).toMatch(/^oktam-sevinch-[a-z0-9]{4}$/);
  });
  it("token hash'i ochiq tokenga teng emas va barqaror", () => {
    const { token, hash } = makeEditToken();
    expect(hash).not.toBe(token);
    expect(hashToken(token)).toBe(hash);
    expect(makeEditToken().token).not.toBe(token);
  });
});

describe("countdownTo", () => {
  it("kelajak uchun kun/soat/daqiqa/soniya beradi", () => {
    const c = countdownTo("2027-05-20T13:30:00.000Z", new Date("2027-05-18T12:29:59.000Z"));
    expect(c).toEqual({ state: "upcoming", days: 2, hours: 1, minutes: 0, seconds: 1 });
  });
  it("o'tgan vaqt uchun past holatini qaytaradi", () => {
    expect(countdownTo("2020-01-01T00:00:00.000Z").state).toBe("past");
  });
});

describe("mapsUrl va sniffImageType", () => {
  it("bo'sh manzil uchun null qaytaradi", () => {
    expect(mapsUrl("  ")).toBeNull();
    expect(mapsUrl("Namangan")).toContain("query=Namangan");
  });
  it("rasm turini fayl boshidagi baytlardan aniqlaydi", () => {
    expect(sniffImageType(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("image/jpeg");
    expect(sniffImageType(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))).toBe("image/png");
    expect(sniffImageType(new TextEncoder().encode("<?php evil"))).toBeNull();
  });
});

describe("o'zbekcha xato xabarlari (maydon umuman yuborilmasa ham)", () => {
  it("sana va vaqt yo'q bo'lsa inglizcha emas, o'zbekcha xabar beradi", () => {
    const r = invitationInputSchema.safeParse({ groomName: "A", brideName: "B", venueName: "Z", venueAddress: "N", design: "osmon" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msgs = Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message]));
      expect(msgs.date).toBe("Sana kiritilishi shart");
      expect(msgs.time).toBe("Vaqt kiritilishi shart");
      for (const m of Object.values(msgs)) expect(m).not.toMatch(/Invalid|expected/);
    }
  });
  it("bo'sh sana satri ham 'kiritilishi shart' deb xabar beradi", () => {
    const r = invitationInputSchema.safeParse({ groomName: "A", brideName: "B", date: "", time: "", venueName: "Z", venueAddress: "N", design: "osmon" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const first = (k: string) => r.error.issues.find((i) => i.path[0] === k)?.message;
      expect(first("date")).toBe("Sana kiritilishi shart");
      expect(first("time")).toBe("Vaqt kiritilishi shart");
    }
  });
});
