import "reflect-metadata";
import { config } from "dotenv";
import path from "path";
import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

// Load environment variables from .env.local in project root
config({ path: path.resolve(__dirname, "../../../.env.local") });

async function bootstrap() {
    // Create Nest app with Fastify adapter
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
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
        })
    );

    // Enable CORS
    app.enableCors({
        origin: true,
        credentials: true,
    });

    // Set global prefix for API routes
    app.setGlobalPrefix("");

    const port = Number(process.env.API_PORT) || 3001;
    const host = process.env.API_HOST || "0.0.0.0";

    await app.listen(port, host);
    
    const url = await app.getUrl();
    console.log(`🚀 Application is running on: ${url}`);
}

// Handle shutdown gracefully
process.on("SIGINT", async () => {
    console.log("Received SIGINT, shutting down gracefully...");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Received SIGTERM, shutting down gracefully...");
    process.exit(0);
});

bootstrap().catch((error) => {
    console.error("Error starting application:", error);
    process.exit(1);
});