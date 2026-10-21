import type { Design, ProgramItem } from "./schema";

/** Preview ham, nashr qilingan sahifa ham shu modeldan foydalanadi. */
export type PublicInvitation = {
  groomName: string;
  brideName: string;
  weddingAt: string | null; // UTC ISO. Preview'da sana hali kiritilmagan bo'lishi mumkin.
  venueName: string;
  venueAddress: string;
  extraText: string | null;
  parents: string | null;
  dressCode: string | null;
  program: ProgramItem[];
  photoUrl: string | null;
  design: Design;
  music: { title: string; url: string } | null;
};
