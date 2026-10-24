import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { InvitationResponseDto } from '../../../dtos/InvitationResponseDto';
import { InvitationService } from '../../../services/InvitationService';
import { InvitationServiceError } from '../../../errors/InvitationServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs getInvitation() in frontend/src/services/api/invitations.ts (used by
// the Invite page to show who is inviting you, before accepting).
const getInvitationRoute: FastifyPluginAsync = async (fastify) => {
    const invitationService = new InvitationService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get an invitation',
        tags: ['invitation'],
        params: ParamsDto,
        response: {
            200: InvitationResponseDto,
            404: z.object({ error: z.string() }),
            410: z.object({ error: z.string() }),
        },
    };

    fastify.get<{ Params: { id: string } }>(
        '/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;

            try {
                const invitation = await invitationService.getInvitation(userId, id);
                reply.send(invitation);
            } catch (err) {
                if (err instanceof InvitationServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default getInvitationRoute;
