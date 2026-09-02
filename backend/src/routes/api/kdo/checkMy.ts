import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { SetCheckedRequestDto, SetCheckedRequestDtoType } from '../../../dtos/SetCheckedRequestDto';
import { KdoResponseDto } from '../../../dtos/KdoResponseDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs checkMyKdo(id, isChecked) in frontend/src/services/api/kdos.ts - sets
// the author's own "done/planned" flag on one of their own items.
const checkMyKdoRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Set my own check mark on one of my items',
        tags: ['kdo'],
        params: ParamsDto,
        body: SetCheckedRequestDto,
        response: {
            200: KdoResponseDto,
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.patch<{ Params: { id: string }; Body: SetCheckedRequestDtoType }>(
        '/me/check/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;
            const { isChecked } = request.body;

            try {
                const kdo = await itemService.checkItem(userId, id, isChecked);
                reply.send(kdo);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default checkMyKdoRoute;
