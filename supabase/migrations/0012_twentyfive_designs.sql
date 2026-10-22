-- Yana 5 ta yangi dizayn: jami 25 ta.
alter table public.invitations drop constraint if exists invitations_design_check;
alter table public.invitations
  add constraint invitations_design_check check (design in ('kumush','marvarid','safir','zumrad','lino','chizma','gulpush','lavanda','shox','kokgul','deko','evkalipt','boho','jurnal','yoqut','tong','ipak','bant','krem','marmar','zarrin','oqqora','osmon','zaytun','shokolad'));
