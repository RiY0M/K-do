import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';
import {
    CreateItemRequestDto,
    CreateItemRequestDtoType,
} from '../../../dtos/CreateItemRequestDto';
import { ItemResponseDto } from '../../../dtos/ItemResponseDto';

const createItemRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Create an item',
        description: "Adds a new gift item to the authenticated user's list for a group.",
        tags: ['items'],
        security: [{ bearerAuth: [] }],
        body: CreateItemRequestDto,
        response: {
            201: ItemResponseDto,
            401: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Body: CreateItemRequestDtoType }>(
        '/',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { groupId, value } = request.body;

            try {
                const item = await itemService.createItem(userId, groupId, value);
                return reply.code(201).send(item);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default createItemRoute;
