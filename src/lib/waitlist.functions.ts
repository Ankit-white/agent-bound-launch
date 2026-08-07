import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  building: z.string().trim().max(1000),
});

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
  "byom.de",
  "anonaddy.me",
  "duck.com",
  "simplelogin.com",
  "relay.firefox.com",
  "privaterelay.appleid.com",
  "icloud.com.proxy",
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
    if (mx === null) return true; // resolver unavailable — don't block real users
    if (mx) return true;
    const a = await query("A");
    return a === null ? true : a;
  } catch {
    return true;
  }
}

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase();
    const domain = email.split("@")[1] ?? "";

    if (!domain || DISPOSABLE_DOMAINS.has(domain)) {
      return {
        ok: false as const,
        error: "Email not verified. Please use a verified email address.",
      };
    }

    if (!(await domainHasMailServer(domain))) {
      return {
        ok: false as const,
        error: "Email not verified. Please use a verified email address.",
      };
    }

    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabase.from("waitlist_signups").insert({
      name: data.name,
      email,
      building: data.building || null,
    });

    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, error: "This email is already on the waitlist." };
      }
      return { ok: false as const, error: "Something went wrong. Please try again." };
    }

    return { ok: true as const };
  });
