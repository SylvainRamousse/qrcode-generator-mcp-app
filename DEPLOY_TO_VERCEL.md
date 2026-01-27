# 🚀 Deploy to Vercel - Quick Guide

This is a simplified guide to get your QR Code Generator MCP App deployed to Vercel in minutes.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com - free!)
- Git installed

## Step 1: Push to GitHub (5 minutes)

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: QR Code Generator MCP App"

# Create a new repo on GitHub at https://github.com/new
# Then run these commands (replace YOUR-USERNAME with your GitHub username):

git remote add origin https://github.com/YOUR-USERNAME/qrcode-generator-mcp-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel (2 minutes)

1. **Go to https://vercel.com and log in**

2. **Click "Add New..." → "Project"**

3. **Import your repository:**
   - Click "Import Git Repository"
   - Select `qrcode-generator-mcp-app`
   - Click "Import"

4. **Configure (use these exact settings):**
   - **Framework Preset:** Other
   - **Build Command:** `npm run vercel-build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Click "Deploy"**

6. **Wait ~2 minutes** for the build to complete

## Step 3: Get Your URL

After deployment completes, you'll see your app URL:
```
https://qrcode-generator-mcp-app-YOUR-ID.vercel.app
```

Test it works:
```bash
curl https://your-app-url.vercel.app/health
```

Should return: `{"status":"healthy"}`

## Step 4: Configure Claude Desktop (1 minute)

Edit your Claude config file:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add this (replace with YOUR actual Vercel URL):

```json
{
  "mcpServers": {
    "qrcode-generator": {
      "url": "https://your-actual-app.vercel.app/mcp"
    }
  }
}
```

**IMPORTANT:** Don't forget `/mcp` at the end!

## Step 5: Restart Claude Desktop

Close and reopen Claude Desktop.

## Step 6: Test It!

Ask Claude:
```
Generate a QR code for https://github.com
```

You should see an interactive QR code UI! 🎉

## Automatic Updates

Every time you push to GitHub, Vercel will automatically redeploy:

```bash
# Make changes to your code
git add .
git commit -m "Updated QR code styling"
git push

# Vercel automatically deploys the new version!
```

## Troubleshooting

### Build Failed on Vercel

Check the build logs in Vercel dashboard. Common fixes:
- Run `npm run build` locally first to test
- Make sure all files are committed to git
- Check Node version (Vercel uses Node 18+)

### Claude Can't Connect

1. **Verify URL includes `/mcp`:**
   ```
   ❌ https://your-app.vercel.app
   ✅ https://your-app.vercel.app/mcp
   ```

2. **Test the endpoint:**
   ```bash
   curl https://your-app.vercel.app/health
   ```

3. **Restart Claude Desktop** after config changes

4. **Check Vercel deployment status** is "Ready"

### Still Not Working?

- Check Vercel function logs (Vercel Dashboard → Your Project → Functions)
- Make sure you saved the Claude config file
- Try a different browser/restart your computer
- See full troubleshooting in [DEPLOYMENT.md](DEPLOYMENT.md)

## What You Get

✅ Free hosting on Vercel
✅ Automatic HTTPS
✅ Auto-deploy on git push
✅ Works from anywhere
✅ No local server needed
✅ Share with team members

## Next Steps

- Add a custom domain in Vercel settings
- Invite team members (just share the URL)
- Check usage stats in Vercel dashboard
- Keep pushing updates to auto-deploy

## Need Help?

- Full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Issues: Create a GitHub issue
- Vercel docs: https://vercel.com/docs

That's it! You now have a production MCP server running in the cloud. 🚀
