-- Takroriy RSVP javoblari: bitta taklifnomada bitta ism (katta-kichik harfga e'tiborsiz) uchun bitta javob.
-- Eslatma: bu migratsiya hali haqiqiy Supabase loyihasiga qo'llanmagan va sinalmagan.
create unique index rsvps_invitation_guest_unique
  on public.rsvps (invitation_id, lower(btrim(guest_name)));
