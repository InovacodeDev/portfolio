import "dotenv/config";
import Fastify from "fastify";

const server = Fastify({ logger: true });

server.get("/healthz", async (_request, _reply) => {
    return {
        status: "ok",
        database: process.env.DATABASE_URL ? "configured" : "not configured",
        timestamp: new Date().toISOString(),
    };
});

const start = async () => {
    try {
        const port = Number(process.env.API_PORT) || 3000;
        const host = process.env.API_HOST || "0.0.0.0";

        await server.listen({ port, host });
        server.log.info(`Server listening on ${host}:${port}`);

        // Log environment status
        server.log.info({
            environment: process.env.NODE_ENV || "development",
            database: process.env.DATABASE_URL ? "configured" : "not configured",
        });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
