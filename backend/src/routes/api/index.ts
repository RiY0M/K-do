import type { FastifyPluginAsync } from 'fastify';
import pingRoute from './ping';
import testRoute from './test';
import groupsRoutes from './groups';
import listsRoutes from './lists';
import itemsRoutes from './items/index';

const apiRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(pingRoute);
    await fastify.register(testRoute);
    await fastify.register(groupsRoutes, { prefix: '/groups' });
    await fastify.register(listsRoutes, { prefix: '/lists' });
    await fastify.register(itemsRoutes, { prefix: '/items' });
};

export default apiRoutes;
