-- 10 ta dizaynga o'tish: dizayn cheklovini kengaytiradi.
-- Eslatma: 0001 ni allaqachon ishga tushirgan loyihalar uchun. Yangi o'rnatishda 0001 o'zi yangi ro'yxatni oladi.
alter table public.invitations drop constraint if exists invitations_design_check;
alter table public.invitations
  add constraint invitations_design_check
  check (design in ('classic','romantic','national','minimalist','modern','luxury','registon','bahor','tun','chipta'));
