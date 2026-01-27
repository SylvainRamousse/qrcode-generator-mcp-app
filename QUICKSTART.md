# QR Code Generator - Quick Start Guide

## What is This?

An MCP (Model Context Protocol) App that lets you generate QR codes directly in Claude Desktop! It supports multiple QR code types with an interactive visual UI.

## Supported QR Code Types

- 🔗 **URLs** - Web links and websites
- 📝 **Plain Text** - Any text content
- 📧 **Email** - Email addresses with mailto links
- 📱 **Phone** - Phone numbers with tel links
- 💬 **SMS** - SMS messages
- 📶 **WiFi** - WiFi network credentials (SSID, password, security type)
- 👤 **vCards** - Contact information (name, email, phone, organization, etc.)

## Quick Setup (3 steps)

### 1. Install

```bash
./setup.sh
```

Or manually:
```bash
npm install
npm run build
```

### 2. Configure Claude Desktop

Edit your Claude Desktop config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration (replace with your actual path):

```json
{
  "mcpServers": {
    "qrcode-generator": {
      "command": "npx",
      "args": [
        "tsx",
        "/Users/yourname/path/to/qrcode-generator-mcp-app/main.ts",
        "--stdio"
      ]
    }
  }
}
```

### 3. Restart Claude Desktop

Close and reopen Claude Desktop to load the new MCP server.

## Usage Examples

Once configured, just ask Claude to generate QR codes:

### URL
```
Generate a QR code for https://github.com
```

### WiFi Network
```
Create a WiFi QR code for network "MyHomeWiFi" with password "SecurePass123" using WPA security
```

### Contact Card (vCard)
```
Generate a vCard QR code for:
- Name: John Doe
- Email: john@example.com
- Phone: +1-555-0123
- Organization: Acme Corp
```

### Phone Number
```
Make a QR code for phone number +1-555-0123
```

### Email
```
Create an email QR code for contact@example.com
```

### Plain Text
```
Generate a text QR code with "Hello World!"
```

## Features

- **Interactive UI** - Visual QR code preview with host theme integration
- **Multiple Export Formats** - Download as SVG or PNG
- **Responsive Design** - Works on any screen size
- **Real-time Generation** - Instant QR code creation
- **Type Validation** - Ensures correct format for each QR code type

## How It Works

1. You ask Claude to generate a QR code
2. Claude calls the `generate_qrcode` MCP tool
3. The server formats the content based on type
4. An interactive UI displays the QR code
5. You can download the QR code as SVG or PNG

## Troubleshooting

### Server not appearing in Claude Desktop
- Check that the path in your config is absolute, not relative
- Verify the file exists at that path
- Make sure you've run `npm install` and `npm run build`
- Restart Claude Desktop after config changes

### QR code not displaying
- Check that `dist/index.html` was created by `npm run build`
- Look for errors in Claude Desktop's Developer Tools console

### Dependencies not installing
- Make sure you have Node.js v18 or later installed
- Try removing `node_modules` and `package-lock.json` and reinstalling

## Project Structure

```
qrcode-generator-mcp-app/
├── main.ts               # Entry point (HTTP/stdio/Vercel)
├── server.ts             # MCP server (tool + resource registration)
├── api/
│   └── index.ts         # Vercel serverless function entry point
├── src/
│   ├── mcp-app.tsx      # React UI with QR generation logic
│   └── styles.css       # Themed styling
├── dist/                 # Build output (generated)
│   └── index.html       # Built UI (single-file bundle)
├── vercel.json          # Vercel deployment config
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Build configuration
└── setup.sh             # Quick setup script
```

## Tech Stack

- **@modelcontextprotocol/ext-apps** - MCP Apps SDK for interactive UIs
- **@modelcontextprotocol/sdk** - Core MCP protocol
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool with single-file bundling

## Development

### Running in Development Mode

```bash
# Terminal 1: Watch and rebuild UI
npm run build -- --watch

# Terminal 2: Run server
npm run serve
```

### Testing with basic-host

```bash
# Clone examples
git clone https://github.com/modelcontextprotocol/ext-apps.git /tmp/mcp-ext-apps

# Terminal 1: Build and run your server
npm run build && npm run serve

# Terminal 2: Run test host
cd /tmp/mcp-ext-apps/examples/basic-host
npm install
SERVERS='["http://localhost:3001/mcp"]' npm run start
# Open http://localhost:8080
```

## License

MIT

## Contributing

Issues and pull requests are welcome! Please check the main README for development guidelines.
