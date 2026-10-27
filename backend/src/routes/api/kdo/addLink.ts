import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { CreateLinkRequestDto, CreateLinkRequestDtoType } from '../../../dtos/CreateLinkRequestDto';
import { LinkResponseDto } from '../../../dtos/KdoResponseDto';
import { ItemService } from '../../../services/ItemService';
import { ItemServiceError } from '../../../errors/ItemServiceError';

const ParamsDto = makeIdParamsDto('id');

// Backs addKdoLink() in frontend/src/services/api/kdos.ts (LinksModal.tsx).
const addKdoLinkRoute: FastifyPluginAsync = async (fastify) => {
    const itemService = new ItemService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add a link to one of my items',
        tags: ['kdo'],
        params: ParamsDto,
        body: CreateLinkRequestDto,
        response: {
            201: LinkResponseDto,
            400: z.object({ error: z.string() }),
            403: z.object({ error: z.string() }),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.post<{ Params: { id: string }; Body: CreateLinkRequestDtoType }>(
        '/link/:id',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { id } = request.params;
            const { href } = request.body;

            try {
                const link = await itemService.addLink(userId, id, href);
                reply.code(201).send(link);
            } catch (err) {
                if (err instanceof ItemServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default addKdoLinkRoute;
