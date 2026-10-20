import { beforeEach, describe, expect, it } from "vitest";
import { hashToken, makeEditToken } from "@/lib/invitation";
import { AppError } from "./errors";
import { memoryRepo } from "./repo.memory";
import {
  adminUnpublish, createInvitation, deleteInvitation, getForEdit, getPublicBySlug, submitRsvp, updateInvitation,
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
  design: "luxury",
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
      groomName: "Aziz", design: "luxury",
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
    const { removedPhoto } = await updateInvitation(repo, token, { ...fields, venueName: "Yangi zal", design: "classic", photoPath: null });
    expect(removedPhoto).toBe(photoPath);
    const pub = await getPublicBySlug(repo, row.slug, urls);
    expect(pub?.venueName).toBe("Yangi zal");
    expect(pub?.design).toBe("classic");
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
