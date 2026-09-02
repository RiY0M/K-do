import type { FastifyPluginAsync } from 'fastify';
import apiRoutes from './api/index';

const mainRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(apiRoutes, { prefix: '/api' });
};

export default mainRoutes;
