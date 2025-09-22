const { buildServer } = require("../src/server");

let fastifyInstance;

module.exports = async (req, res) => {
    // Reuse Fastify instance across warm invocations when possible
    if (!fastifyInstance) {
        fastifyInstance = await buildServer();
        // don't call listen() in serverless environment; we will forward req/res
        await fastifyInstance.ready();
    }

    // Let Fastify handle the raw Node request/response
    // fastifyInstance.server is the underlying Node server/handler
    fastifyInstance.server.emit("request", req, res);

    // Close the server after response finishes to avoid resource locks in some environments
    res.on("finish", async () => {
        try {
            // do not fully close the instance here to allow reuse in warm invocations
            // but perform a no-op or health check if needed
        } catch {
            // ignore
        }
    });
};
