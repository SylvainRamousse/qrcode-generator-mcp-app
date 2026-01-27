# QR Code Generator MCP App - Project Summary

## What Was Built

A complete MCP (Model Context Protocol) App that generates QR codes with:
- ✅ Interactive React-based UI
- ✅ 7 different QR code types (URL, text, email, phone, SMS, WiFi, vCard)
- ✅ Download as SVG or PNG
- ✅ Theme integration (light/dark mode)
- ✅ **Remote deployment support (Vercel)**
- ✅ Local development support

## Deployment Options

### ☁️ Option 1: Remote Server (Vercel) - RECOMMENDED

**Benefits:**
- Works from anywhere (no local server needed)
- Free hosting
- Automatic HTTPS
- Auto-deploy from GitHub
- Share with team members

**Setup:**
1. Push to GitHub
2. Deploy to Vercel
3. Configure Claude Desktop with URL
4. Done!

See: [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md)

### 💻 Option 2: Local Server

**Benefits:**
- Full control
- No external dependencies
- Works offline

**Setup:**
1. Run `npm install && npm run build`
2. Configure Claude Desktop with local path
3. Done!

See: [README.md](README.md)

## Project Structure

```
qrcode-generator-mcp-app/
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite build configuration
│   ├── vercel.json               # Vercel deployment config
│   └── .gitignore                # Git ignore rules
│
├── 🖥️  Server Files
│   ├── main.ts                   # Entry point (HTTP/stdio/Vercel)
│   ├── server.ts                 # MCP server with tool registration
│   └── api/
│       └── index.ts             # Vercel serverless function entry point
│
├── 🎨 UI Files
│   ├── index.html                # HTML entry point
│   └── src/
│       ├── mcp-app.tsx          # React UI component
│       └── styles.css           # Themed styling
│
├── 📚 Documentation
│   ├── README.md                # Main documentation
│   ├── QUICKSTART.md            # Quick start guide
│   ├── DEPLOYMENT.md            # Full deployment guide
│   ├── DEPLOY_TO_VERCEL.md      # Quick Vercel guide
│   └── SUMMARY.md               # This file
│
├── 🔧 Setup & Examples
│   ├── setup.sh                 # Automated setup script
│   └── claude_desktop_config.example.json
│
└── 📦 Build Output (generated)
    └── dist/
        ├── index.html           # Built UI (single-file)
        ├── main.js              # Compiled server entry
        └── server.js            # Compiled server logic
```

## Key Features Added for Remote Deployment

### 1. HTTP Server Support (`main.ts`)
- Streamable HTTP transport for remote access
- Health check endpoint (`/health`)
- Server info endpoint (`/`)
- MCP endpoint (`/mcp`)
- CORS enabled for cross-origin requests

### 2. Dual Mode Operation
- **HTTP mode** (default): `npm run dev`
- **Stdio mode**: `npm run dev:stdio --stdio`

### 3. Vercel Configuration
- `api/index.ts` entry point for Vercel's serverless function auto-detection
- `vercel.json` rewrites all routes to the `/api` function
- `includeFiles` ensures `dist/index.html` is bundled with the function
- Express app is exported as default (not `listen()`) for serverless compatibility
- **Output Directory must NOT be set** in Vercel dashboard (causes static-site mode)

### 4. Updated Scripts

```json
{
  "dev": "tsx main.ts",              // Run HTTP server
  "dev:stdio": "tsx main.ts --stdio", // Run stdio server
  "build": "vite build && tsc",      // Build UI + compile TS
  "start": "node dist/main.js",      // Run production server
  "vercel-build": "npm run build"    // Vercel build command
}
```

## Dependencies Added

### Production
- `cors` - Enable cross-origin requests
- `express` - HTTP server framework

### Development
- `@types/cors` - TypeScript types for CORS
- `@types/express` - TypeScript types for Express

## How It Works

### Local Mode (stdio)
```
Claude Desktop → stdio → main.ts (--stdio) → server.ts → Tool execution → React UI
```

### Remote Mode (HTTP)
```
Claude Desktop → HTTPS → Vercel → main.ts → server.ts → Tool execution → React UI
```

## Configuration Examples

### Remote Server
```json
{
  "mcpServers": {
    "qrcode-generator": {
      "url": "https://your-app.vercel.app/mcp"
    }
  }
}
```

### Local Server
```json
{
  "mcpServers": {
    "qrcode-generator": {
      "command": "npx",
      "args": ["tsx", "/path/to/main.ts", "--stdio"]
    }
  }
}
```

## Testing

### Test HTTP Server
```bash
# Start server
npm run dev

# Check health
curl http://localhost:3001/health
# Response: {"status":"healthy"}

# Check server info
curl http://localhost:3001/
# Response: { name, version, status, endpoints }
```

### Test Stdio Server
```bash
# Start server
npm run dev:stdio

# Configure in Claude Desktop and test
```

## Deployment Workflow

### GitHub → Vercel (Automatic)

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update QR code generator"
   git push
   ```

2. **Vercel automatically:**
   - Detects the push
   - Runs `npm run vercel-build`
   - Deploys to production
   - Updates URL

3. **No downtime!**

## Usage Examples

Once deployed (remote or local), ask Claude:

```
Generate a QR code for https://github.com
```

```
Create a WiFi QR code for network "HomeWiFi"
with password "SecurePass123" using WPA security
```

```
Make a vCard QR code for:
- Name: John Doe
- Email: john@example.com
- Phone: +1-555-0123
```

The interactive UI will appear with:
- Visual QR code preview
- Download as PNG/SVG buttons
- Content information
- Responsive design

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Protocol | MCP SDK | Model Context Protocol |
| Server | Express + MCP | HTTP/stdio server |
| Transport | Streamable HTTP / stdio | Remote or local |
| UI Framework | React | Interactive interface |
| Build Tool | Vite | Fast bundling |
| Styling | CSS + Host Variables | Theme integration |
| Deployment | Vercel | Serverless hosting |
| Language | TypeScript | Type safety |

## Environment Variables (Vercel)

Optional configuration in Vercel dashboard:

```env
PORT=3001              # Server port (default: 3001)
NODE_ENV=production    # Environment
```

## Monitoring & Logs

### Vercel Dashboard
- Deployment history
- Function logs
- Performance metrics
- Error tracking

### Local Development
- Console output
- Network requests
- Browser DevTools

## Security

- ✅ HTTPS enabled (Vercel)
- ✅ CORS configured
- ✅ No authentication needed (MCP handles this)
- ✅ No data storage (stateless)
- ✅ No external API calls

## Cost

**Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function executions
- ✅ Free SSL certificates

**More than enough for personal/small team use!**

## Next Steps

### For Users
1. Deploy to Vercel (5 minutes)
2. Configure Claude Desktop (1 minute)
3. Start generating QR codes!

### For Developers
1. Fork the repository
2. Customize QR code types
3. Add new features
4. Submit pull requests

## Support & Resources

- **Quick Deploy:** [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md)
- **Full Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Local Setup:** [README.md](README.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)

## License

MIT - Free to use, modify, and distribute

## Credits

Built with:
- MCP Apps SDK by Anthropic
- React by Meta
- Vite by Evan You
- Express by TJ Holowaychuk

---

**Ready to deploy?** See [DEPLOY_TO_VERCEL.md](DEPLOY_TO_VERCEL.md) for step-by-step instructions!
