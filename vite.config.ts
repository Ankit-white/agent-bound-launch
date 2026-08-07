// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  vite: {
    // Vite 8 resolves tsconfig paths natively; keep this enabled while the
    // shared Lovable wrapper still injects its legacy peer plugin.
    resolve: { tsconfigPaths: true },
    // @lovable.dev/mcp-js 0.26.1 compares Vite's normalized POSIX root with
    // Windows path.resolve() output. Generated MCP routes remain checked in,
    // so skip only the broken generator on Windows.
    plugins: process.platform === "win32" ? [] : [mcpPlugin()],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

