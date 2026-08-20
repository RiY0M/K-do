import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';
import { ItemResponseDto } from '../../../dtos/ItemResponseDto';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';

const checkItemRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Toggle an item as checked',
        description:
            'Toggles the checked state of an item owned by the authenticated user.',
        tags: ['items'],
        security: [{ bearerAuth: [] }],
        params: makeIdParamsDto('id'),
        response: {
            200: ItemResponseDto,
            401: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.patch<{ Params: { id: string } }>(
        '/:id/check',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;

            try {
                const item = await itemService.checkItem(userId, id);
                return reply.code(200).send(item);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default checkItemRoute;
