import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';

const corsPlugin: FastifyPluginAsync = async (fastify) => {
    await fastify.register(cors, {
        origin: '*',
    });
};

export default fp(corsPlugin, { name: 'cors' });
