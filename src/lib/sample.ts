import type { Design } from "./schema";
import type { PublicInvitation } from "./types";

/** Faqat dizaynlarni ko'rsatish uchun namuna ma'lumot (haqiqiy taklifnoma emas). */
export function sampleInvitation(design: Design, over: Partial<PublicInvitation> = {}): PublicInvitation {
  return {
    groomName: "Aziz",
    brideName: "Madina",
    weddingAt: "2030-06-12T13:00:00.000Z",
    venueName: "Registon to‘yxonasi",
    venueAddress: "Namangan sh., Navoiy ko‘chasi 12",
    extraText: "Sizni to‘yimizda ko‘rishdan baxtiyormiz.",
    photoUrl: null,
    music: null,
    design,
    ...over,
  };
}
