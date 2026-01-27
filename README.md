# QR Code Generator MCP App

An MCP (Model Context Protocol) App that generates QR codes for various types of content including URLs, plain text, email addresses, phone numbers, SMS, WiFi credentials, and vCards.

## Features

- **Multiple QR Code Types:**
  - 🔗 URLs and web links
  - 📝 Plain text
  - 📧 Email addresses
  - 📱 Phone numbers
  - 💬 SMS messages
  - 📶 WiFi credentials
  - 👤 vCards (contact information)

- **Interactive UI:**
  - Real-time QR code generation
  - Visual preview of generated codes
  - Download as SVG or PNG

- **Host Integration:**
  - Adapts to host theme (light/dark mode)
  - Uses host typography and colors
  - Responsive layout

- **Deployment Options:**
  - ☁️ Remote server (Vercel) - Use from anywhere!
  - 💻 Local server (stdio) - Traditional Claude Desktop integration

## Quick Start

### Option 1: Use Remote Server (Recommended)

The easiest way to use this MCP app is to deploy it to Vercel:

1. **Fork and deploy to Vercel** (see [DEPLOYMENT.md](DEPLOYMENT.md))
2. **Configure Claude Desktop** with your Vercel URL:
   ```json
   {
     "mcpServers": {
       "qrcode-generator": {
         "url": "https://your-app.vercel.app/mcp"
       }
     }
   }
   ```
3. **Restart Claude Desktop**

### Option 2: Run Locally

For local development or if you prefer to run your own server:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the UI:**
   ```bash
   npm run build
   ```

3. **Configure Claude Desktop:**

   On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   On Windows: `%APPDATA%\Claude\claude_desktop_config.json`

   ```json
   {
     "mcpServers": {
       "qrcode-generator": {
         "command": "npx",
         "args": [
           "tsx",
           "/absolute/path/to/qrcode-generator-mcp-app/main.ts",
           "--stdio"
         ]
       }
     }
   }
   ```

4. **Restart Claude Desktop**

## Usage Examples

Once configured, ask Claude to generate QR codes:

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

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

**Quick deploy:**
1. Push to GitHub
2. Import to Vercel
3. Deploy automatically
4. Use your Vercel URL in Claude Desktop config

## Development

### Project Structure

```
qrcode-generator-mcp-app/
├── main.ts               # Entry point (HTTP/stdio server)
├── server.ts             # MCP server with tool registration
├── src/
│   ├── mcp-app.tsx      # React UI component
│   └── styles.css       # Styling with host theme integration
├── dist/
│   ├── index.html       # Built UI (single-file bundle)
│   ├── main.js          # Compiled server entry point
│   └── server.js        # Compiled server logic
├── vercel.json          # Vercel deployment config
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

### Available Scripts

```bash
# Development
npm run dev              # Run HTTP server (port 3001)
npm run dev:stdio        # Run stdio server (for Claude Desktop)

# Building
npm run build            # Build UI and compile TypeScript
npm run build:ui         # Build UI only
npm run build:server     # Compile TypeScript only

# Production
npm start                # Run compiled HTTP server
```

### Local Development

**Run HTTP server:**
```bash
npm run dev
```
Visit http://localhost:3001/health to verify it's running.

**Run stdio server:**
```bash
npm run dev:stdio
```
Connect via Claude Desktop configuration.

### Testing

Test the HTTP endpoint:
```bash
# Health check
curl http://localhost:3001/health

# Server info
curl http://localhost:3001/
```

## Key Technologies

- **@modelcontextprotocol/ext-apps** - MCP Apps SDK
- **@modelcontextprotocol/sdk** - Core MCP SDK
- **React** - UI framework
- **Express** - HTTP server
- **Vite** - Build tool with single-file plugin
- **TypeScript** - Type safety

## Tool Schema

The `generate_qrcode` tool accepts:

```typescript
{
  type: "text" | "url" | "email" | "phone" | "sms" | "wifi" | "vcard",
  content: string,
  // WiFi-specific (optional)
  wifiSecurity?: "WPA" | "WEP" | "nopass",
  wifiHidden?: boolean,
  // vCard-specific (optional)
  vcardName?: string,
  vcardOrg?: string,
  vcardTitle?: string,
  vcardEmail?: string,
  vcardPhone?: string,
  vcardAddress?: string,
  vcardUrl?: string
}
```

## Configuration Examples

### Remote Server (Vercel)
```json
{
  "mcpServers": {
    "qrcode-generator": {
      "url": "https://your-app.vercel.app/mcp"
    }
  }
}
```

### Local Stdio (Development)
```json
{
  "mcpServers": {
    "qrcode-generator": {
      "command": "npx",
      "args": ["tsx", "/path/to/qrcode-generator-mcp-app/main.ts", "--stdio"]
    }
  }
}
```

### Local HTTP (Testing)
```json
{
  "mcpServers": {
    "qrcode-generator": {
      "url": "http://localhost:3001/mcp"
    }
  }
}
```

## Troubleshooting

### Build Errors
- Make sure Node.js 18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Rebuild: `npm run build`

### Server Not Starting
- Check port 3001 is not in use
- Review error logs in terminal
- Verify all dependencies are installed

### Claude Desktop Not Connecting
- Verify config path is absolute, not relative
- Check server is running (health endpoint)
- Restart Claude Desktop after config changes
- Check Claude Desktop logs for errors

### QR Code Not Displaying
- Ensure `dist/index.html` exists (run `npm run build`)
- Check browser console for errors
- Verify server can serve the HTML file

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

- **Documentation:** See [QUICKSTART.md](QUICKSTART.md) and [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues:** Report bugs or request features via GitHub issues
- **MCP Protocol:** https://modelcontextprotocol.io
