import { isDisposableDomain, normalizeEmail } from "./email-validation";
import {
  createVerificationToken,
  hashVerificationToken,
  verificationTokenExpiresAt,
} from "./waitlist-verification";

export type WaitlistRequest = {
  name: string;
  email: string;
  building?: string;
};

export type WaitlistResult = {
  success: boolean;
  message: string;
};

const CHECK_INBOX_MESSAGE = "Check your inbox to verify your email and join the waitlist.";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "\u0026amp;",
      "<": "\u0026lt;",
      ">": "\u0026gt;",
      '"': "\u0026quot;",
      "'": "\u0026#39;",
    };
    return entities[character] ?? character;
  });
}

async function sendVerificationEmail(input: {
  email: string;
  name: string;
  verificationUrl: string;
}): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requiredEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: requiredEnv("RESEND_FROM_EMAIL"),
      to: [input.email],
      subject: "Confirm your BitBoundPay waitlist email",
      html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#171717"><p>Hi ${escapeHtml(input.name)},</p><p>Confirm your email to activate your BitBoundPay waitlist entry.</p><p><a href="${escapeHtml(input.verificationUrl)}">Verify email</a></p><p>This link expires in 24 hours.</p></body></html>`,
      text: `Hi ${input.name},\n\nConfirm your email to activate your BitBoundPay waitlist entry:\n${input.verificationUrl}\n\nThis link expires in 24 hours.`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected the email (${response.status}): ${detail.slice(0, 500)}`);
  }
}

export async function beginWaitlistVerification(input: WaitlistRequest): Promise<WaitlistResult> {
  const email = normalizeEmail(input.email);
  const domain = email.split("@")[1] ?? "";
  if (isDisposableDomain(domain)) {
    return { success: false, message: "Please use a permanent email address." };
  }

  const token = createVerificationToken();
  const tokenHash = await hashVerificationToken(token);
  const expiresAt = verificationTokenExpiresAt();
  const appUrl = requiredEnv("APP_URL").replace(/\/$/, "");
  const verificationUrl = `${appUrl}/verify-waitlist?token=${encodeURIComponent(token)}`;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin.rpc("begin_waitlist_verification", {
    p_signup_name: input.name,
    p_signup_email: email,
    p_signup_building: input.building ?? "",
    p_token_hash: tokenHash,
    p_token_expires_at: expiresAt.toISOString(),
  });

  if (error) throw error;
  const row = data[0];
  if (!row || row.result === "already_verified") {
    return { success: false, message: "You're already on the waitlist." };
  }

  try {
    await sendVerificationEmail({ email, name: input.name, verificationUrl });
  } catch (error) {
    await supabaseAdmin.rpc("cancel_waitlist_verification", {
      p_signup_id: row.signup_id!,
      p_token_hash: tokenHash,
    });
    throw error;
  }

  return { success: true, message: CHECK_INBOX_MESSAGE };
}

export async function confirmWaitlistVerification(
  token: string,
): Promise<"verified" | "expired" | "invalid"> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return "invalid";

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("confirm_waitlist_verification", {
    p_token_hash: await hashVerificationToken(token),
  });
  if (error) throw error;
  return data === "verified" || data === "expired" ? data : "invalid";
}
