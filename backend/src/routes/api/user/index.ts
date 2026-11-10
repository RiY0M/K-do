import type { FastifyPluginAsync } from 'fastify';
import getUsernameRoute from './getUsername';
import meRoute from './me';

const userRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(getUsernameRoute);
    await fastify.register(meRoute);
};

export default userRoutes;
