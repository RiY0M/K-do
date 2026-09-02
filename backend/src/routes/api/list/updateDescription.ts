import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { UpdateListDescriptionRequestDto, UpdateListDescriptionRequestDtoType } from '../../../dtos/UpdateListDescriptionRequestDto';
import { ListService } from '../../../services/ListService';
import { ListServiceError } from '../../../errors/ListServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs updateListDescription() in frontend/src/services/api/lists.ts.
const updateListDescriptionRoute: FastifyPluginAsync = async (fastify) => {
    const listService = new ListService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Update the description of one of my own lists',
        tags: ['list'],
        params: ParamsDto,
        body: UpdateListDescriptionRequestDto,
        response: {
            200: z.object({
                id: z.string().uuid(),
                label: z.string(),
                description: z.string(),
                position: z.number(),
            }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.put<{ Params: { id: string }; Body: UpdateListDescriptionRequestDtoType }>(
        '/updateDescription/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;
            const { description } = request.body;

            try {
                const list = await listService.updateDescription(userId, id, description);
                reply.send(list);
            } catch (err) {
                if (err instanceof ListServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default updateListDescriptionRoute;
