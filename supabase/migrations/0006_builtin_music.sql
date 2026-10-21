-- 0006: loyiha ichidagi 10 ta tayyor musiqa (public/music/*.mp3). Original sintez, litsenziya muammosi yo'q.
insert into public.music_tracks (id, title, storage_path, is_active) values
  ('00000000-0000-4000-8000-000000000001', 'Anor — iliq lirik ohang', 'builtin/anor.mp3', true),
  ('00000000-0000-4000-8000-000000000002', 'Osmon — yengil qo‘ng‘iroqchalar', 'builtin/osmon.mp3', true),
  ('00000000-0000-4000-8000-000000000003', 'Zarrin vals', 'builtin/zarrin.mp3', true),
  ('00000000-0000-4000-8000-000000000004', 'Oq va qora — tungi romans', 'builtin/oqqora.mp3', true),
  ('00000000-0000-4000-8000-000000000005', 'Zaytun bog‘i — gitara', 'builtin/zaytun.mp3', true),
  ('00000000-0000-4000-8000-000000000006', 'Shokolad — iliq jazz', 'builtin/shokolad.mp3', true),
  ('00000000-0000-4000-8000-000000000007', 'Gul chizma — musiqa qutisi', 'builtin/gulchizma.mp3', true),
  ('00000000-0000-4000-8000-000000000008', 'Muhr — arfa', 'builtin/muhr.mp3', true),
  ('00000000-0000-4000-8000-000000000009', 'Firuza — sharqona kecha', 'builtin/firuza.mp3', true),
  ('00000000-0000-4000-8000-000000000010', 'Atlas — bayramona doira', 'builtin/atlas.mp3', true)
on conflict (id) do update set title = excluded.title, storage_path = excluded.storage_path, is_active = true;
