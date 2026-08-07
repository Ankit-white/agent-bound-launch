import { createFileRoute } from "@tanstack/react-router";

function page(title: string, message: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} | BitBoundPay</title>
</head>
<body style="margin:0;background:#f7f7f5;color:#171717;font-family:Arial,sans-serif">
  <main style="max-width:560px;margin:15vh auto;padding:32px;text-align:center">
    <h1 style="font-size:32px;font-weight:500">${title}</h1>
    <p style="font-size:16px;line-height:1.6;color:#5f5f5b">${message}</p>
    <a href="/" style="color:#171717">Return to BitBoundPay</a>
  </main>
</body>
</html>`;

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
        const token = new URL(request.url).searchParams.get("token") ?? "";
        try {
          const { confirmWaitlistVerification } = await import("@/lib/waitlist.service");
          const result = await confirmWaitlistVerification(token);

          if (result === "verified") {
            return page("Email verified", "Your waitlist entry is now active.");
          }
          if (result === "expired") {
            return page(
              "Verification link expired",
              "Submit the waitlist form again to receive a new verification link.",
              410,
            );
          }
          return page("Invalid verification link", "This link is invalid or has already been used.", 400);
        } catch (error) {
          console.error("[Waitlist] Confirmation failed", error);
          return page("Unable to verify email", "Please try again later.", 500);
        }
      },
    },
  },
});
