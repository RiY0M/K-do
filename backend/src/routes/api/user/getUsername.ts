import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { makeIdParamsDto } from '../../../dtos/IdParamsDto';
import { UserService } from '../../../services/UserService';
import { UserServiceError } from '../../../errors/UserServiceError';

const ParamsDto = makeIdParamsDto('userId');

/**
 * Backs getUsername() in frontend/src/services/api/users.ts.
 *
 * NOTE: any authenticated user can look up any other user's username by id -
 * there's no relationship check (e.g. being on a shared list) because the
 * invite screen (frontend/src/pages/Invite.tsx) needs to show the inviter's
 * name *before* the invite has been accepted, i.e. before any relationship
 * exists. TODO: usernames aren't especially sensitive, but if that ever
 * changes this endpoint would need rethinking.
 */
const getUsernameRoute: FastifyPluginAsync = async (fastify) => {
    const userService = new UserService(fastify.prisma);

    const schema: FastifySchema = {
        summary: "Get a user's display name by id",
        tags: ['users'],
        params: ParamsDto,
        response: {
            200: z.string(),
            404: z.object({ error: z.string() }),
        },
    };

    fastify.get<{ Params: { userId: string } }>(
        '/getUsername/:userId',
        { schema, preHandler: fastify.authenticate },
        async (request, reply) => {
            const { userId } = request.params;

            try {
                const username = await userService.getUsername(userId);
                reply.send(username);
            } catch (err) {
                if (err instanceof UserServiceError) {
                    return reply.code(err.statusCode).send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default getUsernameRoute;
