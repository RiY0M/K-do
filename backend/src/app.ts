import type { FastifyPluginAsync } from 'fastify';
import corsPlugin from './plugins/cors';
import jwtPlugin from './plugins/jwt';
import prismaPlugin from './plugins/prisma';
import mainRoutes from './routes';

export const options = {};

// Plugins are registered explicitly (like the routes) instead of through
// @fastify/autoload: autoload looked for a `plugins` folder next to the
// running file, which doesn't exist once the app is bundled into
// dist/server.js for production, so the server started without prisma/jwt.
const app: FastifyPluginAsync = async (fastify, opts) => {
    await fastify.register(corsPlugin, opts);
    await fastify.register(jwtPlugin, opts);
    await fastify.register(prismaPlugin, opts);

    await fastify.register(mainRoutes, opts);
};

export default app;
