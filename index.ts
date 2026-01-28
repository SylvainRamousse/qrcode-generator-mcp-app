import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = new McpServer({
  name: "qrcode-generator",
  version: "1.0.0",
});

const resourceUri = "ui://qrcode-generator/mcp-app.html";

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
    const htmlPath = __dirname.endsWith("dist")
      ? join(__dirname, "mcp-app.html")
      : join(__dirname, "dist", "mcp-app.html");
    const html = readFileSync(htmlPath, "utf-8");

    return {
      contents: [
        { uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html },
      ],
    };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("QR Code Generator MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
