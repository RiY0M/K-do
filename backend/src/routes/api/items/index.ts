import type { FastifyPluginAsync } from 'fastify';
import createItemRoute from './create';
import updateItemRoute from './update';
import checkItemRoute from './check';
import deleteItemRoute from './delete';

const itemsRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(createItemRoute);
    await fastify.register(updateItemRoute);
    await fastify.register(checkItemRoute);
    await fastify.register(deleteItemRoute);
};

export default itemsRoutes;
