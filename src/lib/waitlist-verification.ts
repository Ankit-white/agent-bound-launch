export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export function createVerificationToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function hashVerificationToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function verificationTokenExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + VERIFICATION_TOKEN_TTL_MS);
}
