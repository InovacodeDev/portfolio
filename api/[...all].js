const path = require("path");
const fs = require("fs");

// Repo-level Vercel function. Prefer the compiled Vercel handler (produced
// by `pnpm --filter @inovacode/api build`) to avoid invoking ts-node or the
// Vercel builder's TypeScript path during local `vercel dev` runs. If the
// compiled handler is missing, fall back to the monorepo wrapper.

const compiledVercelHandler = path.join(__dirname, "..", "apps", "api", "dist", "vercel.js");
const wrapperFallback = path.join(__dirname, "..", "apps", "api", "api", "index.js");

let handler;
try {
    if (fs.existsSync(compiledVercelHandler)) {
        // The compiled vercel handler exports a default function
        const mod = require(compiledVercelHandler);
        handler = mod && mod.default ? mod.default : mod;
        console.log("[api/[...all]] using compiled handler:", compiledVercelHandler);
    } else {
        handler = require(wrapperFallback);
        console.log("[api/[...all]] using wrapper fallback:", wrapperFallback);
    }
} catch (err) {
    module.exports = (req, res) => {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "Fastify handler not found", details: String(err) }));
    };
    return;
}

module.exports = async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "Handler error", details: String(err) }));
    }
};
