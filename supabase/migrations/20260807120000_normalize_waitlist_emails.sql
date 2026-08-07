-- Remove historical whitespace/casing variants before canonicalizing emails.
DELETE FROM public.waitlist_signups a
USING public.waitlist_signups b
WHERE lower(trim(a.email)) = lower(trim(b.email))
  AND (a.created_at, a.id) > (b.created_at, b.id);

UPDATE public.waitlist_signups
SET email = lower(trim(email));

ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT waitlist_signups_email_normalized
  CHECK (email = lower(trim(email)));
