import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { makeEditToken } from "@/lib/invitation";
import { setDepsForTests, type StorageOps } from "@/lib/server/deps";
import { memoryRepo } from "@/lib/server/repo.memory";
import { resetRateLimits } from "@/lib/server/rate-limit";
import { POST as createPOST } from "./invitations/route";
import { GET as publicGET } from "./public/[slug]/route";
import { DELETE as editDELETE, GET as editGET, PUT as editPUT } from "./edit/[token]/route";
import { GET as rsvpsGET } from "./edit/[token]/rsvps/route";
import { POST as rsvpPOST } from "./rsvp/[slug]/route";
import { POST as photosPOST } from "./photos/route";
import { POST as loginPOST } from "./admin/login/route";
import { POST as unpublishPOST } from "./admin/invitations/[id]/unpublish/route";
import { POST as musicPOST } from "./admin/music/route";
import { GET as healthGET } from "./health/route";

const removed: string[] = [];
const storage: StorageOps = {
  uploadPhoto: async (_b, type) => `photos/123e4567-e89b-12d3-a456-426614174000.${type === "image/png" ? "png" : "jpg"}`,
  removePhoto: async (p) => { if (p) removed.push(p); },
  uploadMusicFile: async (_b, _t, ext) => `tracks/test.${ext}`,
};

const json = (url: string, method: string, body?: unknown, headers: Record<string, string> = {}) =>
  new Request(`http://localhost${url}`, {
    method,
    headers: { "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
const params = <T extends object>(p: T) => ({ params: Promise.resolve(p) });

const fields = {
  groomName: "Aziz", brideName: "Madina", date: "2099-05-20", time: "18:30",
  venueName: "Zal", venueAddress: "Namangan", design: "modern",
};
let repo: ReturnType<typeof memoryRepo>;
let token: string;
let key: string;
let n = 0;

async function create(extra: Record<string, unknown> = {}) {
  token = makeEditToken().token;
  key = `key-${String(++n).padStart(16, "0")}`;
  const res = await createPOST(json("/api/invitations", "POST", { ...fields, idempotencyKey: key, editToken: token, ...extra }));
  return { res, body: await res.json() };
}

beforeEach(() => {
  repo = memoryRepo();
  setDepsForTests(repo, storage);
  resetRateLimits();
  removed.length = 0;
  delete process.env.ADMIN_SECRET;
});
afterEach(() => setDepsForTests(null, null));

describe("yaratish va ommaviy ochish", () => {
  it("201 qaytaradi, ommaviy URL ma'lumotlarni bazadan o'qib beradi", async () => {
    const { res, body } = await create();
    expect(res.status).toBe(201);
    expect(body.path).toBe(`/i/${body.slug}`);
    const pub = await publicGET(json(`/api/public/${body.slug}`, "GET"), params({ slug: body.slug }));
    expect(pub.status).toBe(200);
    expect(await pub.json()).toMatchObject({ groomName: "Aziz", design: "modern" });
  });

  it("takroriy so'rov 200 + replay bilan javob beradi va dublikat yaratmaydi", async () => {
    const a = await create();
    const res = await createPOST(json("/api/invitations", "POST", { ...fields, idempotencyKey: key, editToken: token }));
    expect(res.status).toBe(200);
    expect((await res.json()).slug).toBe(a.body.slug);
    expect(repo._invitations).toHaveLength(1);
  });

  it("noto'g'ri ma'lumot 400 va maydon xatolari bilan rad etiladi, hech narsa saqlanmaydi", async () => {
    const { res, body } = await create({ groomName: "" });
    expect(res.status).toBe(400);
    expect(body.error.fields.groomName).toBeTruthy();
    expect(repo._invitations).toHaveLength(0);
  });

  it("buzilgan JSON uchun 400, stack trace chiqarilmaydi", async () => {
    const res = await createPOST(new Request("http://localhost/api/invitations", { method: "POST", body: "{bad" }));
    expect(res.status).toBe(400);
    expect(JSON.stringify(await res.json())).not.toMatch(/at .*\(|stack/);
  });

  it("mavjud bo'lmagan slug 404", async () => {
    const res = await publicGET(json("/api/public/yoq-yoq-1234", "GET"), params({ slug: "yoq-yoq-1234" }));
    expect(res.status).toBe(404);
  });

  it("11-so'rovda rate limit 429 beradi", async () => {
    for (let i = 0; i < 10; i++) await create();
    const { res } = await create();
    expect(res.status).toBe(429);
  });
});

describe("tahrirlash", () => {
  it("egasi tokeni bilan o'qiydi, tahrirlaydi, token hash'i hech qachon chiqmaydi", async () => {
    const { body } = await create();
    const get = await editGET(json(`/api/edit/${token}`, "GET"), params({ token }));
    expect(get.status).toBe(200);
    const view = await get.json();
    expect(view.form).toMatchObject({ groomName: "Aziz", date: "2099-05-20", time: "18:30", design: "modern" });
    expect(JSON.stringify(view)).not.toMatch(/edit_token|idempotency|hash/);

    const put = await editPUT(json(`/api/edit/${token}`, "PUT", { ...fields, venueName: "Yangi zal" }), params({ token }));
    expect(put.status).toBe(200);
    const pub = await publicGET(json("/x", "GET"), params({ slug: body.slug }));
    expect((await pub.json()).venueName).toBe("Yangi zal");
  });

  it("begona token bilan o'qish, yozish va o'chirish 404", async () => {
    await create();
    const other = makeEditToken().token;
    expect((await editGET(json("/x", "GET"), params({ token: other }))).status).toBe(404);
    expect((await editPUT(json("/x", "PUT", fields), params({ token: other }))).status).toBe(404);
    expect((await editDELETE(json("/x", "DELETE"), params({ token: other }))).status).toBe(404);
  });

  it("o'chirilgach ommaviy sahifa yopiladi va rasm fayli tozalanadi", async () => {
    const photoPath = "photos/123e4567-e89b-12d3-a456-426614174000.jpg";
    const { body } = await create({ photoPath });
    expect((await editDELETE(json("/x", "DELETE"), params({ token }))).status).toBe(200);
    expect((await publicGET(json("/x", "GET"), params({ slug: body.slug }))).status).toBe(404);
    expect(removed).toContain(photoPath);
  });

  it("token taxmin qilishga qarshi cheklov ishlaydi", async () => {
    let last = 0;
    for (let i = 0; i < 61; i++) last = (await editGET(json("/x", "GET"), params({ token: makeEditToken().token }))).status;
    expect(last).toBe(429);
  });
});

describe("RSVP", () => {
  it("mehmon javobini yuboradi, egasi ko'radi, ommaviy ma'lumotda mehmonlar yo'q", async () => {
    const { body } = await create();
    const r = await rsvpPOST(json("/x", "POST", { guestName: "Ali", response: "yes" }), params({ slug: body.slug }));
    expect(r.status).toBe(201);
    const list = await rsvpsGET(json("/x", "GET"), params({ token }));
    expect((await list.json()).rsvps).toMatchObject([{ guestName: "Ali", response: "yes" }]);
    const pub = await publicGET(json("/x", "GET"), params({ slug: body.slug }));
    expect(JSON.stringify(await pub.json())).not.toContain("Ali");
  });

  it("begona token bilan javoblarni ko'rib bo'lmaydi", async () => {
    await create();
    expect((await rsvpsGET(json("/x", "GET"), params({ token: makeEditToken().token }))).status).toBe(404);
  });
});

describe("rasm yuklash", () => {
  const upload = (bytes: Uint8Array, name: string, type: string) => {
    const form = new FormData();
    form.set("file", new File([bytes as BlobPart], name, { type }));
    return photosPOST(new Request("http://localhost/api/photos", { method: "POST", body: form }));
  };

  it("haqiqiy PNG qabul qilinadi", async () => {
    const res = await upload(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]), "a.png", "image/png");
    expect(res.status).toBe(201);
    expect((await res.json()).path).toMatch(/^photos\/.+\.png$/);
  });

  it("nomi .png, lekin ichi rasm emas: 415", async () => {
    const res = await upload(new TextEncoder().encode("<script>alert(1)</script>"), "a.png", "image/png");
    expect(res.status).toBe(415);
  });

  it("8 MB dan katta fayl: 413", async () => {
    const big = new Uint8Array(8 * 1024 * 1024 + 1);
    big.set([0xff, 0xd8, 0xff]);
    expect((await upload(big, "a.jpg", "image/jpeg")).status).toBe(413);
  });

  it("fayl yuborilmasa 400", async () => {
    const res = await photosPOST(new Request("http://localhost/api/photos", { method: "POST", body: new FormData() }));
    expect(res.status).toBe(400);
  });
});

describe("admin", () => {
  const SECRET = "juda-maxfiy-kalit-1234";
  const cookieFrom = (res: Response) => (res.headers.get("set-cookie") ?? "").split(";")[0];

  it("ADMIN_SECRET sozlanmagan bo'lsa kirish 503 (tayyor deb ko'rsatilmaydi)", async () => {
    const res = await loginPOST(json("/x", "POST", { secret: "x" }));
    expect(res.status).toBe(503);
  });

  it("sessiyasiz admin amallari 401", async () => {
    process.env.ADMIN_SECRET = SECRET;
    const res = await unpublishPOST(json("/x", "POST"), params({ id: "123e4567-e89b-42d3-a456-426614174000" }));
    expect(res.status).toBe(401);
  });

  it("noto'g'ri kalit 401, to'g'ri kalit cookie beradi", async () => {
    process.env.ADMIN_SECRET = SECRET;
    expect((await loginPOST(json("/x", "POST", { secret: "xato-kalit" }))).status).toBe(401);
    const ok = await loginPOST(json("/x", "POST", { secret: SECRET }));
    expect(ok.status).toBe(200);
    expect(ok.headers.get("set-cookie")).toMatch(/HttpOnly.*SameSite=Strict/);
  });

  it("login urinishlari cheklanadi", async () => {
    process.env.ADMIN_SECRET = SECRET;
    let last = 0;
    for (let i = 0; i < 6; i++) last = (await loginPOST(json("/x", "POST", { secret: "xato" }))).status;
    expect(last).toBe(429);
  });

  it("admin nashrdan oladi; boshqa Origin'dan kelgan so'rov rad etiladi", async () => {
    process.env.ADMIN_SECRET = SECRET;
    const { body } = await create();
    const cookie = cookieFrom(await loginPOST(json("/x", "POST", { secret: SECRET })));
    const id = repo._invitations[0].id;

    const evil = await unpublishPOST(json("/x", "POST", undefined, { cookie, origin: "https://evil.example", host: "localhost" }), params({ id }));
    expect(evil.status).toBe(403);

    const ok = await unpublishPOST(json("/x", "POST", undefined, { cookie }), params({ id }));
    expect(ok.status).toBe(200);
    expect((await publicGET(json("/x", "GET"), params({ slug: body.slug }))).status).toBe(404);
  });

  it("litsenziya tasdiqlanmagan yoki audio bo'lmagan fayl rad etiladi", async () => {
    process.env.ADMIN_SECRET = SECRET;
    const cookie = cookieFrom(await loginPOST(json("/x", "POST", { secret: SECRET })));
    const mk = (license: boolean, bytes: Uint8Array) => {
      const form = new FormData();
      form.set("title", "Yor-yor");
      if (license) form.set("licenseConfirmed", "true");
      form.set("file", new File([bytes as BlobPart], "a.mp3", { type: "audio/mpeg" }));
      return musicPOST(new Request("http://localhost/api/admin/music", { method: "POST", body: form, headers: { cookie } }));
    };
    expect((await mk(false, new Uint8Array([0x49, 0x44, 0x33, 4]))).status).toBe(400);
    expect((await mk(true, new TextEncoder().encode("matn"))).status).toBe(415);
    expect((await mk(true, new Uint8Array([0x49, 0x44, 0x33, 4, 0, 0]))).status).toBe(201);
    expect(repo._music).toHaveLength(1);
  });
});

describe("health", () => {
  it("Supabase sozlanmagan bo'lsa 503 'degraded' (yolg'on 'ok' emas)", async () => {
    const prev = [process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY];
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const res = await healthGET();
    expect(res.status).toBe(503);
    expect((await res.json()).status).toBe("degraded");
    if (prev[0]) process.env.NEXT_PUBLIC_SUPABASE_URL = prev[0];
    if (prev[1]) process.env.SUPABASE_SERVICE_ROLE_KEY = prev[1];
  });
});
