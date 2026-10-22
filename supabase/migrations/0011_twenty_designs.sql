-- Yana 5 ta chizma-gul dizayn: jami 20 ta.
alter table public.invitations drop constraint if exists invitations_design_check;
alter table public.invitations
  add constraint invitations_design_check check (design in ('chizma','gulpush','lavanda','shox','kokgul','deko','evkalipt','boho','jurnal','yoqut','tong','ipak','bant','krem','marmar','zarrin','oqqora','osmon','zaytun','shokolad'));
