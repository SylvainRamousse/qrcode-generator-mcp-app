/**
 * Entry point for running the MCP server.
 *
 * Modes:
 * - Vercel (serverless): Exports the Express app as default export
 * - HTTP (local):        Starts a listening HTTP server on PORT
 * - Stdio (local):       Connects via stdin/stdout for Claude Desktop
 */

import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import type { Request, Response } from "express";
import { createServer } from "./server.js";

/**
 * Creates the Express application with all routes configured.
 * This is separated from listen() so Vercel can import the app directly.
 */
function createApp() {
  const app = createMcpExpressApp({ host: "0.0.0.0" });
  app.use(cors());

  // Server info
  app.get("/", (_req: Request, res: Response) => {
    res.json({
      name: "QR Code Generator MCP Server",
      version: "1.0.0",
      status: "running",
      endpoints: {
        mcp: "/mcp",
        health: "/health",
      },
    });
  });

  // Health check
  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "healthy" });
  });

  // MCP endpoint — creates a fresh server per request (stateless)
  app.all("/mcp", async (req: Request, res: Response) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("MCP error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  return app;
}

// ── Vercel (serverless) ────────────────────────────────────────────────
// Vercel imports this file and uses the default export as the request handler.
// We MUST NOT call app.listen() in this path — Vercel manages the server.
const app = createApp();
export default app;

// ── Local execution ────────────────────────────────────────────────────
// When run directly (not imported by Vercel), start the appropriate transport.
const isDirectExecution =
  !process.env.VERCEL &&
  (process.argv[1]?.endsWith("main.ts") ||
    process.argv[1]?.endsWith("main.js"));

if (isDirectExecution) {
  if (process.argv.includes("--stdio")) {
    // Stdio mode for local Claude Desktop
    console.error("Starting in stdio mode...");
    createServer()
      .connect(new StdioServerTransport())
      .catch((e) => {
        console.error("Fatal error:", e);
        process.exit(1);
      });
  } else {
    // HTTP mode for local development
    const port = parseInt(process.env.PORT ?? "3001", 10);
    app.listen(port, () => {
      console.log(`QR Code Generator MCP Server running on port ${port}`);
      console.log(`  Health:  http://localhost:${port}/health`);
      console.log(`  MCP:     http://localhost:${port}/mcp`);
    });
  }
}
