import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ForgotPasswordRequestDto, ForgotPasswordRequestDtoType } from '../../../dtos/ForgotPasswordRequestDto';
import { MailService } from '../../../services/MailService';
import { PasswordResetService } from '../../../services/PasswordResetService';
import { PasswordResetServiceError } from '../../../errors/PasswordResetServiceError';

// Backs forgotPassword() in frontend/src/services/api/auth.ts.
const forgotPasswordRoute: FastifyPluginAsync = async (fastify) => {
    const passwordResetService = new PasswordResetService(fastify.prisma, new MailService(fastify.log));

    const schema: FastifySchema = {
        summary: 'Send a password reset e-mail',
        description:
            'Sends a reset link to the e-mail address of the account matching this username or e-mail. Not possible for accounts registered without an e-mail address (400). Returns the masked address.',
        tags: ['auth'],
        body: ForgotPasswordRequestDto,
        response: {
            200: z.object({ email: z.string() }),
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
            429: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Body: ForgotPasswordRequestDtoType }>(
        '/forgotPassword',
        { schema },
        async (request, reply) => {
            const { identifier } = request.body;

            try {
                const email = await passwordResetService.requestReset(identifier);
                reply.send({ email });
            } catch (err) {
                if (err instanceof PasswordResetServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default forgotPasswordRoute;
