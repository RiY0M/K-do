import type { PrismaClient } from '@prisma/client';
import '@fastify/jwt';

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<FastifyReply | void>;
        // Signs a session token for this user (see plugins/jwt.ts)
        signToken: (userId: string, tokenVersion: number) => string;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { sub: string; ver?: number };
        user: { sub: string; ver?: number };
    }
}
