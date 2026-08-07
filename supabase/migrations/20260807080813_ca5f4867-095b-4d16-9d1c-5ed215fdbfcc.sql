DELETE FROM public.waitlist_signups a
USING public.waitlist_signups b
WHERE lower(a.email) = lower(b.email)
  AND a.created_at > b.created_at;

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_unique
  ON public.waitlist_signups (lower(email));