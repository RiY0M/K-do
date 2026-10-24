import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { CreateFriendKdoRequestDto, CreateFriendKdoRequestDtoType } from '../../../dtos/CreateFriendKdoRequestDto';
import { KdoResponseDto } from '../../../dtos/KdoResponseDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

// Backs createFriendKdo(friendId) in frontend/src/services/api/kdos.ts.
const createFriendKdoRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add a surprise gift idea for a friend',
        description:
            "Creates a blank KDo authored by the authenticated user for one of their friends. It shows up on that friend's page for everyone but the friend themself.",
        tags: ['kdo'],
        body: CreateFriendKdoRequestDto,
        response: {
            201: KdoResponseDto,
            403: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Body: CreateFriendKdoRequestDtoType }>(
        '/friend/create',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { friendId } = request.body;

            try {
                const kdo = await itemService.createSurpriseItem(userId, friendId);
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
