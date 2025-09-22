const fs = require("fs");
const path = require("path");
const fastify = require("fastify");

const pnpmStore = path.join("node_modules", ".pnpm");
if (!fs.existsSync(pnpmStore)) {
    console.log("no pnpm store");
    process.exit(0);
}

const entries = fs.readdirSync(pnpmStore).filter((n) => n.startsWith("@fastify+"));
const names = entries.map((e) => e.split("@")[0].replace("+", "/"));

(async () => {
    for (const name of names) {
        try {
            let plug;
            try {
                plug = require(`@fastify/${name}`);
            } catch (e) {
                try {
                    plug = require(path.join(pluginsDir, name));
                } catch (e2) {
                    console.log(`@fastify/${name} SKIP (require failed)`);
                    continue;
                }
            }

            const app = fastify();
            try {
                await app.register(plug);
                await app.ready();
                await app.close();
                console.log(`@fastify/${name} OK`);
            } catch (err) {
                console.log(`@fastify/${name} ERROR`, err && err.message ? err.message : err);
            }
        } catch (err) {
            console.log(`@fastify/${name} UNEXPECTED`, err && err.message ? err.message : err);
        }
    }
})();
