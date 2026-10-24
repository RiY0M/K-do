import type { FastifyPluginAsync } from 'fastify';
import friendsRoute from './friends';
import requestsRoute from './requests';
import sendRequestRoute from './sendRequest';
import acceptRequestRoute from './acceptRequest';
import deleteRequestRoute from './deleteRequest';
import removeRoute from './remove';

const friendRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(friendsRoute);
    await fastify.register(requestsRoute);
    await fastify.register(sendRequestRoute);
    await fastify.register(acceptRequestRoute);
    await fastify.register(deleteRequestRoute);
    await fastify.register(removeRoute);
};

export default friendRoutes;
