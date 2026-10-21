-- 0005: galereya, mehmonlar soni va tilaklar kitobi
alter table public.invitations
  add column if not exists gallery jsonb not null default '[]'::jsonb;

alter table public.rsvps
  add column if not exists guests int not null default 1;
alter table public.rsvps drop constraint if exists rsvps_guests_check;
alter table public.rsvps add constraint rsvps_guests_check check (guests between 1 and 10);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null check (char_length(btrim(guest_name)) between 1 and 80),
  message text not null check (char_length(btrim(message)) between 1 and 300),
  created_at timestamptz not null default now()
);
create index if not exists wishes_invitation_idx on public.wishes (invitation_id, created_at desc);

alter table public.wishes enable row level security;
revoke all on public.wishes from anon, authenticated;
-- Yozish va o'qish faqat server (service_role) orqali: ommaviy siyosat yo'q.

grant select (gallery) on public.invitations to anon, authenticated;
