import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { RevertAccountChangeRequestDto, RevertAccountChangeRequestDtoType } from '../../../dtos/AccountDto';
import { AccountService } from '../../../services/AccountService';
import { MailService } from '../../../services/MailService';
import { AccountServiceError } from '../../../errors/AccountServiceError';

// Backs revertAccountChange() in frontend/src/services/api/auth.ts
// (RevertAccountChange page, opened from the "undo" e-mail). No session
// needed: the link itself is the proof, like the password reset link.
const revertAccountChangeRoute: FastifyPluginAsync = async (fastify) => {
    const accountService = new AccountService(fastify.prisma, new MailService(fastify.log));

    const schema: FastifySchema = {
        summary: 'Undo an e-mail / password change with the link of the e-mail',
        tags: ['auth'],
        body: RevertAccountChangeRequestDto,
        response: {
            200: z.object({ restoredEmail: z.boolean(), restoredPassword: z.boolean() }),
            400: z.object({ error: z.string() }),
            409: z.object({ error: z.string() }),
            410: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Body: RevertAccountChangeRequestDtoType }>(
        '/revertAccountChange',
        { schema },
        async (request, reply) => {
            try {
                reply.send(await accountService.revertChange(request.body.token));
            } catch (err) {
                if (err instanceof AccountServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default revertAccountChangeRoute;
