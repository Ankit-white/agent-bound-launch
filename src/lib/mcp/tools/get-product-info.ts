import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const OVERVIEW = `BitBoundPay is the AI Agent Operating System: build, import, deploy and manage AI agents from one platform.
Highlights:
- Bring your own AI provider or run local AI.
- Import agents from n8n workflows, GitHub repos or ZIP packages.
- Unified deployment, monitoring and management for every agent.
- Currently in early access; people join via the public waitlist.`;

export default defineTool({
  name: "get_product_info",
  title: "Get BitBoundPay product info",
  description: "Return a public overview of BitBoundPay: what it is, its key capabilities, and its launch status.",
  inputSchema: {
    topic: z
      .string()
      .trim()
      .optional()
      .describe("Optional topic hint, e.g. 'sources' or 'roadmap'. Currently informational only."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({ content: [{ type: "text" as const, text: OVERVIEW }] }),
});
