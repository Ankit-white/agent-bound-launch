import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { emailSchema } from "../../email-validation";

export default defineTool({
  name: "join_waitlist",
  title: "Join the BitBoundPay waitlist",
  description:
    "Start email confirmation for the BitBoundPay early-access waitlist. The email must be confirmed before the entry becomes active.",
  inputSchema: {
    name: z.string().trim().min(1).max(100).describe("Full name of the person joining."),
    email: emailSchema.describe("A real, deliverable email address."),
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
    const fail = (message: string) => ({
      content: [{ type: "text" as const, text: message }],
      structuredContent: { joined: false, message },
      isError: true,
    });

    try {
      const { beginWaitlistVerification } = await import("../../waitlist.service");
      const result = await beginWaitlistVerification({
        name,
        email,
        ...(building === undefined ? {} : { building }),
      });
      if (!result.success) return fail(result.message);

      return {
        content: [{ type: "text" as const, text: result.message }],
        structuredContent: { joined: true, message: result.message },
      };
    } catch (error) {
      console.error("[Waitlist MCP] Verification request failed", error);
      return fail("Could not start email verification right now. Please try again.");
    }
  },
});

