import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';

const deleteItemRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Delete an item',
        description: 'Deletes an item owned by the authenticated user.',
        tags: ['items'],
        security: [{ bearerAuth: [] }],
        params: makeIdParamsDto('id'),
        response: {
            200: z.boolean(),
            401: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.delete<{ Params: { id: string } }>(
        '/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;

            try {
                const deleted = await itemService.deleteItem(userId, id);
                return reply.code(200).send(deleted);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default deleteItemRoute;
