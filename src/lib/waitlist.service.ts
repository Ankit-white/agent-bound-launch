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

function logWaitlistFailure(step: string, error: unknown): void {
  const value = error as {
    message?: unknown;
    code?: unknown;
    status?: unknown;
    details?: unknown;
    stack?: unknown;
  };
  console.error(`[Waitlist] ${step} failed`, {
    error: {
      message: typeof value?.message === "string" ? value.message : String(error),
      code: value?.code,
      status: value?.status,
      details: value?.details,
      stack: value?.stack,
    },
  });
}

function publicAppUrl(): string {
  const value = process.env["APP_URL"]?.trim();
  if (!value) throw new Error("Missing APP_URL for the Supabase Auth redirect");
  return value.replace(/\/$/, "");
}

export async function beginWaitlistVerificationFromServer(
  input: Omit<WaitlistRequest, "authUserId">,
): Promise<WaitlistResult> {
  try {
    console.info("[Waitlist] STEP 3: Calling Supabase Auth signUp() [server]");
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
    console.info("[Waitlist] STEP 4: Auth response [server]", {
      userCreated: Boolean(data.user),
      sessionCreated: Boolean(data.session),
    });
    return beginWaitlistVerification({ ...input, authUserId: data.user.id });
  } catch (error) {
    logWaitlistFailure("STEP 3/4", error);
    throw error;
  }
}

export async function beginWaitlistVerification(input: WaitlistRequest): Promise<WaitlistResult> {
  const email = normalizeEmail(input.email);
  const domain = email.split("@")[1] ?? "";
  if (isDisposableDomain(domain)) {
    return { success: false, message: "Please use a permanent email address." };
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let userResult: Awaited<ReturnType<typeof supabaseAdmin.auth.admin.getUserById>>["data"];
  let userError: Awaited<ReturnType<typeof supabaseAdmin.auth.admin.getUserById>>["error"];
  try {
    console.info("[Waitlist] STEP 5: Creating waitlist record");
    ({ data: userResult, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      input.authUserId,
    ));
  } catch (error) {
    logWaitlistFailure("STEP 5", error);
    throw error;
  }
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

  let data: Awaited<ReturnType<typeof supabaseAdmin.rpc>>["data"];
  let error: Awaited<ReturnType<typeof supabaseAdmin.rpc>>["error"];
  try {
    console.info("[Waitlist] STEP 6: Calling begin_waitlist_verification RPC");
    ({ data, error } = await supabaseAdmin.rpc("begin_waitlist_verification", {
      p_signup_name: input.name,
      p_signup_email: email,
      p_signup_building: input.building ?? "",
      p_token_hash: null,
      p_token_expires_at: verificationTokenExpiresAt().toISOString(),
      p_auth_user_id: input.authUserId,
    }));
    console.info("[Waitlist] STEP 6: RPC response", { returned: Array.isArray(data) });
  } catch (error) {
    logWaitlistFailure("STEP 6", error);
    throw error;
  }
  if (error) {
    logWaitlistFailure("STEP 6", error);
    throw error;
  }
  const row = data?.[0];
  if (!row || row.result === "already_verified") {
    return { success: false, message: "You're already on the waitlist." };
  }
  console.info("[Waitlist] STEP 7: Success");
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

  let data: Awaited<ReturnType<typeof supabaseAdmin.rpc>>["data"];
  let error: Awaited<ReturnType<typeof supabaseAdmin.rpc>>["error"];
  try {
    console.info("[Waitlist] REDIRECT STEP 2: Calling activation RPC");
    ({ data, error } = await supabaseAdmin.rpc("activate_waitlist_for_verified_user", {
      p_user_id: userId,
      p_email: normalizedEmail,
    }));
    console.info("[Waitlist] REDIRECT STEP 3: Activation RPC response", {
      result: typeof data === "string" ? data : "unexpected",
    });
  } catch (error) {
    logWaitlistFailure("REDIRECT STEP 2", error);
    throw error;
  }
  if (error) {
    logWaitlistFailure("REDIRECT STEP 2", error);
    throw error;
  }
  if (data === "already_verified")
    return { success: false, message: "You're already on the waitlist." };
  if (data !== "verified")
    return { success: false, message: "No pending waitlist entry was found." };
  return { success: true, message: "Your waitlist entry is now active." };
}
