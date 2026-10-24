import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { FriendshipResponseDto } from '../../../dtos/FriendshipResponseDto';
import { FriendService } from '../../../services/FriendService';
import { FriendServiceError } from '../../../errors/FriendServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs acceptFriendRequest() in frontend/src/services/api/friends.ts.
const acceptFriendRequestRoute: FastifyPluginAsync = async (fastify) => {
    const friendService = new FriendService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Accept a friend request I received',
        tags: ['friend'],
        params: ParamsDto,
        response: {
            200: FriendshipResponseDto,
            404: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Params: { id: string } }>(
        '/accept/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;

            try {
                const friendship = await friendService.acceptRequest(userId, id);
                reply.send(friendship);
            } catch (err) {
                if (err instanceof FriendServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default acceptFriendRequestRoute;
