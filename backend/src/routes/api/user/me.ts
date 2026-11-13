import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import {
    AccountResponseDto,
    NotificationSettingsDto,
    UpdateNotificationSettingsRequestDto,
    UpdateNotificationSettingsRequestDtoType,
    UpdateAccountRequestDto,
    UpdateAccountRequestDtoType,
    UpdateAccountResponseDto,
} from '../../../dtos/AccountDto';
import { AccountService } from '../../../services/AccountService';
import { MailService } from '../../../services/MailService';
import { AccountServiceError } from '../../../errors/AccountServiceError';
import { REFRESHED_TOKEN_HEADER } from '../../../plugins/jwt';

// Backs getMyAccount() and updateMyAccount() in
// frontend/src/services/api/users.ts (Account page).
const meRoute: FastifyPluginAsync = async (fastify) => {
    const accountService = new AccountService(fastify.prisma, new MailService(fastify.log));

    const getSchema: FastifySchema = {
        summary: 'My account (name and e-mail)',
        tags: ['users'],
        response: {
            200: AccountResponseDto,
            404: z.object({ error: z.string() }),
        },
    };

    fastify.get('/me', { schema: getSchema, preHandler: fastify.authenticate }, async (request, reply) => {
        try {
            reply.send(await accountService.getAccount(request.user.sub));
        } catch (err) {
            if (err instanceof AccountServiceError) {
                return reply.code(err.statusCode).send({ error: err.message });
            }
            throw err;
        }
    });

    const patchSchema: FastifySchema = {
        summary: 'Change my name, e-mail address or password',
        description:
            'Changing the e-mail or password requires the current password, logs out the other sessions and e-mails the previous address a link to undo it for 7 days.',
        tags: ['users'],
        body: UpdateAccountRequestDto,
        response: {
            200: UpdateAccountResponseDto,
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
            409: z.object({ error: z.string() }),
        },
    };

    fastify.patch<{ Body: UpdateAccountRequestDtoType }>(
        '/me',
        { schema: patchSchema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;

            try {
                const { account, undoEmailSentTo, tokenVersion } = await accountService.updateAccount(userId, request.body);

                // `authenticate` already sent a renewed token, but signed with
                // the old version: this one keeps the caller logged in after
                // the other sessions were logged out
                reply.header(REFRESHED_TOKEN_HEADER, fastify.signToken(userId, tokenVersion));
                reply.send({ ...account, undoEmailSentTo });
            } catch (err) {
                if (err instanceof AccountServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );

    const notificationsSchema: FastifySchema = {
        summary: 'Choose which changes on friends\' lists show up as news on the home page',
        tags: ['users'],
        body: UpdateNotificationSettingsRequestDto,
        response: {
            200: NotificationSettingsDto,
        },
    };

    fastify.patch<{ Body: UpdateNotificationSettingsRequestDtoType }>(
        '/me/notifications',
        { schema: notificationsSchema, preHandler: fastify.authenticate },
        async (request, reply) => {
            reply.send(await accountService.updateNotifications(request.user.sub, request.body));
        }
    );
};

export default meRoute;
