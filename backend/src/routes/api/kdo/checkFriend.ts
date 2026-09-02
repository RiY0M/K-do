import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { SetCheckedRequestDto, SetCheckedRequestDtoType } from '../../../dtos/SetCheckedRequestDto';
import { KdoResponseDto } from '../../../dtos/KdoResponseDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs checkFriendKdo(id, isChecked) in frontend/src/services/api/kdos.ts -
// sets whether the authenticated user has reserved/taken a friend's gift
// idea (never the item's own author - see ItemService.setTaken).
const checkFriendKdoRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: "Set my reservation on a friend's item",
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
        '/friend/check/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;
            const { isChecked } = request.body;

            try {
                const kdo = await itemService.setTaken(userId, id, isChecked);
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

export default checkFriendKdoRoute;
