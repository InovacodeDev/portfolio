const { NestFactory } = require("@nestjs/core");

let cachedApp = null;

async function createApp() {
    if (cachedApp) {
        return cachedApp;
    }

    try {
        const { AppModule } = require("../dist/app.module");

        const app = await NestFactory.create(AppModule);

        app.enableCors({
            origin: true,
            credentials: true,
        });

        app.setGlobalPrefix("");

        await app.init();

        cachedApp = app;
        return app;
    } catch (error) {
        console.error("Failed to create Nest app:", error);
        throw error;
    }
}

module.exports = async (req, res) => {
    try {
        console.log(`API request: ${req.method} ${req.url}`);

        const app = await createApp();
        const httpAdapter = app.getHttpAdapter();
        const expressApp = httpAdapter.getInstance();

        expressApp(req, res);
    } catch (error) {
        console.error("API handler error:", error);

        if (!res.headersSent) {
            res.status(500).json({
                error: "Internal Server Error",
                message: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    }
};
