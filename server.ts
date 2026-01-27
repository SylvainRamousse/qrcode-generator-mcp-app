import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

// Resolve the dist directory containing index.html:
// - Vercel serverless:  process.cwd() is the project root, dist/ is included via vercel.json
// - Local TypeScript:   server.ts sits at project root, dist/ is a sibling
// - Compiled (dist/):   server.js is inside dist/ alongside index.html
const DIST_DIR = process.env.VERCEL
  ? path.join(process.cwd(), "dist")
  : import.meta.filename.endsWith(".ts")
    ? path.join(import.meta.dirname, "dist")
    : import.meta.dirname;

// QR code type schema
const QRCodeTypeSchema = z.enum([
  "text",
  "url",
  "email",
  "phone",
  "sms",
  "wifi",
  "vcard",
]);

// Tool input schema
const GenerateQRCodeSchema = z.object({
  type: QRCodeTypeSchema.describe(
    "Type of QR code to generate: text, url, email, phone, sms, wifi, or vcard"
  ),
  content: z.string().describe("Content for the QR code"),
  // Additional fields for specific types
  wifiSecurity: z
    .enum(["WPA", "WEP", "nopass"])
    .optional()
    .describe("WiFi security type (only for wifi type)"),
  wifiHidden: z
    .boolean()
    .optional()
    .describe("Whether WiFi network is hidden (only for wifi type)"),
  // vCard fields
  vcardName: z.string().optional().describe("Full name for vCard"),
  vcardOrg: z.string().optional().describe("Organization for vCard"),
  vcardTitle: z.string().optional().describe("Job title for vCard"),
  vcardEmail: z.string().optional().describe("Email for vCard"),
  vcardPhone: z.string().optional().describe("Phone number for vCard"),
  vcardAddress: z.string().optional().describe("Address for vCard"),
  vcardUrl: z.string().optional().describe("Website URL for vCard"),
});

type GenerateQRCodeInput = z.infer<typeof GenerateQRCodeSchema>;

/**
 * Creates a new MCP server instance with QR code generation tools and resources.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "QR Code Generator MCP App",
    version: "1.0.0",
  });

  const resourceUri = "qrcode://app/ui";

  // Register the QR code generation tool
  registerAppTool(
    server,
    "generate_qrcode",
    {
      title: "Generate QR Code",
      description:
        "Generate a QR code for various types of content including URLs, plain text, email addresses, phone numbers, SMS, WiFi credentials, and vCards. Returns an interactive UI for displaying and downloading the QR code.",
      inputSchema: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["text", "url", "email", "phone", "sms", "wifi", "vcard"],
            description:
              "Type of QR code to generate: text, url, email, phone, sms, wifi, or vcard",
          },
          content: {
            type: "string",
            description: "Content for the QR code",
          },
          wifiSecurity: {
            type: "string",
            enum: ["WPA", "WEP", "nopass"],
            description: "WiFi security type (only for wifi type)",
          },
          wifiHidden: {
            type: "boolean",
            description: "Whether WiFi network is hidden (only for wifi type)",
          },
          vcardName: {
            type: "string",
            description: "Full name for vCard",
          },
          vcardOrg: {
            type: "string",
            description: "Organization for vCard",
          },
          vcardTitle: {
            type: "string",
            description: "Job title for vCard",
          },
          vcardEmail: {
            type: "string",
            description: "Email for vCard",
          },
          vcardPhone: {
            type: "string",
            description: "Phone number for vCard",
          },
          vcardAddress: {
            type: "string",
            description: "Address for vCard",
          },
          vcardUrl: {
            type: "string",
            description: "Website URL for vCard",
          },
        },
        required: ["type", "content"],
      } as any,
      _meta: { ui: { resourceUri } },
    },
    async (input: GenerateQRCodeInput): Promise<CallToolResult> => {
      // Format content based on type
      let formattedContent = input.content;
      let displayTitle = "";

      switch (input.type) {
        case "url":
          displayTitle = "URL QR Code";
          // Ensure URL has protocol
          if (
            !formattedContent.startsWith("http://") &&
            !formattedContent.startsWith("https://")
          ) {
            formattedContent = "https://" + formattedContent;
          }
          break;

        case "email":
          displayTitle = "Email QR Code";
          formattedContent = `mailto:${input.content}`;
          break;

        case "phone":
          displayTitle = "Phone QR Code";
          formattedContent = `tel:${input.content}`;
          break;

        case "sms":
          displayTitle = "SMS QR Code";
          formattedContent = `sms:${input.content}`;
          break;

        case "wifi":
          displayTitle = "WiFi QR Code";
          const parts = input.content.split("|");
          const ssid = parts[0] || input.content;
          const password = parts[1] || "";
          const security = input.wifiSecurity || "WPA";
          const hidden = input.wifiHidden ? "true" : "false";
          formattedContent = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`;
          break;

        case "vcard":
          displayTitle = "vCard QR Code";
          const vcardLines = ["BEGIN:VCARD", "VERSION:3.0"];

          if (input.vcardName) {
            vcardLines.push(`FN:${input.vcardName}`);
            const names = input.vcardName.split(" ");
            vcardLines.push(
              `N:${names[names.length - 1]};${names.slice(0, -1).join(" ")};;;`
            );
          }
          if (input.vcardOrg) vcardLines.push(`ORG:${input.vcardOrg}`);
          if (input.vcardTitle) vcardLines.push(`TITLE:${input.vcardTitle}`);
          if (input.vcardEmail) vcardLines.push(`EMAIL:${input.vcardEmail}`);
          if (input.vcardPhone) vcardLines.push(`TEL:${input.vcardPhone}`);
          if (input.vcardAddress)
            vcardLines.push(`ADR:;;${input.vcardAddress};;;;`);
          if (input.vcardUrl) vcardLines.push(`URL:${input.vcardUrl}`);

          vcardLines.push("END:VCARD");
          formattedContent = vcardLines.join("\n");
          break;

        case "text":
        default:
          displayTitle = "Text QR Code";
          break;
      }

      return {
        content: [
          {
            type: "text",
            text: `Generated ${input.type} QR code${input.type === "wifi" ? " for network: " + input.content.split("|")[0] : ""}`,
          },
        ],
        _meta: {
          qrData: {
            type: input.type,
            content: formattedContent,
            originalInput: input.content,
            displayTitle,
          },
        },
      };
    }
  );

  // Register the app resource
  registerAppResource(
    server,
    resourceUri,
    resourceUri,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await fs.readFile(path.join(DIST_DIR, "index.html"), "utf-8");
      return {
        contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
      };
    }
  );

  return server;
}
