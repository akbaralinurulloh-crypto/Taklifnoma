-- Yana 5 ta yangi dizayn qo'shildi: jami 10 ta.
alter table public.invitations drop constraint if exists invitations_design_check;
alter table public.invitations
  add constraint invitations_design_check check (design in ('tong','ipak','bant','krem','marmar','zarrin','oqqora','osmon','zaytun','shokolad'));
