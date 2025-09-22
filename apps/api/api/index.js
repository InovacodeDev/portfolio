const { NestFactory } = require("@nestjs/core");
const { FastifyAdapter } = require("@nestjs/platform-fastify");
const { AppModule } = require("../dist/app.module");

let app;

module.exports = async (req, res) => {
    if (!app) {
        app = await NestFactory.create(AppModule, new FastifyAdapter());

        app.enableCors({
            origin: (origin, callback) => {
                const allowedOrigins = ["https://inovacode.vercel.app", process.env.FRONTEND_URL].filter(Boolean);
                if (!origin) return callback(null, true);
                try {
                    const hostname = new URL(origin).hostname;
                    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0") {
                        return callback(null, true);
                    }
                } catch {
                    // ignore URL parsing errors
                }
                if (allowedOrigins.includes(origin)) callback(null, true);
                else callback(new Error("Not allowed by CORS"));
            },
            credentials: true,
        });

        await app.init();
    }

    const fastifyInstance = app.getHttpAdapter().getInstance();
    fastifyInstance.server.emit("request", req, res);
};
