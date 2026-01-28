# QR Code Generator MCP App

An MCP App that generates QR codes from text, URLs, phone numbers, or any string. Supports both local (stdio) and remote (Vercel) deployment.

## Installation

```bash
npm install
npm run build
```

## Usage

### Local Mode (stdio)

Run the server locally:

```bash
npm start
```

Or for development with hot reload:

```bash
npm run serve
```

### Remote Mode (Vercel)

Deploy to Vercel:

```bash
npx vercel --prod
```

The MCP endpoint will be available at `https://your-project.vercel.app/mcp`.

## Configure in Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

### Option 1: Local Server (stdio)

```json
{
  "mcpServers": {
    "qrcode-generator": {
      "command": "node",
      "args": ["/path/to/qrcode-generator-mcp-app/dist/index.js"]
    }
  }
}
```

### Option 2: Remote Server (Vercel)

```json
{
  "mcpServers": {
    "qrcode-generator": {
      "type": "url",
      "url": "https://your-project.vercel.app/mcp"
    }
  }
}
```

After saving the config, restart Claude Desktop.

## Using in Claude

Once configured, ask Claude:
- "Generate a QR code for https://example.com"
- "Create a QR code with my phone number"
- "Make a QR code for this text"

The interactive UI will appear in the conversation.

## Project Structure

```
qrcode-generator-mcp-app/
├── index.ts              # Local stdio entry point
├── src/
│   ├── server.ts         # Shared MCP server factory
│   └── mcp-app.ts        # Client-side UI logic
├── api/
│   └── mcp.ts            # Vercel serverless function
├── mcp-app.html          # UI template
├── vite.config.ts        # Vite build config
├── vercel.json           # Vercel deployment config
└── package.json
```

## Development

- `npm run build` — Build for production (Vite + TypeScript)
- `npm run dev` — Watch mode for TypeScript
- `npm run serve` — Run locally with tsx
- `npx vercel dev` — Test Vercel function locally
