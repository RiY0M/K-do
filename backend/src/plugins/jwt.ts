import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    await fastify.register(fastifyJwt, { secret });

    fastify.decorate(
        'authenticate',
        async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                await request.jwtVerify();
            } catch {
                // Returning the reply stops the request here: without it the
                // route handler still ran with no `request.user`.
                return reply.code(401).send({ error: 'Unauthorized' });
            }
        }
    );
};

export default fp(jwtPlugin, { name: 'jwt' });
