import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { ListSummaryResponseDto } from '../../../dtos/ListResponseDto';
import { ListService } from '../../../services/ListService';

// Backs getMyLists() in frontend/src/services/api/lists.ts.
//
// NOTE: with `baseEndpoint = "/list"` in the frontend, this ends up served
// at GET /api/list/lists - a bit of a mouthful. Left as-is to match what the
// frontend currently calls; consider renaming the frontend call to
// `${baseEndpoint}` or `${baseEndpoint}/mine` later if you'd like to clean
// this up (and update this route to match).
const listsRoute: FastifyPluginAsync = async (fastify) => {
    const listService = new ListService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'List the groups (Lists) I belong to',
        tags: ['list'],
        response: {
            200: z.array(ListSummaryResponseDto),
        },
    };

    fastify.get('/lists', { schema, preHandler: fastify.authenticate }, async (request, reply) => {
        const userId = request.user.sub;
        const lists = await listService.getMyLists(userId);
        reply.send(lists);
    });
};

export default listsRoute;
