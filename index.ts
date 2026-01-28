import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "./src/server.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = __dirname.endsWith("dist")
  ? __dirname
  : join(__dirname, "dist");

const server = createServer(distDir);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("QR Code Generator MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
