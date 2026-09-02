import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { CreateListRequestDto, CreateListRequestDtoType } from '../../../dtos/CreateListRequestDto';
import { ListSummaryResponseDto } from '../../../dtos/ListResponseDto';
import { ListService } from '../../../services/ListService';

// Backs createList() in frontend/src/services/api/lists.ts.
const createListRoute: FastifyPluginAsync = async (fastify) => {
    const listService = new ListService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Create a new list, authored by me',
        tags: ['list'],
        body: CreateListRequestDto,
        response: {
            201: ListSummaryResponseDto,
        },
    };

    fastify.post<{ Body: CreateListRequestDtoType }>(
        '/create',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const userId = request.user.sub;
            const { label } = request.body;

            const list = await listService.createList(userId, label);
            reply.code(201).send(list);
        }
    );
};

export default createListRoute;
