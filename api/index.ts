// Vercel serverless function entry point.
// Vercel auto-detects files in api/ and creates serverless functions from them.
// All requests are rewritten to this handler via vercel.json rewrites.
import app from "../main.js";

export default app;
