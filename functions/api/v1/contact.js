const path = require("path");
const fs = require("fs");

const compiled = path.resolve(__dirname, "../../../apps/api/dist/vercel.js");

if (fs.existsSync(compiled)) {
    // Use compiled serverless handler when available
    module.exports = require(compiled);
} else {
    // Fail fast with a clear message to avoid attempting ts-node in the runtime
    module.exports = function handler(req, res) {
        res.statusCode = 500;
        res.setHeader("content-type", "application/json");
        res.end(
            JSON.stringify({
                error: "compiled_handler_missing",
                message: "Compiled API handler not found. Run `pnpm --filter @inovacode/api build` in the repo root.",
            })
        );
    };
}
