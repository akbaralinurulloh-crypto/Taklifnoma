-- Yangi taklifnoma tizimi: ota-ona matni, kiyim kodi, dastur (vaqt jadvali) va 10 ta yangi dizayn.
-- Eslatma: eski dizayn nomlari ('classic' va h.k.) yangi 'osmon' dizayniga o'tkaziladi, shunda mavjud taklifnomalar buzilmaydi.
alter table public.invitations add column if not exists parents text check (parents is null or char_length(parents) <= 200);
alter table public.invitations add column if not exists dress_code text check (dress_code is null or char_length(dress_code) <= 300);
alter table public.invitations add column if not exists program jsonb not null default '[]'::jsonb;

alter table public.invitations drop constraint if exists invitations_design_check;
update public.invitations
  set design = 'osmon'
  where design not in ('anor','osmon','zarrin','oqqora','zaytun','shokolad','gulchizma','muhr','firuza','atlas');
alter table public.invitations alter column design set default 'osmon';
alter table public.invitations add constraint invitations_design_check
  check (design in ('anor','osmon','zarrin','oqqora','zaytun','shokolad','gulchizma','muhr','firuza','atlas'));

grant select (parents, dress_code, program) on public.invitations to anon, authenticated;
