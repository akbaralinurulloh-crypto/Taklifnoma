-- 0007: 5 ta yangi dizayn va 7 ta yangi musiqa
alter table public.invitations drop constraint if exists invitations_design_check;
alter table public.invitations add constraint invitations_design_check
  check (design in ('anor','osmon','zarrin','oqqora','zaytun','shokolad','gulchizma','muhr','firuza','atlas','gulbarg','yulduz','kapalak','oltin','yurak'));

insert into public.music_tracks (id, title, storage_path, is_active) values
  ('00000000-0000-4000-8000-000000000011', 'Yor-yor 1 — doira bilan', 'builtin/yoryor1.mp3', true),
  ('00000000-0000-4000-8000-000000000012', 'Yor-yor 2 — sekin', 'builtin/yoryor2.mp3', true),
  ('00000000-0000-4000-8000-000000000013', 'Yor-yor 3 — tantanali', 'builtin/yoryor3.mp3', true),
  ('00000000-0000-4000-8000-000000000014', 'Romantik ballada', 'builtin/ballada.mp3', true),
  ('00000000-0000-4000-8000-000000000015', 'To‘y marshi', 'builtin/marsh.mp3', true),
  ('00000000-0000-4000-8000-000000000016', 'Kelin kutib olish', 'builtin/kelin.mp3', true),
  ('00000000-0000-4000-8000-000000000017', 'Raqs ohangi', 'builtin/raqs.mp3', true)
on conflict (id) do update set title = excluded.title, storage_path = excluded.storage_path, is_active = true;
