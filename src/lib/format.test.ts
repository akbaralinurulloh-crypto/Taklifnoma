import { describe, expect, it } from "vitest";
import { whenText } from "./format";
import { tashkentToIso } from "./schema";

describe("whenText", () => {
  it("UTC vaqtni Toshkent vaqti bo'yicha o'zbekcha matnga aylantiradi", () => {
    // 2027-05-20 18:30 Toshkent = 13:30 UTC, payshanba
    expect(whenText("2027-05-20T13:30:00.000Z")).toEqual({
      weekday: "payshanba",
      date: "20-may, 2027-yil",
      time: "18:30",
    });
  });
  it("UTC bo'yicha kechasi, Toshkentda esa ertasi kuni bo'lgan holatni to'g'ri hal qiladi", () => {
    // 2027-05-20 02:15 Toshkent = 2027-05-19 21:15 UTC
    const iso = tashkentToIso("2027-05-20", "02:15")!;
    expect(whenText(iso)?.date).toBe("20-may, 2027-yil");
    expect(whenText(iso)?.time).toBe("02:15");
  });
  it("sana yo'q yoki noto'g'ri bo'lsa null qaytaradi", () => {
    expect(whenText(null)).toBeNull();
    expect(whenText("noto'g'ri")).toBeNull();
  });
});

import { monthGrid } from "./format";
describe("monthGrid", () => {
  it("2030-yil iyun: 1-iyun shanba, 12-iyun belgilanadi", () => {
    const g = monthGrid("2030-06-12T13:00:00.000Z")!;
    expect(g.title).toBe("Iyun");
    expect(g.day).toBe(12);
    expect(g.cells.indexOf(1)).toBe(5); // Du Se Chor Pay Ju [Sha]
    expect(g.cells.filter((c) => c !== null)).toHaveLength(30);
    expect(g.cells.length % 7).toBe(0);
  });
  it("sana yo'q bo'lsa null", () => expect(monthGrid(null)).toBeNull());
});
