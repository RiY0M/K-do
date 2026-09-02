import type { FastifyPluginAsync } from 'fastify';
import getUsernameRoute from './getUsername';
import acceptInviteRoute from './acceptInvite';

const userRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(getUsernameRoute);
    await fastify.register(acceptInviteRoute);
};

export default userRoutes;
