import { isDisposableDomain, normalizeEmail } from "./email-validation";
import { verificationTokenExpiresAt } from "./waitlist-verification";

export type WaitlistRequest = {
  name: string;
  email: string;
  building?: string;
  authUserId: string;
};

export type WaitlistResult = {
  success: boolean;
  message: string;
};

const CHECK_INBOX_MESSAGE = "Check your inbox to verify your email and join the waitlist.";

function publicAppUrl(): string {
  const value = process.env["APP_URL"]?.trim();
  if (!value) throw new Error("Missing APP_URL for the Supabase Auth redirect");
  return value.replace(/\/$/, "");
}

export async function beginWaitlistVerificationFromServer(
  input: Omit<WaitlistRequest, "authUserId">,
): Promise<WaitlistResult> {
  const { createSupabaseAuthClient } = await import("@/integrations/supabase/client.server");
  const { data, error } = await createSupabaseAuthClient().auth.signUp({
    email: normalizeEmail(input.email),
    password: `${crypto.randomUUID()}${crypto.randomUUID()}`,
    options: {
      data: { waitlist_name: input.name },
      emailRedirectTo: `${publicAppUrl()}/verify-waitlist`,
    },
  });
  if (error || !data.user) throw error ?? new Error("Supabase Auth did not create a user");
  return beginWaitlistVerification({ ...input, authUserId: data.user.id });
}

export async function beginWaitlistVerification(input: WaitlistRequest): Promise<WaitlistResult> {
  const email = normalizeEmail(input.email);
  const domain = email.split("@")[1] ?? "";
  if (isDisposableDomain(domain)) {
    return { success: false, message: "Please use a permanent email address." };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: userResult, error: userError } = await supabaseAdmin.auth.admin.getUserById(
    input.authUserId,
  );
  if (userError || !userResult.user || userResult.user.email_confirmed_at) {
    return userResult.user?.email_confirmed_at
      ? {
          success: false,
          message: "This email has already been verified. Please use the waitlist entry.",
        }
      : { success: false, message: "Please verify your email before joining the waitlist." };
  }
  if (normalizeEmail(userResult.user.email ?? "") !== email) {
    return { success: false, message: "The email does not match the verification account." };
  }

  const { data, error } = await supabaseAdmin.rpc("begin_waitlist_verification", {
    p_signup_name: input.name,
    p_signup_email: email,
    p_signup_building: input.building ?? "",
    p_token_hash: null,
    p_token_expires_at: verificationTokenExpiresAt().toISOString(),
    p_auth_user_id: input.authUserId,
  });
  if (error) throw error;
  const row = data[0];
  if (!row || row.result === "already_verified") {
    return { success: false, message: "You're already on the waitlist." };
  }
  return { success: true, message: CHECK_INBOX_MESSAGE };
}

export async function activateVerifiedWaitlistEntry(
  userId: string,
  email: string,
): Promise<WaitlistResult> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: userResult, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (userError || !userResult.user || !userResult.user.email_confirmed_at) {
    return { success: false, message: "Please verify your email before joining the waitlist." };
  }
  const normalizedEmail = normalizeEmail(email);
  if (normalizeEmail(userResult.user.email ?? "") !== normalizedEmail) {
    return { success: false, message: "The verified email does not match this waitlist entry." };
  }

  const { data, error } = await supabaseAdmin.rpc("activate_waitlist_for_verified_user", {
    p_user_id: userId,
    p_email: normalizedEmail,
  });
  if (error) throw error;
  if (data === "already_verified")
    return { success: false, message: "You're already on the waitlist." };
  if (data !== "verified")
    return { success: false, message: "No pending waitlist entry was found." };
  return { success: true, message: "Your waitlist entry is now active." };
}
