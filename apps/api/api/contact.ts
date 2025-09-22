import type { IncomingMessage, ServerResponse } from "http";
import { buildServer } from "../src/server";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
    const server = await buildServer();
    await server.ready();

    // Let Fastify handle the raw Node request/response
    // @ts-ignore
    server.server.emit("request", req, res);

    res.on("finish", async () => {
        await server.close().catch(() => {});
    });
}
