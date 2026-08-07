import assert from "node:assert/strict";
import test from "node:test";
import { emailSchema, isDisposableDomain, normalizeEmail } from "./email-validation.ts";

const validEmails = [
  "person@example.com",
  "first.last+tag@sub.example.co.uk",
  " USER@EXAMPLE.COM ",
];

const invalidEmails = [
  "plainaddress",
  "@example.com",
  "person@localhost",
  ".person@example.com",
  "person.@example.com",
  "person..name@example.com",
  "person@-example.com",
  "person@example-.com",
  "person@example.c",
  "person name@example.com",
];

test("accepts valid email syntax", () => {
  for (const email of validEmails) {
    assert.equal(emailSchema.safeParse(email).success, true, email);
  }
});

test("rejects invalid email syntax", () => {
  for (const email of invalidEmails) {
    assert.equal(emailSchema.safeParse(email).success, false, email);
  }
});

test("normalizes email casing and surrounding whitespace", () => {
  assert.equal(normalizeEmail(" User@Example.COM "), "user@example.com");
});

test("rejects disposable providers and their subdomains", () => {
  assert.equal(isDisposableDomain("mailinator.com"), true);
  assert.equal(isDisposableDomain("inbox.mailinator.com"), true);
  assert.equal(isDisposableDomain("example.com"), false);
  assert.equal(isDisposableDomain("notmailinator.com"), false);
});
