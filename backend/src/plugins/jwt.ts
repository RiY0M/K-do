import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';

// How long a session lasts without any activity. Every authenticated request
// sends back a new token valid this long from now (see `authenticate`), so an
// active user stays logged in.
export const TOKEN_LIFETIME = '30d';

// Response header carrying that new token. Must be listed in the CORS
// `exposedHeaders` (see cors.ts) for the frontend to read it in development.
export const REFRESHED_TOKEN_HEADER = 'x-refreshed-token';

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    await fastify.register(fastifyJwt, { secret });

    // `tokenVersion` is the user's current User.tokenVersion: tokens signed
    // with an older one are refused (see below)
    fastify.decorate('signToken', (userId: string, tokenVersion: number) =>
        fastify.jwt.sign({ sub: userId, ver: tokenVersion }, { expiresIn: TOKEN_LIFETIME })
    );

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

            // Since tokens are now renewed for as long as the user is active,
            // a valid signature isn't enough anymore: a deleted account would
            // otherwise stay logged in forever.
            const user = await fastify.prisma.user.findUnique({
                where: { id: request.user.sub },
                select: { deletedAt: true, tokenVersion: true },
            });

            // Tokens from before tokenVersion existed have no `ver`: they
            // count as version 0, so nobody got logged out by the update
            if (!user || user.deletedAt || (request.user.ver ?? 0) !== user.tokenVersion) {
                return reply.code(401).send({ error: 'Unauthorized' });
            }

            reply.header(REFRESHED_TOKEN_HEADER, fastify.signToken(request.user.sub, user.tokenVersion));
        }
    );
};

export default fp(jwtPlugin, { name: 'jwt' });
