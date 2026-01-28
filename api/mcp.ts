import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { join } from "path";
import { createServer } from "../src/server.js";

const app = express();
app.use(express.json());

// Handle both /mcp (from rewrite) and /api/mcp (direct)
const handlePost = async (req: express.Request, res: express.Response) => {
  const distDir = join(process.cwd(), "dist");
  const server = createServer(distDir);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
};

const handleGet = async (req: express.Request, res: express.Response) => {
  const distDir = join(process.cwd(), "dist");
  const server = createServer(distDir);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  res.on("close", () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res);
};

const handleDelete = (_req: express.Request, res: express.Response) => {
  res.status(405).json({ error: "Session termination not supported in stateless mode" });
};

const handleOptions = (_req: express.Request, res: express.Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.status(204).end();
};

// Register routes for both paths
app.post("/mcp", handlePost);
app.post("/api/mcp", handlePost);
app.get("/mcp", handleGet);
app.get("/api/mcp", handleGet);
app.delete("/mcp", handleDelete);
app.delete("/api/mcp", handleDelete);
app.options("/mcp", handleOptions);
app.options("/api/mcp", handleOptions);

export default app;
