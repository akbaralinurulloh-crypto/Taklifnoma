import { beforeEach, describe, expect, it } from "vitest";
import { hashToken, makeEditToken } from "@/lib/invitation";
import { AppError } from "./errors";
import { memoryRepo } from "./repo.memory";
import {
  adminUnpublish, createInvitation, deleteInvitation, getForEdit, getPublicBySlug, listPublicWishes, submitRsvp, submitWish, updateInvitation,
} from "./service";

const NOW = new Date("2027-01-01T00:00:00Z");
const urls = { photo: (p: string) => `https://cdn.test/photos/${p}`, music: (p: string) => `https://cdn.test/music/${p}` };

const fields = {
  groomName: "Aziz",
  brideName: "Madina",
  date: "2027-05-20",
  time: "18:30",
  venueName: "Registon to‘yxonasi",
  venueAddress: "Namangan sh., Navoiy ko‘chasi 12",
  design: "zarrin",
};

let repo: ReturnType<typeof memoryRepo>;
let token: string;
let body: Record<string, unknown>;

beforeEach(() => {
  repo = memoryRepo();
  token = makeEditToken().token;
  body = { ...fields, idempotencyKey: "key-aaaaaaaaaaaaaaaa", editToken: token };
});

async function expectAppError(p: Promise<unknown>, status: number) {
  const e = await p.then(() => null, (x) => x);
  expect(e).toBeInstanceOf(AppError);
  expect((e as AppError).status).toBe(status);
  return e as AppError;
}

describe("createInvitation", () => {
  it("nashr qilingan taklifnoma yaratadi va faqat token hash'ini saqlaydi", async () => {
    const { row, replay } = await createInvitation(repo, body, NOW);
    expect(replay).toBe(false);
    expect(row.status).toBe("published");
    expect(row.slug).toMatch(/^aziz-madina-[a-z0-9]{4}$/);
    expect(row.wedding_at).toBe("2027-05-20T13:30:00.000Z");
    expect(row.edit_token_hash).toBe(hashToken(token));
    expect(JSON.stringify(row)).not.toContain(token);
  });

  it("takroriy so'rov (bir xil kalit) takroriy taklifnoma yaratmaydi", async () => {
    const a = await createInvitation(repo, body, NOW);
    const b = await createInvitation(repo, body, NOW);
    expect(b.replay).toBe(true);
    expect(b.row.slug).toBe(a.row.slug);
    expect(repo._invitations).toHaveLength(1);
  });

  it("bir xil kalitni boshqa token bilan ishlatishni rad etadi", async () => {
    await createInvitation(repo, body, NOW);
    await expectAppError(createInvitation(repo, { ...body, editToken: makeEditToken().token }, NOW), 409);
  });

  it("noto'g'ri maydonlarni maydon nomi bilan rad etadi", async () => {
    const e = await expectAppError(createInvitation(repo, { ...body, groomName: "   ", time: "99:99", design: "neon" }, NOW), 400);
    expect(Object.keys(e.fields ?? {})).toEqual(expect.arrayContaining(["groomName", "time", "design"]));
    expect(repo._invitations).toHaveLength(0);
  });

  it("mavjud bo'lmagan sanani rad etadi", async () => {
    const e1 = await expectAppError(createInvitation(repo, { ...body, date: "2027-02-31" }, NOW), 400);
    expect(e1.fields?.date).toBeTruthy();
  });

  it("3 oygacha o'tgan sanani qabul qiladi, 3 oydan eskisini rad etadi", async () => {
    const d = (m: number, day: number) => {
      const x = new Date(NOW.getTime());
      x.setUTCMonth(x.getUTCMonth() + m);
      x.setUTCDate(day);
      return x.toISOString().slice(0, 10);
    };
    const recent = d(-2, 15);
    const { row } = await createInvitation(repo, { ...body, idempotencyKey: "key-recent-aaaaaaaaaa", editToken: makeEditToken().token, date: recent }, NOW);
    expect(row.wedding_at.startsWith(recent)).toBe(true);
    const fresh = (n: string) => ({ idempotencyKey: `key-${n}-aaaaaaaaaaaa`, editToken: makeEditToken().token });
    const e = await expectAppError(createInvitation(repo, { ...body, ...fresh("old1"), date: d(-4, 1) }, NOW), 400);
    expect(e.fields?.date).toMatch(/3 oydan/);
    await expectAppError(createInvitation(repo, { ...body, ...fresh("old2"), date: "2020-05-20" }, NOW), 400);
  });

  it("noma'lum musiqa va noto'g'ri rasm yo'lini rad etadi", async () => {
    await expectAppError(createInvitation(repo, { ...body, musicId: "00000000-0000-4000-8000-000000000000" }, NOW), 400);
    await expectAppError(createInvitation(repo, { ...body, photoPath: "../../etc/passwd" }, NOW), 400);
  });

  it("faol musiqa va to'g'ri formatdagi rasm yo'lini qabul qiladi", async () => {
    const m = await repo.insertMusic("Yor-yor", "tracks/a.mp3");
    const photoPath = "photos/123e4567-e89b-12d3-a456-426614174000.jpg";
    const { row } = await createInvitation(repo, { ...body, musicId: m.id, photoPath }, NOW);
    expect(row.music_id).toBe(m.id);
    expect(row.photo_path).toBe(photoPath);
  });

  it("noto'g'ri kalit va token formatini rad etadi", async () => {
    await expectAppError(createInvitation(repo, { ...body, idempotencyKey: "qisqa" }, NOW), 400);
    await expectAppError(createInvitation(repo, { ...body, editToken: "qisqa" }, NOW), 400);
    await expectAppError(createInvitation(repo, "satr", NOW), 400);
  });
});

describe("ommaviy ko'rinish", () => {
  it("faqat nashr qilinganini ko'rsatadi; rasm va musiqa URL'lari yig'iladi", async () => {
    const m = await repo.insertMusic("Yor-yor", "tracks/a.mp3");
    const photoPath = "photos/123e4567-e89b-12d3-a456-426614174000.png";
    const { row } = await createInvitation(repo, { ...body, musicId: m.id, photoPath }, NOW);
    const pub = await getPublicBySlug(repo, row.slug, urls);
    expect(pub).toMatchObject({
      groomName: "Aziz", design: "zarrin",
      photoUrl: `https://cdn.test/photos/${photoPath}`,
      music: { title: "Yor-yor", url: "https://cdn.test/music/tracks/a.mp3" },
    });
    expect(JSON.stringify(pub)).not.toContain("edit_token");
  });

  it("noto'g'ri yoki mavjud bo'lmagan slug uchun null qaytaradi", async () => {
    expect(await getPublicBySlug(repo, "yoq-yoq-1234", urls)).toBeNull();
    expect(await getPublicBySlug(repo, "../../x", urls)).toBeNull();
    expect(await getPublicBySlug(repo, "A".repeat(200), urls)).toBeNull();
  });

  it("o'chirilgan musiqa taklifnomada ko'rsatilmaydi", async () => {
    const m = await repo.insertMusic("Yor-yor", "tracks/a.mp3");
    const { row } = await createInvitation(repo, { ...body, musicId: m.id }, NOW);
    await repo.setMusicActive(m.id, false);
    expect((await getPublicBySlug(repo, row.slug, urls))?.music).toBeNull();
  });
});

describe("tahrirlash va o'chirish", () => {
  it("noto'g'ri token bilan tahrirlab bo'lmaydi", async () => {
    await createInvitation(repo, body, NOW);
    await expectAppError(getForEdit(repo, makeEditToken().token), 404);
    await expectAppError(updateInvitation(repo, makeEditToken().token, fields), 404);
    await expectAppError(getForEdit(repo, "qisqa"), 404);
  });

  it("o'zgarishlar ommaviy sahifada aks etadi va eski rasm tozalash uchun qaytariladi", async () => {
    const photoPath = "photos/123e4567-e89b-12d3-a456-426614174000.jpg";
    const { row } = await createInvitation(repo, { ...body, photoPath }, NOW);
    const { removedPhoto } = await updateInvitation(repo, token, { ...fields, venueName: "Yangi zal", design: "osmon", photoPath: null });
    expect(removedPhoto).toBe(photoPath);
    const pub = await getPublicBySlug(repo, row.slug, urls);
    expect(pub?.venueName).toBe("Yangi zal");
    expect(pub?.design).toBe("osmon");
    expect(pub?.photoUrl).toBeNull();
  });

  it("rasm maydoni berilmasa, mavjud rasm saqlanadi", async () => {
    const photoPath = "photos/123e4567-e89b-12d3-a456-426614174000.jpg";
    await createInvitation(repo, { ...body, photoPath }, NOW);
    const { row, removedPhoto } = await updateInvitation(repo, token, fields);
    expect(row.photo_path).toBe(photoPath);
    expect(removedPhoto).toBeNull();
  });

  it("tahrirlashda ham validatsiya ishlaydi", async () => {
    await createInvitation(repo, body, NOW);
    await expectAppError(updateInvitation(repo, token, { ...fields, brideName: "" }), 400);
  });

  it("o'chirilgan taklifnoma ommaviy ochilmaydi va tahrirlanmaydi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await deleteInvitation(repo, token);
    expect(await getPublicBySlug(repo, row.slug, urls)).toBeNull();
    await expectAppError(getForEdit(repo, token), 404);
  });

  it("admin nashrdan olgach ommaviy yopiladi va egasi qayta nashr qila olmaydi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await adminUnpublish(repo, row.id);
    expect(await getPublicBySlug(repo, row.slug, urls)).toBeNull();
    await updateInvitation(repo, token, { ...fields, venueName: "Boshqa" });
    expect(await getPublicBySlug(repo, row.slug, urls)).toBeNull();
  });
});

describe("RSVP", () => {
  it("javobni saqlaydi, bir xil ism uchun yangilaydi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await submitRsvp(repo, row.slug, { guestName: "Ali", response: "yes" });
    await submitRsvp(repo, row.slug, { guestName: " ali ", response: "no" });
    const list = await repo.listRsvps(row.id);
    expect(list).toHaveLength(1);
    expect(list[0].response).toBe("no");
  });

  it("noto'g'ri javob va noma'lum taklifnomani rad etadi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await expectAppError(submitRsvp(repo, row.slug, { guestName: "", response: "maybe" }), 400);
    await expectAppError(submitRsvp(repo, "yoq-yoq-1234", { guestName: "Ali", response: "yes" }), 404);
  });

  it("nashrdan olingan taklifnomaga javob yuborib bo'lmaydi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await adminUnpublish(repo, row.id);
    await expectAppError(submitRsvp(repo, row.slug, { guestName: "Ali", response: "yes" }), 404);
  });
});

describe("ota-ona, kiyim kodi va dastur", () => {
  const extra = {
    parents: "  Karim va Dilfuza oilalari nomidan ",
    dressCode: "Klassik kostyum",
    program: [{ time: "16:00", title: " Mehmonlarni kutib olish " }, { time: "17:30", title: "Nikoh" }],
  };

  it("saqlanadi, bo'sh joylar kesiladi va ommaviy ko'rinishda qaytadi", async () => {
    const { row } = await createInvitation(repo, { ...body, ...extra }, NOW);
    const pub = await getPublicBySlug(repo, row.slug, urls);
    expect(pub).toMatchObject({
      parents: "Karim va Dilfuza oilalari nomidan",
      dressCode: "Klassik kostyum",
      program: [{ time: "16:00", title: "Mehmonlarni kutib olish" }, { time: "17:30", title: "Nikoh" }],
    });
  });

  it("berilmasa null va bo'sh ro'yxat bo'ladi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    expect(await getPublicBySlug(repo, row.slug, urls)).toMatchObject({ parents: null, dressCode: null, program: [] });
  });

  it("noto'g'ri dastur vaqti, bo'sh nom va 8 tadan ortiq qatorni rad etadi", async () => {
    const e1 = await expectAppError(createInvitation(repo, { ...body, program: [{ time: "25:00", title: "X" }] }, NOW), 400);
    expect(e1.fields?.program).toBeTruthy();
    await expectAppError(createInvitation(repo, { ...body, idempotencyKey: "key-bbbbbbbbbbbbbbbb", editToken: makeEditToken().token, program: [{ time: "10:00", title: "  " }] }, NOW), 400);
    const many = Array.from({ length: 9 }, (_, i) => ({ time: "10:0" + i, title: "Q" }));
    await expectAppError(createInvitation(repo, { ...body, idempotencyKey: "key-cccccccccccccccc", editToken: makeEditToken().token, program: many }, NOW), 400);
    expect(repo._invitations).toHaveLength(0);
  });

  it("tahrirlashda yangilanadi", async () => {
    await createInvitation(repo, { ...body, ...extra }, NOW);
    await updateInvitation(repo, token, { ...fields, parents: "", dressCode: "", program: [{ time: "18:00", title: "Ziyofat" }] }, NOW);
    const row = repo._invitations[0];
    expect(row.parents).toBeNull();
    expect(row.dress_code).toBeNull();
    expect(row.program).toEqual([{ time: "18:00", title: "Ziyofat" }]);
  });
});

describe("galereya, tilaklar va mehmonlar soni", () => {
  const P = (n: number) => `photos/${String(n).padStart(8, "0")}-0000-0000-0000-000000000000.jpg`;

  it("galereya saqlanadi, takrorlar olib tashlanadi, ommaviy ko'rinishda URL bo'ladi", async () => {
    const { row } = await createInvitation(repo, { ...body, gallery: [P(1), P(2), P(1)] }, NOW);
    expect(row.gallery).toEqual([P(1), P(2)]);
    const pub = await getPublicBySlug(repo, row.slug, urls);
    expect(pub?.gallery).toEqual([`https://cdn.test/photos/${P(1)}`, `https://cdn.test/photos/${P(2)}`]);
  });

  it("noto'g'ri manzil va 6 tadan ortiq rasmni rad etadi", async () => {
    await expectAppError(createInvitation(repo, { ...body, gallery: ["../x.jpg"] }, NOW), 400);
    await expectAppError(createInvitation(repo, { ...body, gallery: [1, 2, 3, 4, 5, 6, 7].map(P) }, NOW), 400);
  });

  it("tahrirlashda olib tashlangan galereya rasmlari tozalash uchun qaytariladi", async () => {
    const { row } = await createInvitation(repo, { ...body, gallery: [P(1), P(2)] }, NOW);
    const r = await updateInvitation(repo, token, { ...fields, gallery: [P(2), P(3)] }, NOW);
    expect(r.row.gallery).toEqual([P(2), P(3)]);
    expect(r.removedGallery).toEqual([P(1)]);
    expect(row.gallery).toEqual([P(1), P(2)]);
  });

  it("galereya maydoni berilmasa mavjud galereya saqlanadi", async () => {
    await createInvitation(repo, { ...body, gallery: [P(1)] }, NOW);
    const r = await updateInvitation(repo, token, { ...fields }, NOW);
    expect(r.row.gallery).toEqual([P(1)]);
  });

  it("RSVP mehmonlar sonini saqlaydi; 'kelmayman' bo'lsa 1; noto'g'ri sonni rad etadi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await submitRsvp(repo, row.slug, { guestName: "Ali", response: "yes", guests: 4 });
    await submitRsvp(repo, row.slug, { guestName: "Vali", response: "no", guests: 5 });
    const list = await repo.listRsvps(row.id);
    expect(list.find((r) => r.guest_name === "Ali")?.guests).toBe(4);
    expect(list.find((r) => r.guest_name === "Vali")?.guests).toBe(1);
    await expectAppError(submitRsvp(repo, row.slug, { guestName: "X", response: "yes", guests: 11 }), 400);
    await expectAppError(submitRsvp(repo, row.slug, { guestName: "X", response: "yes", guests: 0 }), 400);
  });

  it("tilak qo'shiladi va ro'yxatda yangisi birinchi chiqadi; bo'sh/uzun matn va noma'lum slug rad etiladi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await submitWish(repo, row.slug, { guestName: "Ali", message: "Baxtli bo‘linglar!" });
    await submitWish(repo, row.slug, { guestName: "Vali", message: "<b>Tabriklaymiz</b>" });
    const list = await listPublicWishes(repo, row.slug);
    expect(list.map((w) => w.guestName)).toEqual(["Vali", "Ali"]);
    expect(list[0].message).toBe("<b>Tabriklaymiz</b>"); // matn o'zgartirilmaydi, ko'rsatishda escape qilinadi
    await expectAppError(submitWish(repo, row.slug, { guestName: "A", message: "  " }), 400);
    await expectAppError(submitWish(repo, row.slug, { guestName: "A", message: "x".repeat(301) }), 400);
    await expectAppError(submitWish(repo, "yoq-slug", { guestName: "A", message: "salom" }), 404);
  });

  it("nashrdan olingan taklifnomaning tilaklari ko'rinmaydi va yangisi yozilmaydi", async () => {
    const { row } = await createInvitation(repo, body, NOW);
    await submitWish(repo, row.slug, { guestName: "Ali", message: "salom" });
    await adminUnpublish(repo, row.id);
    expect(await listPublicWishes(repo, row.slug)).toEqual([]);
    await expectAppError(submitWish(repo, row.slug, { guestName: "A", message: "salom" }), 404);
  });
});
