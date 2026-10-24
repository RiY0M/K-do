import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { FriendRequestsResponseDto } from '../../../dtos/FriendshipResponseDto';
import { FriendService } from '../../../services/FriendService';

// Backs getFriendRequests() in frontend/src/services/api/friends.ts.
const getFriendRequestsRoute: FastifyPluginAsync = async (fastify) => {
    const friendService = new FriendService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'List my pending friend requests, received and sent',
        tags: ['friend'],
        response: {
            200: FriendRequestsResponseDto,
        },
    };

    fastify.get('/requests', { schema, preHandler: fastify.authenticate }, async (request, reply) => {
        const userId = request.user.sub;
        const requests = await friendService.getRequests(userId);
        reply.send(requests);
    });
};

export default getFriendRequestsRoute;
