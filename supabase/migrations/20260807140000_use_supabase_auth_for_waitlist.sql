-- Supabase Auth owns email confirmation. A waitlist row is only active after
-- the linked Auth user has confirmed its email.
ALTER TABLE public.waitlist_signups
  ADD COLUMN auth_user_id UUID;

CREATE UNIQUE INDEX waitlist_signups_auth_user_unique
  ON public.waitlist_signups (auth_user_id)
  WHERE auth_user_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.begin_waitlist_verification(
  p_signup_name TEXT,
  p_signup_email TEXT,
  p_signup_building TEXT,
  p_token_hash TEXT,
  p_token_expires_at TIMESTAMP WITH TIME ZONE,
  p_auth_user_id UUID DEFAULT NULL
)
RETURNS TABLE (result TEXT, signup_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.waitlist_signups
    WHERE email = lower(trim(p_signup_email)) AND verified = true
  ) THEN
    RETURN QUERY SELECT 'already_verified'::TEXT, NULL::UUID;
    RETURN;
  END IF;

  RETURN QUERY
  INSERT INTO public.waitlist_signups (
    name, email, building, status, verified, verified_at,
    verification_token_hash, verification_token_expires_at, auth_user_id
  )
  VALUES (
    p_signup_name, lower(trim(p_signup_email)), NULLIF(p_signup_building, ''),
    'pending_verification', false, NULL, NULL, NULL, p_auth_user_id
  )
  ON CONFLICT (lower(email)) DO UPDATE
  SET name = EXCLUDED.name,
      building = EXCLUDED.building,
      auth_user_id = EXCLUDED.auth_user_id,
      status = 'pending_verification',
      verified = false,
      verified_at = NULL,
      verification_token_hash = NULL,
      verification_token_expires_at = NULL
  WHERE waitlist_signups.verified = false
  RETURNING 'pending_verification'::TEXT, waitlist_signups.id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'already_verified'::TEXT, NULL::UUID;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.activate_waitlist_for_verified_user(
  p_user_id UUID,
  p_email TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.waitlist_signups
  SET status = 'active',
      verified = true,
      verified_at = now()
  WHERE auth_user_id = p_user_id
    AND email = lower(trim(p_email))
    AND verified = false;

  IF FOUND THEN RETURN 'verified'; END IF;
  IF EXISTS (
    SELECT 1 FROM public.waitlist_signups
    WHERE email = lower(trim(p_email)) AND verified = true
  ) THEN RETURN 'already_verified'; END IF;
  RETURN 'invalid';
END;
$$;

REVOKE ALL ON FUNCTION public.begin_waitlist_verification(TEXT, TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.activate_waitlist_for_verified_user(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.begin_waitlist_verification(TEXT, TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.activate_waitlist_for_verified_user(UUID, TEXT) TO service_role;
