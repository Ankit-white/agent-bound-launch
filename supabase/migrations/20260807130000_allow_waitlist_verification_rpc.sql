-- Keep the waitlist verification RPCs available when the server runtime is
-- configured with the Supabase publishable key rather than a service-role key.
GRANT EXECUTE ON FUNCTION public.begin_waitlist_verification(TEXT, TEXT, TEXT, TEXT, TIMESTAMP WITH TIME ZONE) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.confirm_waitlist_verification(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.cancel_waitlist_verification(UUID, TEXT) TO anon, authenticated, service_role;
