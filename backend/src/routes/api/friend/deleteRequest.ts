import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { FriendService } from '../../../services/FriendService';
import { FriendServiceError } from '../../../errors/FriendServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs deleteFriendRequest() in frontend/src/services/api/friends.ts.
const deleteFriendRequestRoute: FastifyPluginAsync = async (fastify) => {
    const friendService = new FriendService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Decline a friend request I received, or cancel one I sent',
        tags: ['friend'],
        params: ParamsDto,
        response: {
            200: z.boolean(),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.delete<{ Params: { id: string } }>(
        '/request/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;

            try {
                const result = await friendService.deleteRequest(userId, id);
                reply.send(result);
            } catch (err) {
                if (err instanceof FriendServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default deleteFriendRequestRoute;
