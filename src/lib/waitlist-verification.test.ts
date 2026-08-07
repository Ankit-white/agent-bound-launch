import assert from "node:assert/strict";
import test from "node:test";
import {
  VERIFICATION_TOKEN_TTL_MS,
  createVerificationToken,
  hashVerificationToken,
  verificationTokenExpiresAt,
} from "./waitlist-verification.ts";

test("creates a URL-safe token with 256 bits of entropy", () => {
  const token = createVerificationToken();
  assert.match(token, /^[A-Za-z0-9_-]{43}$/);
  assert.notEqual(token, createVerificationToken());
});

test("hashes tokens deterministically without storing the raw value", async () => {
  const token = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO12";
  const hash = await hashVerificationToken(token);

  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(hash, await hashVerificationToken(token));
  assert.notEqual(hash, token);
});

test("expires verification tokens after 24 hours", () => {
  const now = new Date("2026-08-07T12:00:00.000Z");
  const expiresAt = verificationTokenExpiresAt(now);

  assert.equal(expiresAt.getTime() - now.getTime(), VERIFICATION_TOKEN_TTL_MS);
  assert.equal(expiresAt.toISOString(), "2026-08-08T12:00:00.000Z");
});
