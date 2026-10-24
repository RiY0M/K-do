import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import {
    SendFriendRequestRequestDto,
    SendFriendRequestRequestDtoType,
} from '../../../dtos/SendFriendRequestRequestDto';
import { FriendshipResponseDto } from '../../../dtos/FriendshipResponseDto';
import { FriendService } from '../../../services/FriendService';
import { FriendServiceError } from '../../../errors/FriendServiceError';

// Backs sendFriendRequest() in frontend/src/services/api/friends.ts.
const sendFriendRequestRoute: FastifyPluginAsync = async (fastify) => {
    const friendService = new FriendService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Send a friend request by username',
        description:
            'Sends a friend request to the user with this exact username. If they had already sent one to the caller, it is accepted instead (status ACCEPTED).',
        tags: ['friend'],
        body: SendFriendRequestRequestDto,
        response: {
            201: FriendshipResponseDto,
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
            409: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Body: SendFriendRequestRequestDtoType }>(
        '/request',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { name } = request.body;

            try {
                const friendship = await friendService.sendRequest(userId, name);
                reply.code(201).send(friendship);
            } catch (err) {
                if (err instanceof FriendServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default sendFriendRequestRoute;
