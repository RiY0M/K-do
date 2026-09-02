import type { FastifyPluginAsync } from 'fastify';
import createMyRoute from './createMy';
import createFriendRoute from './createFriend';
import checkMyRoute from './checkMy';
import checkFriendRoute from './checkFriend';
import updateLabelRoute from './updateLabel';
import deleteRoute from './delete';

const kdoRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(createMyRoute);
    await fastify.register(createFriendRoute);
    await fastify.register(checkMyRoute);
    await fastify.register(checkFriendRoute);
    await fastify.register(updateLabelRoute);
    await fastify.register(deleteRoute);
};

export default kdoRoutes;
