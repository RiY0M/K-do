import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ListService } from '../../services/ListService';
import { ListServiceError } from '../../errors/ListServiceError';
import { makeIdParamsDto } from '../../dtos/IdParamsDto';

const ListResponseDto = z.object({
    id: z.string().uuid(),
    description: z.string(),
    uncheckedItems: z.array(
        z.object({
            id: z.string().uuid(),
            value: z.string(),
            isChecked: z.boolean(),
            position: z.number(),
        })
    ),
    checkedItems: z.array(
        z.object({
            id: z.string().uuid(),
            value: z.string(),
            isChecked: z.boolean(),
            position: z.number(),
        })
    ),
});

const listsRoute: FastifyPluginAsync = async (fastify) => {
    const listService = new ListService(fastify.prisma);

    const meSchema: FastifySchema = {
        summary: "Get the authenticated user's list for a group",
        description:
            "Returns the authenticated user's gift items that are shared with the given group.",
        tags: ['lists'],
        security: [{ bearerAuth: [] }],
        params: makeIdParamsDto('groupId'),
        response: {
            200: ListResponseDto,
            401: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.get<{ Params: { groupId: string } }>(
        '/me/:groupId',
        { schema: meSchema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { groupId } = request.params;

            try {
                const list = await listService.getMyListByGroupId(userId, groupId);
                return reply.code(200).send(list);
            } catch (err) {
                if (err instanceof ListServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );

    const friendSchema: FastifySchema = {
        summary: "Get a friend's list",
        description:
            "Returns a friend's gift items that are shared with a group the authenticated user also belongs to.",
        tags: ['lists'],
        security: [{ bearerAuth: [] }],
        params: makeIdParamsDto('friendId'),
        response: {
            200: ListResponseDto,
            401: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.get<{ Params: { friendId: string } }>(
        '/friend/:friendId',
        { schema: friendSchema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { friendId } = request.params;

            try {
                const list = await listService.getListByFriendId(userId, friendId);
                return reply.code(200).send(list);
            } catch (err) {
                if (err instanceof ListServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default listsRoute;
