-- Yana 5 ta yangi dizayn: jami 15 ta.
alter table public.invitations drop constraint if exists invitations_design_check;
alter table public.invitations
  add constraint invitations_design_check check (design in ('deko','evkalipt','boho','jurnal','yoqut','tong','ipak','bant','krem','marmar','zarrin','oqqora','osmon','zaytun','shokolad'));
