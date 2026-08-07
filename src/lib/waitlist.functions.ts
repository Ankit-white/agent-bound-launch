import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { emailSchema } from "@/lib/email-validation";

const inputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: emailSchema,
  building: z.string().trim().max(1000),
});

export const joinWaitlist = createServerFn({ method: "POST" })
  .validator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { beginWaitlistVerificationFromServer } = await import("@/lib/waitlist.service");
      return await beginWaitlistVerificationFromServer(data);
    } catch (error) {
      const present = (value: unknown) => typeof value === "string" && value.trim().length > 0;
      console.error("[Waitlist] Runtime configuration diagnostics", {
        "Running Environment": "Server",
        "SUPABASE_URL present?": present(process.env["SUPABASE_URL"]),
        "SUPABASE_PUBLISHABLE_KEY present?": present(process.env["SUPABASE_PUBLISHABLE_KEY"]),
        "VITE_SUPABASE_URL present?": present(import.meta.env["VITE_SUPABASE_URL"]),
        "VITE_SUPABASE_PUBLISHABLE_KEY present?": present(
          import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
        ),
      });
      const value = error as {
        message?: unknown;
        code?: unknown;
        status?: unknown;
        details?: unknown;
        stack?: unknown;
      };
      console.error("[Waitlist] Verification request failed", {
        error: {
          message: typeof value?.message === "string" ? value.message : String(error),
          code: value?.code,
          status: value?.status,
          details: value?.details,
          stack: value?.stack,
        },
      });
      return { success: false as const, message: "Something went wrong. Please try again." };
    }
  });
