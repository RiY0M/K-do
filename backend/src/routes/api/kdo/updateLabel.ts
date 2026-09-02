import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { UpdateKdoLabelRequestDto, UpdateKdoLabelRequestDtoType } from '../../../dtos/UpdateKdoLabelRequestDto';
import { KdoResponseDto } from '../../../dtos/KdoResponseDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs updateKdoLabel() in frontend/src/services/api/kdos.ts.
const updateKdoLabelRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Rename one of my items',
        tags: ['kdo'],
        params: ParamsDto,
        body: UpdateKdoLabelRequestDto,
        response: {
            200: KdoResponseDto,
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.patch<{ Params: { id: string }; Body: UpdateKdoLabelRequestDtoType }>(
        '/updateLabel/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;
            const { label } = request.body;

            try {
                const kdo = await itemService.updateItem(userId, id, label);
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

export default updateKdoLabelRoute;
