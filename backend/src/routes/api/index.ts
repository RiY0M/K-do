import type { FastifyPluginAsync } from 'fastify';
import pingRoute from './ping';
import authRoutes from './auth';
import kdoRoutes from './kdo';
import listRoutes from './list';
import userRoutes from './user';

const apiRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(pingRoute);
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(kdoRoutes, { prefix: '/kdo' });
    await fastify.register(listRoutes, { prefix: '/list' });
    await fastify.register(userRoutes, { prefix: '/user' });
};

export default apiRoutes;
