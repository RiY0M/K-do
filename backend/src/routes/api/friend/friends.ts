import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { FriendOverviewDto } from '../../../dtos/FriendOverviewDto';
import { FriendService } from '../../../services/FriendService';

// Backs getFriends() in frontend/src/services/api/friends.ts.
const getFriendsRoute: FastifyPluginAsync = async (fastify) => {
    const friendService = new FriendService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'List my friends, with the news of their lists and the gifts I took for them',
        tags: ['friend'],
        response: {
            200: z.array(FriendOverviewDto),
        },
    };

    fastify.get('/friends', { schema, preHandler: fastify.authenticate }, async (request, reply) => {
        const userId = request.user.sub;
        const friends = await friendService.getFriends(userId);
        reply.send(friends);
    });
};

export default getFriendsRoute;
