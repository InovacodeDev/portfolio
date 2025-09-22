const path = require("path");

console.log("[apps/web/api/v1/contact] module loaded");

// Resolve to the monorepo apps/api wrapper using an absolute path to avoid
// Vercel/ts-node resolution problems when functions are executed from
// different working directories.
const fastifyWrapperPath = path.resolve(__dirname, "..", "..", "..", "..", "apps", "api", "api", "index.js");
let handler;
try {
    handler = require(fastifyWrapperPath);
} catch (err) {
    console.error("[apps/web/api/v1/contact] failed to require fastify wrapper", err);
    module.exports = (req, res) => {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(JSON.stringify({ error: "fastify_wrapper_missing", details: String(err) }));
    };
    return;
}

module.exports = async (req, res) => {
    console.log("[apps/web/api/v1/contact] invoked", req.method, req.url);
    try {
        await handler(req, res);
    } catch (err) {
        console.error("[apps/web/api/v1/contact] handler error", err);
        if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify({ error: "handler_error", details: String(err) }));
        }
    }
};
