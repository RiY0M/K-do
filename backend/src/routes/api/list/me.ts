import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { ListDetailResponseDto } from '../../../dtos/ListResponseDto';
import { ListService } from '../../../services/ListService';
import { ListServiceError } from '../../../errors/ListServiceError';

const ParamsDto = makeIdParamsDto('listId');

// Backs getMyListDetail() in frontend/src/services/api/lists.ts.
const getMyListRoute: FastifyPluginAsync = async (fastify) => {
    const listService = new ListService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get the detail of one of my own lists',
        description: "Returns the list's own metadata plus the authenticated user's own items on it, split into checked/unchecked.",
        tags: ['list'],
        params: ParamsDto,
        response: {
            200: ListDetailResponseDto,
            404: z.object({ error: z.string() }),
        },
    };

    fastify.get<{ Params: { listId: string } }>(
        '/me/:listId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { listId } = request.params;

            try {
                const list = await listService.getMyListByListId(userId, listId);
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

export default getMyListRoute;
