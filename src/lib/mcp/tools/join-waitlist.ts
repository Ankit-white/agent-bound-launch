import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "mailnesia.com",
  "throwawaymail.com",
  "moakt.com",
  "emailondeck.com",
  "spamgourmet.com",
  "mintemail.com",
  "tempinbox.com",
  "mytemp.email",
  "inboxkitten.com",
  "mailcatch.com",
  "grr.la",
  "spam4.me",
  "anonaddy.me",
  "duck.com",
  "simplelogin.com",
  "relay.firefox.com",
  "privaterelay.appleid.com",
]);

async function domainHasMailServer(domain: string): Promise<boolean> {
  const query = async (type: "MX" | "A") => {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
      { headers: { accept: "application/dns-json" } },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { Status?: number; Answer?: Array<{ type: number }> };
    if (json.Status !== 0) return false;
    return Boolean(json.Answer && json.Answer.length > 0);
  };
  try {
    const mx = await query("MX");
    if (mx === null) return true;
    if (mx) return true;
    const a = await query("A");
    return a === null ? true : a;
  } catch {
    return true;
  }
}

export default defineTool({
  name: "join_waitlist",
  title: "Join the BitBoundPay waitlist",
  description:
    "Add someone to the BitBoundPay early-access waitlist. Rejects disposable or unverifiable email domains, and each email can join only once.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).describe("Full name of the person joining."),
    email: z.string().trim().email().max(255).describe("A real, deliverable email address."),
    building: z
      .string()
      .trim()
      .max(1000)
      .optional()
      .describe("Optional note about what they are building."),
  },
  outputSchema: { joined: z.boolean(), message: z.string() },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  handler: async ({ name, email, building }) => {
    const normalized = email.toLowerCase();
    const domain = normalized.split("@")[1] ?? "";

    const fail = (message: string) => ({
      content: [{ type: "text" as const, text: message }],
      structuredContent: { joined: false, message },
      isError: true,
    });

    if (!domain || DISPOSABLE_DOMAINS.has(domain) || !(await domainHasMailServer(domain))) {
      return fail("Email not verified. Please use a verified email address.");
    }

    const supabase = supabaseAnon();
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ name, email: normalized, building: building || null });

    if (error) {
      return fail(
        error.code === "23505"
          ? "This email is already on the waitlist."
          : "Could not join the waitlist right now. Please try again.",
      );
    }

    const message = `${name} has been added to the BitBoundPay waitlist.`;
    return {
      content: [{ type: "text" as const, text: message }],
      structuredContent: { joined: true, message },
    };
  },
});

