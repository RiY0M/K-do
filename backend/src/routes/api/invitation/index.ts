import type { FastifyPluginAsync } from 'fastify';
import createRoute from './create';
import getRoute from './get';
import acceptRoute from './accept';

const invitationRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(createRoute);
    await fastify.register(getRoute);
    await fastify.register(acceptRoute);
};

export default invitationRoutes;
