import { defineMcp } from "@lovable.dev/mcp-js";
import joinWaitlistTool from "./tools/join-waitlist";
import getProductInfoTool from "./tools/get-product-info";

export default defineMcp({
  name: "bitboundpay-agent-os",
  title: "BitBoundPay: Agent OS",
  version: "0.1.0",
  instructions:
    "Tools for BitBoundPay, the AI Agent Operating System. Use `get_product_info` to learn what the product does, and `join_waitlist` to add someone to the early-access waitlist.",
  tools: [getProductInfoTool, joinWaitlistTool],
});
