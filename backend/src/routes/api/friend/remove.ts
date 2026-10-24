import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { FriendService } from '../../../services/FriendService';
import { FriendServiceError } from '../../../errors/FriendServiceError';

const ParamsDto = makeIdParamsDto('friendId');

// Backs removeFriend() in frontend/src/services/api/friends.ts.
const removeFriendRoute: FastifyPluginAsync = async (fastify) => {
    const friendService = new FriendService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Remove a friend',
        description:
            "Ends the friendship: both users leave each other's lists and lose their reservations on each other's items.",
        tags: ['friend'],
        params: ParamsDto,
        response: {
            200: z.boolean(),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.delete<{ Params: { friendId: string } }>(
        '/:friendId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { friendId } = request.params;

            try {
                const result = await friendService.removeFriend(userId, friendId);
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

export default removeFriendRoute;
