import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { UserService } from '../../../services/UserService';
import { UserServiceError } from '../../../errors/UserServiceError';

const ParamsDto = makeIdParamsDto('userId');

// Backs acceptInvite() in frontend/src/services/api/users.ts. :userId is the
// INVITER's id (see CopyLinkButton.tsx, which builds /invite/:userId from
// the current user's own id) - the authenticated caller (from the JWT) is
// the one accepting.
const acceptInviteRoute: FastifyPluginAsync = async (fastify) => {
    const userService = new UserService(fastify.prisma);

    const schema: FastifySchema = {
        summary: "Accept an invite, joining the inviter's shared list",
        tags: ['users'],
        params: ParamsDto,
        response: {
            200: z.object({ success: z.boolean() }),
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Params: { userId: string } }>(
        '/acceptInvite/:userId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const currentUserId = request.user.sub;
            const { userId: inviterUserId } = request.params;

            try {
                await userService.acceptInvite(currentUserId, inviterUserId);
                reply.send({ success: true });
            } catch (err) {
                if (err instanceof UserServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default acceptInviteRoute;
