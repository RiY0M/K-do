import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs deleteKdoLink() in frontend/src/services/api/kdos.ts (LinksModal.tsx).
const deleteKdoLinkRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Remove a link from one of my items',
        tags: ['kdo'],
        params: ParamsDto,
        response: {
            200: z.boolean(),
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.delete<{ Params: { id: string } }>(
        '/link/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;

            try {
                const result = await itemService.deleteLink(userId, id);
                reply.send(result);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default deleteKdoLinkRoute;
