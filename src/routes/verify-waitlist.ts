import { createFileRoute } from "@tanstack/react-router";

function page(title: string, message: string, status = 200): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title} | BitBoundPay</title></head><body style="margin:0;background:#f7f7f5;color:#171717;font-family:Arial,sans-serif"><main style="max-width:560px;margin:15vh auto;padding:32px;text-align:center"><h1 style="font-size:32px;font-weight:500">${title}</h1><p style="font-size:16px;line-height:1.6;color:#5f5f5b">${message}</p><a href="/" style="color:#171717">Return to BitBoundPay</a></main></body></html>`;
  return new Response(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const Route = createFileRoute("/verify-waitlist")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        if (!code)
          return page(
            "Verification failed",
            "Verification link expired or invalid. Please request a new verification email.",
            400,
          );
        try {
          console.info("[Waitlist] REDIRECT STEP 1: Exchanging verification code");
          const { createSupabaseAuthClient } =
            await import("@/integrations/supabase/client.server");
          const auth = createSupabaseAuthClient();
          const { data, error } = await auth.auth.exchangeCodeForSession(code);
          if (error || !data.user?.email_confirmed_at) {
            const failure = error ?? new Error("Supabase Auth did not confirm the user");
            const value = failure as {
              message?: unknown;
              code?: unknown;
              status?: unknown;
              details?: unknown;
              stack?: unknown;
            };
            console.error("[Waitlist] REDIRECT STEP 1 failed", {
              error: {
                message: typeof value.message === "string" ? value.message : String(failure),
                code: value.code,
                status: value.status,
                details: value.details,
                stack: value.stack,
              },
            });
            return page(
              "Verification failed",
              "Verification link expired or invalid. Please request a new verification email.",
              400,
            );
          }
          console.info("[Waitlist] REDIRECT STEP 1: Auth response", {
            userConfirmed: true,
          });
          const { activateVerifiedWaitlistEntry } = await import("@/lib/waitlist.service");
          const result = await activateVerifiedWaitlistEntry(data.user.id, data.user.email ?? "");
          if (result.success) {
            return new Response(null, {
              status: 303,
              headers: { Location: "/waitlist-success", "Cache-Control": "no-store" },
            });
          }
          return page(
            "Verification failed",
            "Verification link expired or invalid. Please request a new verification email.",
            409,
          );
        } catch (error) {
          const value = error as {
            message?: unknown;
            code?: unknown;
            status?: unknown;
            details?: unknown;
            stack?: unknown;
          };
          console.error("[Waitlist] Redirect verification failed", {
            error: {
              message: typeof value?.message === "string" ? value.message : String(error),
              code: value?.code,
              status: value?.status,
              details: value?.details,
              stack: value?.stack,
            },
          });
          return page(
            "Verification failed",
            "Verification link expired or invalid. Please request a new verification email.",
            500,
          );
        }
      },
    },
  },
});
