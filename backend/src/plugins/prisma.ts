import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
    // Prisma 7 talks to PostgreSQL through the `pg` driver. Its pool has no
    // connection timeout by default (Prisma 6 used 5 s): keep the same limit
    // so a missing database fails fast instead of hanging.
    const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5_000,
    });
    const prisma = new PrismaClient({ adapter });
    await prisma.$connect();

    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async (instance) => {
        await instance.prisma.$disconnect();
    });
};

export default fp(prismaPlugin, { name: 'prisma' });
