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
        summary: "Get a friend's list",
        description:
            "Returns the friend's own wishes (no authorId, so the frontend renders them as reservable) followed by the surprise ideas added for them (authorId kept on the caller's own ones, so the frontend renders them as editable). Only available to the user's friends. See ListService.getListByFriendId for the full explanation.",
        tags: ['list'],
        params: ParamsDto,
        response: {
            200: ListDetailResponseDto,
            400: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
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
