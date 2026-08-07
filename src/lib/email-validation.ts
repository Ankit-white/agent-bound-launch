import { z } from "zod";

const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "anonaddy.me",
  "byom.de",
  "dispostable.com",
  "duck.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getnada.com",
  "grr.la",
  "guerrillamail.com",
  "inboxkitten.com",
  "mailcatch.com",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mintemail.com",
  "moakt.com",
  "mytemp.email",
  "privaterelay.appleid.com",
  "relay.firefox.com",
  "sharklasers.com",
  "simplelogin.com",
  "spam4.me",
  "spamgourmet.com",
  "tempmail.com",
  "temp-mail.org",
  "tempinbox.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const emailSyntax = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;
const localPartCharacter = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i;
const domainLabel = /^(?!-)[a-z0-9-]{1,63}(?<!-)$/;

export const emailSchema = z
  .string()
  .trim()
  .max(255, "Email is too long")
  .refine((value) => emailSyntax.test(value), "Enter a valid email address")
  .refine((value) => {
    const [localPart, domain] = value.toLowerCase().split("@");
    return Boolean(
      localPart &&
        localPartCharacter.test(localPart) &&
        localPart.length <= 64 &&
        !localPart.startsWith(".") &&
        !localPart.endsWith(".") &&
        !localPart.includes("..") &&
        domain &&
        domain.length <= 253 &&
        domain.split(".").every((label) => domainLabel.test(label)) &&
        (domain.split(".").at(-1)?.length ?? 0) >= 2,
    );
  }, "Enter a valid email address");

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isDisposableDomain(domain: string): boolean {
  return [...DISPOSABLE_DOMAINS].some(
    (blockedDomain) => domain === blockedDomain || domain.endsWith(`.${blockedDomain}`),
  );
}

async function domainHasMailServer(domain: string): Promise<boolean> {
  const query = async (type: "MX" | "A") => {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`,
      { headers: { accept: "application/dns-json" } },
    );
    if (!response.ok) return null;
    const json = (await response.json()) as { Status?: number; Answer?: unknown[] };
    if (json.Status !== 0) return false;
    return Boolean(json.Answer?.length);
  };

  try {
    const mx = await query("MX");
    if (mx === null || mx) return true;
    const a = await query("A");
    return a === null || a;
  } catch {
    return true;
  }
}

export async function isAcceptableEmail(email: string): Promise<boolean> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return false;

  const domain = normalizeEmail(parsed.data).split("@")[1] ?? "";
  return !isDisposableDomain(domain) && (await domainHasMailServer(domain));
}
