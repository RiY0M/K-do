import type { PrismaClient } from '@prisma/client';
import '@fastify/jwt';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply | void>;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { sub: string };
        user: { sub: string };
    }
}
