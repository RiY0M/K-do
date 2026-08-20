import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { GroupService } from '../../services/GroupService';

const groupsRoute: FastifyPluginAsync = async (fastify) => {
    const groupService = new GroupService(fastify.prisma);

    const schema: FastifySchema = {
        summary: "Get the authenticated user's groups",
        description:
            'Returns every group the authenticated user belongs to, along with the other members of each group.',
        tags: ['groups'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.array(
                z.object({
                    id: z.string().uuid(),
                    label: z.string(),
                    position: z.number(),
                    friends: z.array(
                        z.object({
                            id: z.string().uuid(),
                            name: z.string(),
                            isFriend: z.boolean(),
                        })
                    ),
                })
            ),
            401: z.object({
                error: z.string(),
            }),
        },
    };

    fastify.get(
        '/',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const groups = await groupService.getMyGroups(userId);
            return reply.code(200).send(groups);
        }
    );
};

export default groupsRoute;
