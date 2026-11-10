import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ReorderKdosRequestDto, ReorderKdosRequestDtoType } from '../../../dtos/ReorderKdosRequestDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

// Backs reorderMyKdos() in frontend/src/services/api/kdos.ts.
const reorderKdosRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Reorder my items on one of my lists',
        tags: ['kdo'],
        body: ReorderKdosRequestDto,
        response: {
            200: z.boolean(),
            400: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.patch<{ Body: ReorderKdosRequestDtoType }>(
        '/me/reorder',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { listId, kdoIds } = request.body;

            try {
                const result = await itemService.reorderItems(userId, listId, kdoIds);
                reply.send(result);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default reorderKdosRoute;
