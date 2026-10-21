import type { Repo } from "./repo";
import { supabaseRepo } from "./repo.supabase";
import * as realStorage from "./storage";

export type StorageOps = {
  uploadPhoto: (buf: Uint8Array, type: "image/jpeg" | "image/png" | "image/webp") => Promise<string>;
  removePhoto: (path: string | null | undefined) => Promise<void>;
  uploadMusicFile: (buf: Uint8Array, contentType: string, ext: string) => Promise<string>;
  createMusicUpload: (ext: string) => Promise<{ path: string; uploadUrl: string }>;
  readMusicFile: (path: string) => Promise<Uint8Array | null>;
  removeMusicFile: (path: string) => Promise<void>;
};

let repoOverride: Repo | null = null;
let storageOverride: StorageOps | null = null;

/** Faqat testlar uchun. */
export function setDepsForTests(repo: Repo | null, storage: StorageOps | null = null) {
  repoOverride = repo;
  storageOverride = storage;
}

export function getRepo(): Repo {
  return repoOverride ?? supabaseRepo();
}

export function getStorage(): StorageOps {
  return storageOverride ?? realStorage;
}
