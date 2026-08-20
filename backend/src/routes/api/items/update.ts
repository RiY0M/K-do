import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';
import {
    UpdateItemRequestDto,
    UpdateItemRequestDtoType,
} from '../../../dtos/UpdateItemRequestDto';
import { ItemResponseDto } from '../../../dtos/ItemResponseDto';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';

const updateItemRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Update an item',
        description: 'Updates the value of an item owned by the authenticated user.',
        tags: ['items'],
        security: [{ bearerAuth: [] }],
        params: makeIdParamsDto('id'),
        body: UpdateItemRequestDto,
        response: {
            200: ItemResponseDto,
            401: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.put<{ Params: { id: string }; Body: UpdateItemRequestDtoType }>(
        '/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;
            const { value } = request.body;

            try {
                const item = await itemService.updateItem(userId, id, value);
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

export default updateItemRoute;
