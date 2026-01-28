import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { join } from "path";
import { createServer } from "../src/server.js";

const app = express();
app.use(express.json());

app.post("/api/mcp", async (req, res) => {
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
});

app.get("/api/mcp", async (req, res) => {
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
});

app.delete("/api/mcp", (_req, res) => {
  res.status(405).json({ error: "Session termination not supported in stateless mode" });
});

app.options("/api/mcp", (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.status(204).end();
});

export default app;
