import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import {
    RegisterUserRequestDto,
    RegisterUserRequestDtoType,
} from '../../dtos/RegisterUserRequestDto';
import { AuthService } from '../../services/AuthService';
import { AuthServiceError } from '../../errors/AuthServiceError';

const registerRoute: FastifyPluginAsync = async (fastify) => {
    const authService = new AuthService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Register a new user',
        description: 'Creates a new user account and returns it with an access token.',
        tags: ['auth'],
        body: RegisterUserRequestDto,
        response: {
            201: z.object({
                id: z.string().uuid(),
                name: z.string(),
                token: z.string(),
            }),
            400: z.object({
                error: z.string(),
                details: z.any().optional(),
            }),
            409: z.object({
                error: z.string(),
            }),
        },
    };

    fastify.post<{ Body: RegisterUserRequestDtoType }>(
        '/register',
        { schema },
        async (request, reply) => {
            const { name, email, password } = request.body;

            try {
                const user = await authService.registerUser(name, password, email);
                const token = fastify.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

                reply.code(201).send({
                    id: user.id,
                    name: user.username,
                    token,
                });
            } catch (err) {
                if (err instanceof AuthServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default registerRoute;
