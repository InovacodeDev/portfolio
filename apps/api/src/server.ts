import "reflect-metadata";
import { config } from "dotenv";
import path from "path";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import Fastify from "fastify";

// Load environment variables from .env.local in project root
config({ path: path.resolve(__dirname, "../../../.env.local") });

// Build a Fastify instance preconfigured with plugins and compilers. This mirrors the
// previous `buildServer()` behavior but will be passed into Nest's FastifyAdapter.
export function createFastifyInstance() {
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
    });

    // Do minimal Fastify setup here. Avoid registering additional plugins at this
    // layer to prevent runtime plugin-version mismatches in the monorepo.
    return server;
}

// Bootstrap Nest on top of the prepared Fastify instance. Exported for non-serverless usage.
export async function buildNestServer(): Promise<NestFastifyApplication> {
    const fastifyInstance = createFastifyInstance();

    // Create Nest app using the prepared fastify instance. We'll configure CORS
    // via Nest's API to avoid registering @fastify/cors manually here.
    const app = await NestFactory.create<any>(AppModule, new FastifyAdapter(fastifyInstance as any));

    // Enable CORS through Nest (this avoids potential Fastify plugin compatibility issues)
    app.enableCors({
        origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            const allowedOrigins = ["https://inovacode.vercel.app", process.env.FRONTEND_URL].filter(Boolean);
            if (!origin) return callback(null, true);
            try {
                const hostname = new URL(origin).hostname;
                if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
                    return callback(null, true);
                }
            } finally {
                // ignore
            }
            if (allowedOrigins.includes(origin)) callback(null, true);
            else callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    });

    // Additional global setup can be added here (pipes, interceptors, CORS handled by Fastify plugin)

    return app;
}

// For backwards compatibility with the previous serverless wrapper (apps/api/api/index.js),
// we export a helper that returns a ready Fastify instance by bootstrapping Nest and
// returning its underlying server.
export async function buildServer(): Promise<any> {
    const app = await buildNestServer();
    await app.init();
    await (app.getHttpAdapter().getInstance() as any).ready();

    // Expose the underlying fastify instance for request forwarding
    const fastify = app.getHttpAdapter().getInstance() as any;
    return fastify;
}

// If not running in serverless mode, start the Nest server normally
if (!process.env.SERVERLESS) {
    (async () => {
        try {
            const app = await buildNestServer();
            const port = Number(process.env.API_PORT) || 3001;
            const host = process.env.API_HOST || "0.0.0.0";
            await app.listen(port, host);
            const url = await app.getUrl();
            // Use underlying fastify logger for consistency
            const fastifyInst = app.getHttpAdapter().getInstance() as any;
            if (fastifyInst && fastifyInst.log && typeof fastifyInst.log.info === "function") {
                fastifyInst.log.info(`Server listening on ${url}`);
            } else {
                console.log(`Server listening on ${url}`);
            }
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    })();

    process.on("SIGINT", async () => process.exit(0));
    process.on("SIGTERM", async () => process.exit(0));
}
