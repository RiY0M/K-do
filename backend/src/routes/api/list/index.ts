import type { FastifyPluginAsync } from 'fastify';
import meRoute from './me';
import friendRoute from './friend';
import updateDescriptionRoute from './updateDescription';
import listsRoute from './lists';
import createListRoute from './create';

const listRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(meRoute);
    await fastify.register(friendRoute);
    await fastify.register(updateDescriptionRoute);
    await fastify.register(listsRoute);
    await fastify.register(createListRoute);
};

export default listRoutes;
