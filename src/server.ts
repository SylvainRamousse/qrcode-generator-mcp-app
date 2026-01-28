import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";

const resourceUri = "ui://qrcode-generator/mcp-app.html";

export function createServer(distDir: string): McpServer {
  const server = new McpServer({
    name: "qrcode-generator",
    version: "1.0.0",
  });

  registerAppTool(
    server,
    "generate_qrcode",
    {
      title: "Generate QR Code",
      description: "Generate a QR code from text, URL, phone number, or any string",
      inputSchema: {
        text: z.string().describe("The text, URL, phone number, or data to encode as a QR code"),
      },
      outputSchema: z.object({
        text: z.string(),
      }),
      _meta: { ui: { resourceUri } },
    },
    async ({ text }): Promise<CallToolResult> => {
      return {
        content: [{ type: "text", text: `QR code generated for: ${text}` }],
        structuredContent: { text },
      };
    },
  );

  registerAppResource(
    server,
    "QR Code Generator",
    resourceUri,
    { description: "QR code generator interface" },
    async (): Promise<ReadResourceResult> => {
      const htmlPath = join(distDir, "mcp-app.html");
      const html = readFileSync(htmlPath, "utf-8");

      return {
        contents: [
          { uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html },
        ],
      };
    },
  );

  return server;
}
