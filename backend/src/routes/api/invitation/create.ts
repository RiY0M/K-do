import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { InvitationResponseDto } from '../../../dtos/InvitationResponseDto';
import { InvitationService } from '../../../services/InvitationService';
import { InvitationServiceError } from '../../../errors/InvitationServiceError';

const ParamsDto = makeIdParamsDto('listId');

// Backs createInvitation() in frontend/src/services/api/invitations.ts (used
// by CopyLinkButton.tsx).
const createInvitationRoute: FastifyPluginAsync = async (fastify) => {
    const invitationService = new InvitationService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get an invitation link to one of my lists',
        description:
            'Returns an invitation valid for 7 days; one that is still valid for at least a day is reused. The frontend shares it as /invite/:id.',
        tags: ['invitation'],
        params: ParamsDto,
        response: {
            201: InvitationResponseDto,
            404: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Params: { listId: string } }>(
        '/create/:listId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { listId } = request.params;

            try {
                const invitation = await invitationService.createInvitation(userId, listId);
                reply.code(201).send(invitation);
            } catch (err) {
                if (err instanceof InvitationServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default createInvitationRoute;
