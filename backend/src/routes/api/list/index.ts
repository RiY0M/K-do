import type { FastifyPluginAsync } from 'fastify';
import meRoute from './me';
import friendRoute from './friend';
import updateDescriptionRoute from './updateDescription';
import listsRoute from './lists';

const listRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(meRoute);
    await fastify.register(friendRoute);
    await fastify.register(updateDescriptionRoute);
    await fastify.register(listsRoute);
};

export default listRoutes;
