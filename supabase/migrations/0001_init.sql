-- Taklifnoma Sayt: boshlang'ich sxema
-- Eslatma: bu migratsiya hali haqiqiy Supabase loyihasiga qo'llanmagan va sinalmagan.

create extension if not exists pgcrypto;

-- Musiqa katalogi (admin boshqaradi, faqat litsenziyasi aniq fayllar)
create table public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 120),
  storage_path text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Taklifnomalar
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 5 and 80),
  groom_name text not null check (char_length(btrim(groom_name)) between 1 and 60),
  bride_name text not null check (char_length(btrim(bride_name)) between 1 and 60),
  wedding_at timestamptz not null,
  venue_name text not null check (char_length(btrim(venue_name)) between 1 and 120),
  venue_address text not null check (char_length(btrim(venue_address)) between 1 and 240),
  extra_text text check (extra_text is null or char_length(extra_text) <= 600),
  photo_path text,
  design text not null default 'classic'
    check (design in ('classic','romantic','national','minimalist','modern','luxury')),
  music_id uuid references public.music_tracks(id) on delete set null,
  status text not null default 'draft' check (status in ('draft','published','deleted')),
  edit_token_hash text not null,           -- faqat SHA-256 hash, ochiq token saqlanmaydi
  idempotency_key text not null unique,    -- takroriy bosishdan himoya
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index invitations_status_idx on public.invitations (status);
create index invitations_edit_token_hash_idx on public.invitations (edit_token_hash);

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger invitations_set_updated_at
  before update on public.invitations
  for each row execute function public.set_updated_at();

-- RSVP (keyingi bosqich uchun sxema tayyorlab qo'yildi)
create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null check (char_length(btrim(guest_name)) between 1 and 80),
  response text not null check (response in ('yes','no')),
  created_at timestamptz not null default now()
);
create index rsvps_invitation_idx on public.rsvps (invitation_id);

-- RLS
alter table public.invitations enable row level security;
alter table public.music_tracks enable row level security;
alter table public.rsvps enable row level security;

-- Ommaviy foydalanuvchi faqat nashr qilingan taklifnomalarni o'qiy oladi.
-- edit_token_hash va idempotency_key ustunlari ommaviy rolga berilmaydi (quyida GRANT).
create policy "public reads published invitations"
  on public.invitations for select
  to anon, authenticated
  using (status = 'published');

create policy "public reads active music"
  on public.music_tracks for select
  to anon, authenticated
  using (is_active);

-- Yozish siyosatlari yo'q: barcha yozish faqat service_role (server) orqali bajariladi.
-- rsvps uchun ommaviy siyosat yo'q: mehmonlar ma'lumoti ochilmaydi.

revoke all on public.invitations from anon, authenticated;
revoke all on public.music_tracks from anon, authenticated;
revoke all on public.rsvps from anon, authenticated;

grant select (
  id, slug, groom_name, bride_name, wedding_at, venue_name, venue_address,
  extra_text, photo_path, design, music_id, status, created_at, updated_at, published_at
) on public.invitations to anon, authenticated;

grant select (id, title, storage_path, is_active) on public.music_tracks to anon, authenticated;

-- Storage buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invitation-photos', 'invitation-photos', true, 8388608,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('music', 'music', true)
on conflict (id) do nothing;

-- Storage'ga yozish faqat service_role orqali (anon uchun INSERT/UPDATE/DELETE siyosati yo'q).
