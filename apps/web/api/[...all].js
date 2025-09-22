const path = require("path");

console.log("[apps/web/api/[...all]] invoked - proxy to monorepo Fastify wrapper");

// Resolve to the monorepo apps/api wrapper from this file's location by
// climbing up to the repository root and into apps/api/api/index.js. Using
// an explicit resolved path avoids accidental relative path mistakes when
// Vercel runs functions from different working directories.
const fastifyWrapperPath = path.resolve(__dirname, "..", "..", "..", "..", "apps", "api", "api", "index.js");
let handler;
try {
    handler = require(fastifyWrapperPath);
} catch (err) {
    console.error("[apps/web/api/[...all]] failed to require fastify wrapper", err);
    module.exports = (req, res) => {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "fastify_wrapper_missing", details: String(err) }));
    };
    return;
}

module.exports = async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        console.error("[apps/web/api/[...all]] handler error", err);
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "handler_error", details: String(err) }));
    }
};
