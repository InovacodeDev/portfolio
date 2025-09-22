import { config } from "dotenv";
import path from "path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { contactRoutes } from "./routes/contact";

// Load environment variables from .env.local in project root
config({ path: path.resolve(__dirname, "../../../.env.local") });

// Factory that creates a Fastify instance with proper typing and logging.
// Exported so server can be used in serverless environments (Vercel) without calling listen().
export function buildServer() {
    const server = Fastify({
        logger: {
            level: "info",
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "HH:MM:ss Z",
                    ignore: "pid,hostname",
                },
            },
        },
    }).withTypeProvider<ZodTypeProvider>();

    // Set up Zod validation
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    // Register CORS plugin
    server.register(cors, {
        origin: (origin, callback) => {
            const hostname = new URL(origin || "http://localhost").hostname;

            // Allow localhost and development origins
            if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
                callback(null, true);
                return;
            }

            // Allow production origins (when deployed)
            const allowedOrigins = [
                "https://inovacode.vercel.app", // Production frontend
                process.env.FRONTEND_URL, // Environment-specific frontend URL
            ].filter(Boolean);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"), false);
        },
        credentials: true,
    });

    // Register cookie plugin for session and rate-limiting support
    server.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET || "dev-secret", // for signed cookies if desired
        parseOptions: {},
    });

    // Health check endpoint with proper response schema
    server.get(
        "/healthz",
        {
            schema: {
                response: {
                    200: z.object({
                        status: z.string(),
                        database: z.string(),
                        timestamp: z.string(),
                        version: z.string(),
                    }),
                },
            },
        },
        async (_request, _reply) => {
            return {
                status: "ok",
                database: process.env.DATABASE_URL ? "configured" : "not configured",
                timestamp: new Date().toISOString(),
                version: "1.0.0",
            };
        }
    );
    // API routes will be added here
    server.register(contactRoutes, { prefix: "/api/v1" });

    return server;
}

// If not running in serverless mode, start the server as before.
if (!process.env.SERVERLESS) {
    (async () => {
        try {
            const server = buildServer();
            const port = Number(process.env.API_PORT) || 3001;
            const host = process.env.API_HOST || "0.0.0.0";

            await server.listen({ port, host });
            server.log.info(`Server listening on ${host}:${port}`);

            // Log environment status
            server.log.info({
                environment: process.env.NODE_ENV || "development",
                database: process.env.DATABASE_URL ? "configured" : "not configured",
            });
        } catch (err) {
            // If server fails to start, log and exit
            // Note: in serverless deployments we avoid starting a listener
            // and instead export a handler (see vercel.ts)
            // so process will not exit in that environment.
            console.error(err);
            process.exit(1);
        }
    })();

    // Graceful shutdown handlers for non-serverless usage
    process.on("SIGINT", async () => {
        // best-effort: nothing to do here because server was created in closure
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        process.exit(0);
    });
}
