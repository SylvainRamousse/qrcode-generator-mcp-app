/**
 * Entry point for running the MCP server in different modes.
 * - HTTP mode (default): Server runs on HTTP for remote access
 * - Stdio mode (--stdio): Server runs on stdio for local Claude Desktop
 */

import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import type { Request, Response } from "express";
import { createServer } from "./server.js";

/**
 * Starts an MCP server with Streamable HTTP transport.
 * This is used for remote access (Vercel deployment).
 */
export async function startStreamableHTTPServer(
  createServerFn: () => McpServer,
): Promise<void> {
  const port = parseInt(process.env.PORT ?? "3001", 10);

  const app = createMcpExpressApp({ host: "0.0.0.0" });
  app.use(cors());

  // Health check endpoint
  app.get("/", (req: Request, res: Response) => {
    res.json({
      name: "QR Code Generator MCP Server",
      version: "1.0.0",
      status: "running",
      endpoints: {
        mcp: "/mcp",
        health: "/health"
      }
    });
  });

  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "healthy" });
  });

  // MCP endpoint
  app.all("/mcp", async (req: Request, res: Response) => {
    const server = createServerFn();
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

  const httpServer = app.listen(port, () => {
    console.log(`QR Code Generator MCP Server running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
  });

  const shutdown = () => {
    console.log("\nShutting down...");
    httpServer.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

/**
 * Starts an MCP server with stdio transport.
 * This is used for local Claude Desktop integration.
 */
export async function startStdioServer(
  createServerFn: () => McpServer,
): Promise<void> {
  await createServerFn().connect(new StdioServerTransport());
}

async function main() {
  if (process.argv.includes("--stdio")) {
    console.error("Starting in stdio mode...");
    await startStdioServer(createServer);
  } else {
    console.log("Starting in HTTP mode...");
    await startStreamableHTTPServer(createServer);
  }
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
