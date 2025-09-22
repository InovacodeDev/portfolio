import { buildServer } from "./server";
import type { IncomingMessage, ServerResponse } from "http";

// This file provides a Vercel Serverless Function handler
// that instantiates a fresh Fastify instance per invocation.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const server = await buildServer();

    // Adapt incoming request to Fastify by using its .ready() and routing
    // Fastify has an official adapter for Vercel but here we use a lightweight approach
    // by letting Fastify handle the raw Node request/response.
    await server.ready();

    // Since we're in the serverless environment, we need to call server.server.emit
    // to let Fastify handle the request using the underlying Node.js server.
    // @ts-ignore - underlying server type
    server.server.emit("request", req, res);

    // Ensure server is closed after handling to avoid resource leaks in some environments.
    // Fastify will reuse connections where possible; closing here helps Vercel cold starts.
    res.on("finish", async () => {
        await server.close().catch(() => {});
    });
}
