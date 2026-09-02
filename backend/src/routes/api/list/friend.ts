import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { ListDetailResponseDto } from '../../../dtos/ListResponseDto';
import { ListService } from '../../../services/ListService';
import { ListServiceError } from '../../../errors/ListServiceError';

const ParamsDto = makeIdParamsDto('friendId');

const getFriendListRoute: FastifyPluginAsync = async (fastify) => {
    const listService = new ListService(fastify.prisma);

    const schema: FastifySchema = {
        summary: "Get a friend's list, from a list shared with them",
        description:
            "Returns the friend's own wishlist items (no authorId, so the frontend renders them as reservable) merged with any surprise ideas the caller added to the same shared list (authorId kept, so the frontend renders them as editable). See ListService.getListByFriendId for the full explanation.",
        tags: ['list'],
        params: ParamsDto,
        response: {
            200: ListDetailResponseDto,
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.get<{ Params: { friendId: string } }>(
        '/friend/:friendId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { friendId } = request.params;

            try {
                const list = await listService.getListByFriendId(userId, friendId);
                reply.send(list);
            } catch (err) {
                if (err instanceof ListServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default getFriendListRoute;
