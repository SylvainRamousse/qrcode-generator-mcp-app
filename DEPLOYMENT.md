# Deployment Guide - Vercel

This guide will help you deploy the QR Code Generator MCP App to Vercel, making it accessible as a remote server.

## Why Deploy to Vercel?

Deploying to Vercel allows you to:
- ✅ Use the MCP app from anywhere (no local server needed)
- ✅ Share the server URL with team members
- ✅ Automatic deployments from GitHub
- ✅ Free hosting for personal projects
- ✅ HTTPS enabled by default

## Prerequisites

1. A [GitHub](https://github.com) account
2. A [Vercel](https://vercel.com) account (free tier is fine)
3. Git installed on your machine

## Step 1: Push to GitHub

1. **Initialize Git repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: QR Code Generator MCP App"
   ```

2. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it `qrcode-generator-mcp-app` (or any name you prefer)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/qrcode-generator-mcp-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to [Vercel](https://vercel.com) and sign in**

2. **Click "Add New Project"**

3. **Import your GitHub repository:**
   - Select "Import Git Repository"
   - Choose `qrcode-generator-mcp-app`
   - Click "Import"

4. **Configure the project:**
   - **Framework Preset:** Other
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Click "Deploy"**

6. **Wait for deployment to complete** (usually 1-2 minutes)

7. **Your MCP server is now live!** 🎉
   - You'll get a URL like: `https://qrcode-generator-mcp-app.vercel.app`

### Option B: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project? No
   - Project name: (press enter to accept default)
   - Directory: (press enter for current directory)
   - Build settings detected? Yes

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Claude Desktop

Now that your server is deployed, configure Claude Desktop to use the remote server:

1. **Open your Claude Desktop config:**
   - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add the remote server configuration:**
   ```json
   {
     "mcpServers": {
       "qrcode-generator": {
         "url": "https://YOUR-APP-NAME.vercel.app/mcp"
       }
     }
   }
   ```

   Replace `YOUR-APP-NAME` with your actual Vercel URL.

3. **Save and restart Claude Desktop**

## Step 4: Verify Deployment

1. **Test the health endpoint:**
   ```bash
   curl https://YOUR-APP-NAME.vercel.app/health
   ```

   You should see:
   ```json
   {"status": "healthy"}
   ```

2. **Test in Claude Desktop:**
   - Open Claude Desktop
   - Try: "Generate a QR code for https://github.com"
   - The interactive UI should appear!

## Automatic Deployments

Once connected to GitHub, Vercel will automatically deploy:
- **Production:** Every push to the `main` branch
- **Preview:** Every pull request

## Environment Variables

If you need to add environment variables:

1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add your variables
4. Redeploy the project

## Monitoring

### View Logs

1. Go to your project in Vercel Dashboard
2. Click on a deployment
3. View "Functions" tab for logs

### Check Status

Visit your deployment URL root:
```
https://YOUR-APP-NAME.vercel.app/
```

You'll see server status and available endpoints.

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update Claude Desktop config with new domain

## Troubleshooting

### Deployment Failed

**Check build logs:**
- Go to Vercel Dashboard → Deployments
- Click on failed deployment
- Review build logs

**Common issues:**
- Missing dependencies: Make sure `package.json` is up to date
- Build errors: Run `npm run build` locally first
- Node version: Vercel uses Node 18+ by default

### Server Not Responding

**Check function logs:**
- Vercel Dashboard → Functions → View logs

**Test endpoints:**
```bash
# Health check
curl https://YOUR-APP-NAME.vercel.app/health

# Server info
curl https://YOUR-APP-NAME.vercel.app/
```

### Claude Desktop Can't Connect

1. **Verify URL is correct** in config (must include `/mcp`)
2. **Check CORS settings** (already configured in `main.ts`)
3. **Restart Claude Desktop** after config changes
4. **Check Vercel deployment status** is successful

## Local Development with Remote Server

You can still run locally while using the Vercel deployment:

```bash
# Run local HTTP server
npm run dev

# Run local stdio server (for Claude Desktop)
npm run dev:stdio
```

## Costs

**Vercel Free Tier includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Serverless function executions

This is more than enough for personal use!

## Next Steps

- ✨ Share your server URL with team members
- 🔧 Add custom domains
- 📊 Monitor usage in Vercel Dashboard
- 🚀 Keep deploying updates automatically from GitHub

## Rollback

If a deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find a previous working deployment
3. Click "..." menu → "Promote to Production"

## Support

- **Vercel Docs:** https://vercel.com/docs
- **MCP Docs:** https://modelcontextprotocol.io
- **Issues:** Create an issue in your GitHub repo
