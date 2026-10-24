import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { InvitationService } from '../../../services/InvitationService';
import { InvitationServiceError } from '../../../errors/InvitationServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs acceptInvitation() in frontend/src/services/api/invitations.ts.
// Replaces the old POST /user/acceptInvite/:userId.
const acceptInvitationRoute: FastifyPluginAsync = async (fastify) => {
    const invitationService = new InvitationService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Accept an invitation',
        description:
            "Makes the caller a friend of the inviter and a member of the invitation's list. Returns the inviter's id.",
        tags: ['invitation'],
        params: ParamsDto,
        response: {
            200: z.object({ friendId: z.uuid() }),
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
            410: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Params: { id: string } }>(
        '/accept/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;

            try {
                const friendId = await invitationService.acceptInvitation(userId, id);
                reply.send({ friendId });
            } catch (err) {
                if (err instanceof InvitationServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default acceptInvitationRoute;
