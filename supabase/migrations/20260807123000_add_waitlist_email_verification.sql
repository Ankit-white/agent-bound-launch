-- Existing rows were accepted before confirmation was introduced, so preserve them as active.
ALTER TABLE public.waitlist_signups
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending_verification',
  ADD COLUMN verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN verification_token_hash TEXT,
  ADD COLUMN verification_token_expires_at TIMESTAMP WITH TIME ZONE;

UPDATE public.waitlist_signups
SET status = 'active',
    verified = true,
    verified_at = created_at;

ALTER TABLE public.waitlist_signups
  ADD CONSTRAINT waitlist_signups_status_valid
    CHECK (status IN ('pending_verification', 'active')),
  ADD CONSTRAINT waitlist_signups_verification_state_valid
    CHECK (
      (status = 'active' AND verified = true AND verified_at IS NOT NULL
        AND verification_token_hash IS NULL AND verification_token_expires_at IS NULL)
      OR
      (status = 'pending_verification' AND verified = false AND verified_at IS NULL)
    );

CREATE UNIQUE INDEX waitlist_signups_verification_token_unique
  ON public.waitlist_signups (verification_token_hash)
  WHERE verification_token_hash IS NOT NULL;

-- Waitlist writes now require trusted server credentials so token state cannot be forged.
DROP POLICY IF EXISTS "Anyone can join the waitlist" ON public.waitlist_signups;
REVOKE INSERT ON public.waitlist_signups FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.begin_waitlist_verification(
  p_signup_name TEXT,
  p_signup_email TEXT,
  p_signup_building TEXT,
  p_token_hash TEXT,
  p_token_expires_at TIMESTAMP WITH TIME ZONE
)
RETURNS TABLE (result TEXT, signup_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.waitlist_signups
    WHERE email = p_signup_email AND verified = true
  ) THEN
    RETURN QUERY SELECT 'already_verified'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  RETURN QUERY
  INSERT INTO public.waitlist_signups (
    name, email, building, status, verified, verified_at,
    verification_token_hash, verification_token_expires_at
  )
  VALUES (
    p_signup_name, p_signup_email, NULLIF(p_signup_building, ''),
    'pending_verification', false, NULL, p_token_hash, p_token_expires_at
  )
  ON CONFLICT (lower(email)) DO UPDATE
  SET name = EXCLUDED.name,
      building = EXCLUDED.building,
      status = 'pending_verification',
      verified = false,
      verified_at = NULL,
      verification_token_hash = EXCLUDED.verification_token_hash,
      verification_token_expires_at = EXCLUDED.verification_token_expires_at
  WHERE waitlist_signups.verified = false
  RETURNING 'pending_verification'::TEXT, waitlist_signups.id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'already_verified'::TEXT, NULL::UUID;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.confirm_waitlist_verification(p_token_hash TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  signup public.waitlist_signups%ROWTYPE;
BEGIN
  SELECT * INTO signup
  FROM public.waitlist_signups
  WHERE verification_token_hash = p_token_hash
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN 'invalid';
  END IF;

  IF signup.verification_token_expires_at <= now() THEN
    RETURN 'expired';
  END IF;

  UPDATE public.waitlist_signups
  SET status = 'active',
      verified = true,
      verified_at = now(),
      verification_token_hash = NULL,
      verification_token_expires_at = NULL
  WHERE id = signup.id;

  RETURN 'verified';
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_waitlist_verification(p_signup_id UUID, p_token_hash TEXT)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.waitlist_signups
  WHERE id = p_signup_id
    AND verified = false
    AND verification_token_hash = p_token_hash;
$$;

REVOKE ALL ON FUNCTION public.begin_waitlist_verification(TEXT, TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.confirm_waitlist_verification(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_waitlist_verification(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.begin_waitlist_verification(TEXT, TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE) TO service_role;
GRANT EXECUTE ON FUNCTION public.confirm_waitlist_verification(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_waitlist_verification(UUID, TEXT) TO service_role;
