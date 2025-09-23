const { createApp } = require('../dist/main');const { createApp } = require('../dist/main');import { createApp } from '../src/main';const { NestFactory } = require("@nestjs/core");



let cachedApp = null;



module.exports = async function handler(req, res) {let cachedApp = null;

  try {

    if (!cachedApp) {

      cachedApp = await createApp();

    }module.exports = async function handler(req, res) {let cachedApp: any = null;let cachedApp = null;



    const fastifyApp = cachedApp.getHttpAdapter().getInstance();  try {

    

    await fastifyApp.ready();    if (!cachedApp) {

    fastifyApp.server.emit('request', req, res);

  } catch (error) {      cachedApp = await createApp();

    console.error('Serverless function error:', error);

    res.status(500).json({     }export default async function handler(req: any, res: any) {async function createApp() {

      error: 'Internal Server Error',

      message: 'Something went wrong' 

    });

  }    // Convert Vercel request to Fastify format  try {    if (cachedApp) {

};
    const fastifyApp = cachedApp.getHttpAdapter().getInstance();

        if (!cachedApp) {        return cachedApp;

    await fastifyApp.ready();

    fastifyApp.server.emit('request', req, res);      cachedApp = await createApp();    }

  } catch (error) {

    console.error('Serverless function error:', error);    }

    res.status(500).json({ 

      error: 'Internal Server Error',    try {

      message: 'Something went wrong' 

    });    // Convert Vercel request to Fastify format        const { AppModule } = require("../dist/app.module");

  }

};    const fastifyApp = cachedApp.getHttpAdapter().getInstance();

            const app = await NestFactory.create(AppModule);

    await fastifyApp.ready();

    fastifyApp.server.emit('request', req, res);        app.enableCors({

  } catch (error) {            origin: true,

    console.error('Serverless function error:', error);            credentials: true,

    res.status(500).json({         });

      error: 'Internal Server Error',

      message: 'Something went wrong'         app.setGlobalPrefix("");

    });

  }        await app.init();

}
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
