const path = require("path");
const fs = require("fs");

const compiled = path.resolve(__dirname, "../../apps/api/dist/vercel.js");

if (fs.existsSync(compiled)) {
    module.exports = require(compiled);
} else {
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
