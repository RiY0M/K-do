import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ResetPasswordRequestDto, ResetPasswordRequestDtoType } from '../../../dtos/ResetPasswordRequestDto';
import { MailService } from '../../../services/MailService';
import { PasswordResetService } from '../../../services/PasswordResetService';
import { PasswordResetServiceError } from '../../../errors/PasswordResetServiceError';

// Backs resetPassword() in frontend/src/services/api/auth.ts (ResetPassword page).
const resetPasswordRoute: FastifyPluginAsync = async (fastify) => {
    const passwordResetService = new PasswordResetService(fastify.prisma, new MailService(fastify.log));

    const schema: FastifySchema = {
        summary: 'Choose a new password with a reset link',
        tags: ['auth'],
        body: ResetPasswordRequestDto,
        response: {
            200: z.object({ success: z.boolean() }),
            400: z.object({ error: z.string() }),
            410: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Body: ResetPasswordRequestDtoType }>(
        '/resetPassword',
        { schema },
        async (request, reply) => {
            const { token, password } = request.body;

            try {
                await passwordResetService.resetPassword(token, password);
                reply.send({ success: true });
            } catch (err) {
                if (err instanceof PasswordResetServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default resetPasswordRoute;
