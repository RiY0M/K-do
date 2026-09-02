import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { CreateFriendKdoRequestDto, CreateFriendKdoRequestDtoType } from '../../../dtos/CreateFriendKdoRequestDto';
import { KdoResponseDto } from '../../../dtos/KdoResponseDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

/**
 * Backs createFriendKdo() in frontend/src/services/api/kdos.ts.
 *
 * TODO: that frontend function currently takes no arguments and sends no
 * body, so it can't reach this route successfully as-is - see
 * CreateFriendKdoRequestDto.ts and ItemService.createSurpriseItem for the
 * full explanation. It needs to be updated to accept/send `{ listId }`.
 */
const createFriendKdoRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: "Add a surprise gift idea to a list shared with a friend",
        description:
            "Creates a KDo authored by the authenticated user on a list they share with someone else, so it appears on that person's page without revealing who suggested it.",
        tags: ['kdo'],
        body: CreateFriendKdoRequestDto,
        response: {
            201: KdoResponseDto,
            404: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Body: CreateFriendKdoRequestDtoType }>(
        '/friend/create',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { listId } = request.body;

            try {
                const kdo = await itemService.createSurpriseItem(userId, listId);
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

export default createFriendKdoRoute;
