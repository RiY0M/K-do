import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { KdoResponseDto } from '../../../dtos/KdoResponseDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

const ParamsDto = makeIdParamsDto('listId');

// Backs createMyKdo() in frontend/src/services/api/kdos.ts.
const createMyKdoRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Create a new blank item on one of my own lists',
        description:
            'Creates a KDo authored by the authenticated user on the given list. The label starts blank and is filled in afterwards via PATCH /kdo/updateLabel/:id.',
        tags: ['kdo'],
        params: ParamsDto,
        response: {
            201: KdoResponseDto,
            404: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Params: { listId: string } }>(
        '/me/create/:listId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { listId } = request.params;

            try {
                const kdo = await itemService.createItem(userId, listId);
                reply.code(201).send(kdo);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default createMyKdoRoute;
