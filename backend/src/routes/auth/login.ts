import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import {
    LoginUserRequestDto,
    LoginUserRequestDtoType,
} from '../../dtos/LoginUserRequestDto';
import { AuthService } from '../../services/AuthService';
import { AuthServiceError } from '../../errors/AuthServiceError';

const loginRoute: FastifyPluginAsync = async (fastify) => {
    const authService = new AuthService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'User login',
        description: 'Authenticates a user and returns it with an access token.',
        tags: ['auth'],
        body: LoginUserRequestDto,
        response: {
            200: z.object({
                id: z.string().uuid(),
                name: z.string(),
                token: z.string(),
            }),
            400: z.object({
                error: z.string(),
                details: z.any().optional(),
            }),
            401: z.object({
                error: z.string(),
            }),
        },
    };

    fastify.post<{ Body: LoginUserRequestDtoType }>(
        '/login',
        { schema },
        async (request, reply) => {
            const { name, password } = request.body;

            try {
                const user = await authService.loginUser(name, password);
                const token = fastify.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

                reply.send({
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

export default loginRoute;
