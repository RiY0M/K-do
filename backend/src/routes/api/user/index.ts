import type { FastifyPluginAsync } from 'fastify';
import getUsernameRoute from './getUsername';

const userRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(getUsernameRoute);
};

export default userRoutes;
