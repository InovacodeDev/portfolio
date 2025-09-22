const path = require("path");
const fs = require("fs");

// Try to load compiled JS first (e.g. dist/server.js). If not present,
// fail fast with an instructive error instead of attempting to run
// the TypeScript source via ts-node/register. Running ts-node inside the
// Vercel dev runtime can trigger deep TypeScript/ts-node incompatibilities
// (observed as `state.conditions.includes is not a function`). Requiring
// developers to run `pnpm --filter @inovacode/api build` ensures the
// function executes compiled JS and avoids ts-node runtime issues.
let serverModule;
const compiledPath = path.join(__dirname, "..", "dist", "server.js");
try {
    if (fs.existsSync(compiledPath)) {
        serverModule = require(compiledPath);
        console.log("[apps/api/api/index] loaded compiled server from", compiledPath);
    } else {
        const msg =
            "Compiled server not found. Please run `pnpm --filter @inovacode/api build` before using the serverless wrapper in this environment.";
        console.error("[apps/api/api/index] ", msg, " (expected at", compiledPath, ")");
        // Export a handler that returns a clear 500 response so Vercel/dev doesn't
        // try to spin up ts-node and trigger TypeScript runtime resolution.
        module.exports = (req, res) => {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ error: "server_not_compiled", message: msg }));
        };
        return;
    }
} catch (err) {
    console.error("[apps/api/api/index] failed to load server module:", err);
    module.exports = (req, res) => {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "server_load_error", details: String(err) }));
    };
    return;
}

const { buildServer } = serverModule;

let fastifyInstance;

module.exports = async (req, res) => {
    console.log("[apps/api/api/index] invoked", req.method, req.url);
    try {
        // Reuse Fastify instance across warm invocations when possible
        if (!fastifyInstance) {
            fastifyInstance = await buildServer();
            // don't call listen() in serverless environment; we will forward req/res
            await fastifyInstance.ready();
        }

        // Let Fastify handle the raw Node request/response
        fastifyInstance.server.emit("request", req, res);

        // No need to force-close; allow reuse across warm invocations
    } catch (err) {
        console.error("[apps/api/api/index] handler error", err);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ error: "handler_error", details: String(err) }));
        }
    }
};
