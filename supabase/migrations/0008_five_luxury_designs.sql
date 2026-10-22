-- Eski 15 dizayn o'rniga 5 ta yangi dizayn. Eski taklifnomalar yangi dizaynga o'tkaziladi (havolalar ishlayveradi).
update public.invitations set design = case design
  when 'anor' then 'zarrin'
  when 'atlas' then 'zarrin'
  when 'gulbarg' then 'shokolad'
  when 'yurak' then 'shokolad'
  when 'kapalak' then 'shokolad'
  when 'gulchizma' then 'shokolad'
  when 'muhr' then 'zaytun'
  when 'yulduz' then 'osmon'
  when 'firuza' then 'osmon'
  when 'oltin' then 'oqqora'
  else design end
where design not in ('zarrin','oqqora','osmon','zaytun','shokolad');

alter table public.invitations drop constraint if exists invitations_design_check;
alter table public.invitations
  add constraint invitations_design_check check (design in ('zarrin','oqqora','osmon','zaytun','shokolad'));
