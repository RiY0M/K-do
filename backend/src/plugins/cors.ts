import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';

/**
 * Origins allowed to call the API from a browser.
 *
 * - CORS_ORIGIN set: only those origins (comma-separated list, e.g.
 *   "https://kdo.example.fr,https://www.kdo.example.fr").
 * - Not set, in production: no other site is allowed. The frontend doesn't
 *   need CORS there, since nginx serves it on the same domain as the API
 *   (it forwards /api to the backend).
 * - Not set, in development: every origin (Vite runs on another port).
 */
export function allowedOrigins(): string[] | boolean {
    const origins = (process.env.CORS_ORIGIN ?? '')
        .split(',')
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter(Boolean);

    if (origins.length > 0) return origins;
    return process.env.NODE_ENV !== 'production';
}

const corsPlugin: FastifyPluginAsync = async (fastify) => {
    await fastify.register(cors, {
        origin: allowedOrigins(),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
};

export default fp(corsPlugin, { name: 'cors' });
