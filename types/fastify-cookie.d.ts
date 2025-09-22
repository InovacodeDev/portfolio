declare module "@fastify/cookie" {
    const fp: any;
    export default fp;
}

declare module "fastify" {
    interface FastifyRequest {
        cookies: Record<string, string>;
    }

    interface FastifyReply {
        setCookie(name: string, value: string, options?: any): void;
    }
}
